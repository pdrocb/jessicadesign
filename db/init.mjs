import { readdir, readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required.");
}

const migrationsUrl = new URL("./migrations/", import.meta.url);
const migrationFiles = (await readdir(migrationsUrl))
  .filter((file) => file.endsWith(".sql"))
  .sort();
const sql = neon(process.env.DATABASE_URL);
let statementCount = 0;

await sql.query(`CREATE TABLE IF NOT EXISTS cms_schema_migrations (
  filename text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
)`);

const appliedRows = await sql.query("SELECT filename FROM cms_schema_migrations");
const appliedMigrations = new Set(appliedRows.map(({ filename }) => filename));

// Databases created before migration tracking already contain this baseline.
if (appliedMigrations.size === 0) {
  const [{ cmsProjectsTable }] = await sql.query(
    "SELECT to_regclass('public.cms_projects')::text AS \"cmsProjectsTable\"",
  );
  if (cmsProjectsTable) {
    const legacyMigrations = migrationFiles.filter(
      (file) => file <= "0003_restore_wix_lookbook_order.sql",
    );
    for (const filename of legacyMigrations) {
      await sql.query(
        "INSERT INTO cms_schema_migrations (filename) VALUES ($1) ON CONFLICT (filename) DO NOTHING",
        [filename],
      );
      appliedMigrations.add(filename);
    }
  }
}

for (const migrationFile of migrationFiles) {
  if (appliedMigrations.has(migrationFile)) continue;
  const migration = await readFile(new URL(migrationFile, migrationsUrl), "utf8");
  const statements = migration
    .split(/;\s*(?:\n|$)/)
    .map((statement) => statement.trim())
    .filter((statement) => statement && statement !== "BEGIN" && statement !== "COMMIT");

  await sql.transaction((transaction) => [
    ...statements.map((statement) => transaction.query(statement)),
    transaction.query(
      "INSERT INTO cms_schema_migrations (filename) VALUES ($1)",
      [migrationFile],
    ),
  ]);
  statementCount += statements.length;
}

console.log(`CMS schema ready (${migrationFiles.length} migrations, ${statementCount} statements applied).`);
