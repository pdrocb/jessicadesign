import { createAuthClient } from "@neondatabase/auth";
import { BetterAuthVanillaAdapter } from "@neondatabase/auth/vanilla";
import { neon } from "@neondatabase/serverless";
import process from "node:process";

const [name, rawEmail] = process.argv.slice(2);
const email = rawEmail?.trim().toLowerCase();

if (!process.env.DATABASE_URL || !process.env.NEON_AUTH_BASE_URL) {
  throw new Error("DATABASE_URL and NEON_AUTH_BASE_URL are required.");
}

if (!name?.trim() || !email) {
  throw new Error('Usage: npm run cms:user -- "Full name" "email@example.com"');
}

let password = "";
for await (const chunk of process.stdin) password += chunk;
password = password.trim();
if (password.length < 12) {
  throw new Error("Provide a password of at least 12 characters through stdin.");
}

const siteURL = new URL(
  process.env.CMS_SITE_URL ?? "http://localhost:3000",
);
const auth = createAuthClient(process.env.NEON_AUTH_BASE_URL, {
  adapter: BetterAuthVanillaAdapter({
    fetchOptions: { headers: { Origin: siteURL.origin } },
  }),
});
const { data, error } = await auth.signUp.email({
  name: name.trim(),
  email,
  password,
});
if (error || !data?.user) {
  throw new Error(error?.message ?? "Neon Auth could not create the user.");
}

const sql = neon(process.env.DATABASE_URL);
await sql.query(
  `INSERT INTO cms_access (email, auth_user_id, name, is_active, is_owner)
   VALUES ($1, $2, $3, true, false)
   ON CONFLICT (email) DO UPDATE
     SET auth_user_id = EXCLUDED.auth_user_id,
         name = EXCLUDED.name,
         is_active = true,
         updated_at = now()`,
  [email, data.user.id, name.trim()],
);

console.log(`CMS user ready: ${email}`);
