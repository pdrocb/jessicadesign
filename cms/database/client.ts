import "server-only";

import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let client: NeonQueryFunction<false, false> | undefined;

export function isCmsDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function getCmsDatabase() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("CMS_DATABASE_NOT_CONFIGURED");
  }

  client ??= neon(connectionString);
  return client;
}

export function isCmsDatabaseConnectionError(error: unknown) {
  let current = error;

  for (let depth = 0; depth < 4 && current; depth += 1) {
    const message =
      current instanceof Error
        ? current.message
        : typeof current === "object" && "message" in current
          ? String(current.message)
          : "";

    if (
      /fetch failed|error connecting to database|econnrefused|econnreset|enotfound|etimedout/i.test(
        message,
      )
    ) {
      return true;
    }

    current =
      typeof current === "object" && current !== null && "cause" in current
        ? current.cause
        : undefined;
  }

  return false;
}
