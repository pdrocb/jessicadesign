import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { CmsUser } from "@/cms/auth/session";

const COOKIE_NAME = "studio-cms-session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30;
const developmentSecret = "jsd-local-development-cookie-secret-not-for-production";

type CmsSessionPayload = CmsUser & { issuedAt: number; expiresAt: number };

function getSessionSecret() {
  const configuredSecret = process.env.NEON_AUTH_COOKIE_SECRET;
  const secret =
    configuredSecret && configuredSecret.length >= 32
      ? configuredSecret
      : process.env.NODE_ENV === "development"
        ? developmentSecret
        : undefined;

  if (!secret) throw new Error("CMS_SESSION_SECRET_NOT_CONFIGURED");
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function encode(payload: CmsSessionPayload) {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${sign(data)}`;
}

function decode(value: string): CmsSessionPayload | null {
  const [data, signature, extra] = value.split(".");
  if (!data || !signature || extra) return null;

  const expected = sign(data);
  const receivedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    receivedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(receivedBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as Partial<CmsSessionPayload>;
    if (
      typeof payload.id !== "string" ||
      typeof payload.name !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.issuedAt !== "number" ||
      typeof payload.expiresAt !== "number" ||
      payload.expiresAt <= Date.now()
    ) {
      return null;
    }
    return payload as CmsSessionPayload;
  } catch {
    return null;
  }
}

export async function createCmsSession(user: CmsUser) {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + SESSION_DURATION_SECONDS * 1000;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, encode({ ...user, issuedAt, expiresAt }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
    priority: "high",
  });
}

export async function readCmsSession() {
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  return value ? decode(value) : null;
}

export async function deleteCmsSession() {
  (await cookies()).delete(COOKIE_NAME);
}
