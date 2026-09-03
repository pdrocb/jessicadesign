import "server-only";

import {
  getCmsDatabase,
  isCmsDatabaseConfigured,
  isCmsDatabaseConnectionError,
} from "@/cms/database/client";
import { inquiry } from "@/lib/content";

export type InquireDocument = {
  heading: string;
  introduction: string;
  metaTitle: string;
  metaDescription: string;
};

export const defaultInquireDocument: InquireDocument = {
  heading: inquiry.heading,
  introduction: inquiry.intro,
  metaTitle: "Inquire | Jessica S. Designs",
  metaDescription:
    "Tell Jessica S. Designs about your wedding or celebration. Every inquiry begins with a complimentary one-hour design consultation.",
};

const limits: Record<keyof InquireDocument, number> = {
  heading: 160,
  introduction: 500,
  metaTitle: 80,
  metaDescription: 320,
};

export async function getInquireDocument(): Promise<InquireDocument> {
  if (!isCmsDatabaseConfigured()) return { ...defaultInquireDocument };

  let rows: { data: Record<string, unknown> }[];
  try {
    const sql = getCmsDatabase();
    rows = (await sql.query(
      "SELECT data FROM cms_documents WHERE key = 'inquire' LIMIT 1",
    )) as { data: Record<string, unknown> }[];
  } catch (error) {
    if (isCmsDatabaseConnectionError(error)) return { ...defaultInquireDocument };
    throw error;
  }

  const stored = rows[0]?.data ?? {};
  return Object.fromEntries(
    Object.entries(defaultInquireDocument).map(([key, fallback]) => {
      const value = stored[key];
      const limit = limits[key as keyof InquireDocument];
      return [key, typeof value === "string" && value.trim() && value.trim().length <= limit
        ? value.trim()
        : fallback];
    }),
  ) as InquireDocument;
}
