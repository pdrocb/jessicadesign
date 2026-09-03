import "server-only";

import {
  getCmsDatabase,
  isCmsDatabaseConfigured,
  isCmsDatabaseConnectionError,
} from "@/cms/database/client";

export type LookBookDocument = {
  heading: string;
  introduction: string;
  metaTitle: string;
  metaDescription: string;
};

export const defaultLookBookDocument: LookBookDocument = {
  heading: "The Look Book",
  introduction:
    "Weddings, dinner receptions, and thoughtfully styled gatherings across the Hudson Valley, New York City, and beyond.",
  metaTitle: "Look Book | Jessica S. Designs",
  metaDescription:
    "Explore weddings, dinner receptions, and styled celebrations designed by Jessica S. Designs across the Hudson Valley, New York City, and beyond.",
};

const limits: Record<keyof LookBookDocument, number> = {
  heading: 160,
  introduction: 500,
  metaTitle: 80,
  metaDescription: 320,
};

export async function getLookBookDocument(): Promise<LookBookDocument> {
  if (!isCmsDatabaseConfigured()) return { ...defaultLookBookDocument };

  let rows: { data: Record<string, unknown> }[];
  try {
    const sql = getCmsDatabase();
    rows = (await sql.query(
      "SELECT data FROM cms_documents WHERE key = 'look_book' LIMIT 1",
    )) as { data: Record<string, unknown> }[];
  } catch (error) {
    if (isCmsDatabaseConnectionError(error)) return { ...defaultLookBookDocument };
    throw error;
  }

  const stored = rows[0]?.data ?? {};
  return Object.fromEntries(
    Object.entries(defaultLookBookDocument).map(([key, fallback]) => {
      const value = stored[key];
      const limit = limits[key as keyof LookBookDocument];
      return [key, typeof value === "string" && value.trim() && value.trim().length <= limit
        ? value.trim()
        : fallback];
    }),
  ) as LookBookDocument;
}
