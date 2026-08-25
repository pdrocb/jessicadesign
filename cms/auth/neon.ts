import "server-only";

import { createNeonAuth } from "@neondatabase/auth/next/server";

const baseUrl = process.env.NEON_AUTH_BASE_URL;
const configuredSecret = process.env.NEON_AUTH_COOKIE_SECRET;
const cookieSecret =
  configuredSecret && configuredSecret.length >= 32
    ? configuredSecret
    : process.env.NODE_ENV === "development"
      ? "jsd-local-development-cookie-secret-not-for-production"
      : undefined;

if (!baseUrl || !cookieSecret) {
  throw new Error("NEON_AUTH_NOT_CONFIGURED");
}

export const auth = createNeonAuth({
  baseUrl,
  cookies: {
    secret: cookieSecret,
    sessionDataTtl: 300,
  },
});
