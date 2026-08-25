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

for (const migrationFile of migrationFiles) {
  const migration = await readFile(new URL(migrationFile, migrationsUrl), "utf8");
  const statements = migration
    .split(/;\s*(?:\n|$)/)
    .map((statement) => statement.trim())
    .filter((statement) => statement && statement !== "BEGIN" && statement !== "COMMIT");

  for (const statement of statements) {
    await sql.query(statement);
    statementCount += 1;
  }
}

console.log(`CMS schema ready (${migrationFiles.length} migrations, ${statementCount} statements).`);
