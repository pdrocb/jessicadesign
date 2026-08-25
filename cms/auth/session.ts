import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { getCmsDatabase, isCmsDatabaseConfigured } from "@/cms/database/client";
import { readCmsSession } from "@/cms/auth/cms-session";

export type CmsUser = {
  id: string;
  name: string;
  email: string;
};

type AuthorizedCmsUser = CmsUser & { password_updated_at: string | null };

export const getOptionalSession = cache(async (): Promise<CmsUser | null> => {
  if (!isCmsDatabaseConfigured()) return null;

  const session = await readCmsSession();
  if (!session) return null;

  const sql = getCmsDatabase();
  const rows = (await sql.query(
    `SELECT COALESCE(ca.auth_user_id, $2) AS id,
            ca.name,
            ca.email,
            account."updatedAt" AS password_updated_at
       FROM cms_access ca
       LEFT JOIN neon_auth.account account
         ON account."userId"::text = COALESCE(ca.auth_user_id, $2)::text
        AND account."providerId" = 'credential'
      WHERE ca.email = $1
        AND ca.is_active = true
        AND (ca.auth_user_id IS NULL OR ca.auth_user_id = $2)
      LIMIT 1`,
    [session.email.toLowerCase(), session.id],
  )) as AuthorizedCmsUser[];

  const user = rows[0];
  if (!user) return null;
  const passwordUpdatedAt = user.password_updated_at
    ? new Date(user.password_updated_at).getTime()
    : Number.NaN;
  if (!Number.isFinite(passwordUpdatedAt) || passwordUpdatedAt > session.issuedAt) {
    return null;
  }

  await sql.query(
    `UPDATE cms_access
        SET auth_user_id = COALESCE(auth_user_id, $2), updated_at = now()
      WHERE email = $1`,
    [session.email.toLowerCase(), session.id],
  );
  return { id: user.id, name: user.name, email: user.email };
});

export async function requireSession() {
  const user = await getOptionalSession();
  if (!user) redirect("/admin/login");
  return user;
}
