import { neon } from "@neondatabase/serverless";
import { hashPassword } from "better-auth/crypto";
import process from "node:process";

const [rawEmail] = process.argv.slice(2);
const email = rawEmail?.trim().toLowerCase();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required.");
}

if (!email) {
  throw new Error('Usage: npm run cms:password -- "email@example.com"');
}

let password = "";
for await (const chunk of process.stdin) password += chunk;
password = password.trim();
if (password.length < 12) {
  throw new Error("Provide a password of at least 12 characters through stdin.");
}

const sql = neon(process.env.DATABASE_URL);
const users = await sql.query(
  `SELECT u.id
     FROM neon_auth."user" u
     JOIN public.cms_access ca ON lower(ca.email) = lower(u.email)
    WHERE lower(u.email) = lower($1)
      AND ca.is_active = true
    LIMIT 1`,
  [email],
);
const user = users[0];
if (!user) {
  throw new Error("No active CMS user exists for that email.");
}

const hashedPassword = await hashPassword(password);
const accounts = await sql.query(
  `UPDATE neon_auth.account
      SET password = $2,
          "updatedAt" = now()
    WHERE "userId" = $1
      AND "providerId" = 'credential'
  RETURNING id`,
  [user.id, hashedPassword],
);
if (!accounts[0]) {
  throw new Error("The CMS user does not have a credential account.");
}

await sql.query(
  `DELETE FROM neon_auth.session
    WHERE "userId" = $1`,
  [user.id],
);

console.log(`CMS password reset and previous sessions revoked: ${email}`);
