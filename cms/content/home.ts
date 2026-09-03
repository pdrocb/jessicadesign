import "server-only";

import {
  getCmsDatabase,
  isCmsDatabaseConfigured,
  isCmsDatabaseConnectionError,
} from "@/cms/database/client";
import { defaultHomeDocument, homeFieldDefinitions } from "@/cms/config/site";
import {
  HOME_FAQS_KEY,
  HOME_TESTIMONIALS_KEY,
  type HomeDocument,
  type HomeFaq,
  type HomeTestimonial,
} from "@/cms/content/model";
import { isPersistentCmsImageSource } from "@/cms/content/media";

export type { HomeDocument } from "@/cms/content/model";

const imageKeys = new Set(
  homeFieldDefinitions.filter((field) => field.type === "image").map((field) => field.key),
);

function migrateLegacyHero(document: HomeDocument): HomeDocument {
  if (typeof document["hero.feeling"] === "string" && document["hero.feeling"]) return document;

  const middle = typeof document["hero.middle"] === "string" ? document["hero.middle"].trim() : "";
  const emphasis = typeof document["hero.emphasis"] === "string" ? document["hero.emphasis"].trim() : "";
  if (!middle && !emphasis) return document;

  const ending = emphasis
    ? /[.!?]$/.test(emphasis)
      ? emphasis
      : `${emphasis}.`
    : "";

  return {
    ...document,
    "hero.feeling": [middle, ending].filter(Boolean).join(" "),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeTestimonials(value: unknown): HomeTestimonial[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > 24) return null;
  const items = value.flatMap((item) => {
    if (!isRecord(item)) return [];
    const id = typeof item.id === "string" ? item.id.trim() : "";
    const text = typeof item.text === "string" ? item.text.trim() : "";
    const who = typeof item.who === "string" ? item.who.trim() : "";
    return id && text && who ? [{ id, text, who }] : [];
  });
  return items.length === value.length ? items : null;
}

function sanitizeFaqs(value: unknown): HomeFaq[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > 24) return null;
  const items = value.flatMap((item) => {
    if (!isRecord(item)) return [];
    const id = typeof item.id === "string" ? item.id.trim() : "";
    const q = typeof item.q === "string" ? item.q.trim() : "";
    const a = typeof item.a === "string" ? item.a.trim() : "";
    return id && q && a ? [{ id, q, a }] : [];
  });
  return items.length === value.length ? items : null;
}

function migrateTestimonials(stored: Record<string, unknown>) {
  const native = sanitizeTestimonials(stored[HOME_TESTIMONIALS_KEY]);
  if (native) return native;

  const defaults = defaultHomeDocument[HOME_TESTIMONIALS_KEY] as HomeTestimonial[];
  return defaults.map((item, index) => ({
    ...item,
    text: typeof stored[`testimonials.items.${index + 1}.quote`] === "string"
      ? stored[`testimonials.items.${index + 1}.quote`] as string
      : item.text,
    who: typeof stored[`testimonials.items.${index + 1}.attribution`] === "string"
      ? stored[`testimonials.items.${index + 1}.attribution`] as string
      : item.who,
  }));
}

function migrateFaqs(stored: Record<string, unknown>) {
  const native = sanitizeFaqs(stored[HOME_FAQS_KEY]);
  if (native) return native;

  const defaults = defaultHomeDocument[HOME_FAQS_KEY] as HomeFaq[];
  return defaults.map((item, index) => ({
    ...item,
    q: typeof stored[`faqs.items.${index + 1}.question`] === "string"
      ? stored[`faqs.items.${index + 1}.question`] as string
      : item.q,
    a: typeof stored[`faqs.items.${index + 1}.answer`] === "string"
      ? stored[`faqs.items.${index + 1}.answer`] as string
      : item.a,
  }));
}

export async function getHomeDocument(): Promise<HomeDocument> {
  if (!isCmsDatabaseConfigured()) return { ...defaultHomeDocument };

  let rows: { key: string; data: Record<string, unknown> }[];
  try {
    const sql = getCmsDatabase();
    rows = (await sql.query(
      "SELECT key, data FROM cms_documents WHERE key IN ('home', 'site_settings')",
    )) as { key: string; data: Record<string, unknown> }[];
  } catch (error) {
    if (isCmsDatabaseConnectionError(error)) return { ...defaultHomeDocument };
    throw error;
  }
  const stored = rows.find((row) => row.key === "home")?.data ?? {};
  const legacySettings = rows.find((row) => row.key === "site_settings")?.data ?? {};
  const sanitized = Object.fromEntries(
    Object.entries(stored).filter(
      (entry): entry is [string, string] =>
        typeof entry[1] === "string" &&
        (!imageKeys.has(entry[0]) || isPersistentCmsImageSource(entry[1])),
    ),
  );

  return {
    ...defaultHomeDocument,
    ...(typeof stored["seo.metaTitle"] !== "string" && typeof legacySettings.metaTitle === "string" && legacySettings.metaTitle.trim()
      ? { "seo.metaTitle": legacySettings.metaTitle }
      : {}),
    ...(typeof stored["seo.metaDescription"] !== "string" && typeof legacySettings.metaDescription === "string" && legacySettings.metaDescription.trim()
      ? { "seo.metaDescription": legacySettings.metaDescription }
      : {}),
    ...migrateLegacyHero(sanitized),
    [HOME_TESTIMONIALS_KEY]: migrateTestimonials(stored),
    [HOME_FAQS_KEY]: migrateFaqs(stored),
  };
}
