"use server";

import { redirect } from "next/navigation";
import {
  getCmsDatabase,
  isCmsDatabaseConfigured,
  isCmsDatabaseConnectionError,
} from "@/cms/database/client";
import { auth } from "@/cms/auth/neon";
import { createCmsSession, deleteCmsSession } from "@/cms/auth/cms-session";

export type LoginState = { message: string };

function isInvalidCredentials(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const status = "status" in error ? Number(error.status) : 0;
  const code = "code" in error ? String(error.code) : "";
  const message = "message" in error ? String(error.message) : "";
  return (
    status === 401 ||
    /invalid.*(password|credential)|incorrect.*password|user.*not.*found/i.test(`${code} ${message}`)
  );
}

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !email.includes("@") || !password) {
    return { message: "Enter your email and password." };
  }

  if (!isCmsDatabaseConfigured()) {
    return { message: "The CMS connection has not been configured yet." };
  }

  const sql = getCmsDatabase();
  let access: { email: string }[];
  try {
    access = (await sql.query(
      `SELECT email
         FROM cms_access
        WHERE email = $1 AND is_active = true
        LIMIT 1`,
      [email],
    )) as { email: string }[];
  } catch (error) {
    if (isCmsDatabaseConnectionError(error)) {
      return { message: "The CMS is temporarily unavailable. Please try again." };
    }
    throw error;
  }

  if (!access[0]) {
    return { message: "The email or password is incorrect." };
  }

  let result: Awaited<ReturnType<typeof auth.signIn.email>>;
  try {
    result = await auth.signIn.email({ email, password, rememberMe: true });
  } catch (error) {
    console.error("Neon Auth sign-in failed", error);
    return { message: "The authentication service is temporarily unavailable. Please try again." };
  }

  const { data, error } = result;
  if (error || !data?.user) {
    if (error && !isInvalidCredentials(error)) {
      console.error("Neon Auth rejected sign-in", {
        status: "status" in error ? error.status : undefined,
        code: "code" in error ? error.code : undefined,
      });
      return { message: "The authentication service could not complete sign in. Please try again." };
    }
    return { message: "The email or password is incorrect." };
  }

  const linked = (await sql.query(
    `UPDATE cms_access
        SET auth_user_id = COALESCE(auth_user_id, $2),
            last_login_at = now(),
            updated_at = now()
      WHERE email = $1
        AND (auth_user_id IS NULL OR auth_user_id = $2)
      RETURNING email`,
    [email, data.user.id],
  )) as { email: string }[];
  if (!linked[0]) {
    await auth.signOut();
    return { message: "This account is not authorized for the CMS." };
  }
  await createCmsSession({
    id: data.user.id,
    name: data.user.name,
    email: data.user.email.toLowerCase(),
  });
  redirect("/admin");
}

export async function logout() {
  await deleteCmsSession();
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Neon Auth sign-out failed", error);
  }
  redirect("/admin/login");
}
