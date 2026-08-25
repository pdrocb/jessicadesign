import "server-only";

import { cache } from "react";
import {
  getCmsDatabase,
  isCmsDatabaseConfigured,
  isCmsDatabaseConnectionError,
} from "@/cms/database/client";
import {
  defaultSiteSettings,
  type SiteSettingsDocument,
} from "@/cms/settings/config";

const settingKeys = new Set<keyof SiteSettingsDocument>(
  Object.keys(defaultSiteSettings) as (keyof SiteSettingsDocument)[],
);

function isHttpUrl(value: string) {
  if (!URL.canParse(value)) return false;
  const url = new URL(value);
  return url.protocol === "https:" || url.protocol === "http:";
}

function isSafeMediaSource(value: string) {
  return value.startsWith("/") || isHttpUrl(value);
}

export const getSiteSettings = cache(async (): Promise<SiteSettingsDocument> => {
  if (!isCmsDatabaseConfigured()) return { ...defaultSiteSettings };

  let rows: { data: Record<string, unknown> }[];
  try {
    const sql = getCmsDatabase();
    rows = (await sql.query(
      "SELECT data FROM cms_documents WHERE key = 'site_settings' LIMIT 1",
    )) as { data: Record<string, unknown> }[];
  } catch (error) {
    if (isCmsDatabaseConnectionError(error)) return { ...defaultSiteSettings };
    throw error;
  }
  const stored = rows[0]?.data ?? {};
  const sanitized = Object.fromEntries(
    Object.entries(stored).filter(([key, value]) => {
      if (!settingKeys.has(key as keyof SiteSettingsDocument) || typeof value !== "string") {
        return false;
      }
      if ((key === "ogImageUrl" || key === "faviconUrl") && value && !isSafeMediaSource(value)) {
        return false;
      }
      if ((key === "siteUrl" || key === "instagram" || key === "facebook") && value && !isHttpUrl(value)) {
        return false;
      }
      return true;
    }),
  ) as Partial<SiteSettingsDocument>;

  return { ...defaultSiteSettings, ...sanitized };
});
