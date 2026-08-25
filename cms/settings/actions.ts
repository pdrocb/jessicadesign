"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/cms/auth/session";
import { getCmsDatabase } from "@/cms/database/client";
import {
  defaultSiteSettings,
  type SiteSettingsDocument,
} from "@/cms/settings/config";

export type SiteSettingsSaveState = {
  status: "idle" | "saved" | "error";
  message: string;
};

const textLimits: Record<Exclude<keyof SiteSettingsDocument, "ogImageUrl" | "faviconUrl">, number> = {
  siteName: 80,
  siteUrl: 500,
  metaTitle: 80,
  metaDescription: 320,
  ogTitle: 100,
  ogDescription: 320,
  ogImageAlt: 500,
  phone: 40,
  publicEmail: 160,
  instagram: 500,
  facebook: 500,
};

const faviconTypes = new Map([
  ["image/png", "png"],
  ["image/x-icon", "ico"],
  ["image/vnd.microsoft.icon", "ico"],
]);
const sharingImageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isHttpUrl(value: string) {
  if (!URL.canParse(value)) return false;
  const url = new URL(value);
  return url.protocol === "https:" || url.protocol === "http:";
}

function isSafeMediaSource(value: string) {
  return value.startsWith("/") || isHttpUrl(value);
}

async function uploadMedia(
  file: File,
  kind: "favicon" | "open-graph",
  types: Map<string, string>,
  maximumBytes: number,
) {
  if (!types.has(file.type)) throw new Error(`Choose a supported ${kind} image format.`);
  if (file.size > maximumBytes) throw new Error(`The ${kind} image is too large.`);
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("Image uploads are not configured yet.");

  const extension = types.get(file.type);
  const blob = await put(`site/${kind}.${extension}`, file, {
    access: "public",
    addRandomSuffix: true,
    cacheControlMaxAge: 31_536_000,
    contentType: file.type,
  });
  return blob.url;
}

export async function saveSiteSettings(
  _previousState: SiteSettingsSaveState,
  formData: FormData,
): Promise<SiteSettingsSaveState> {
  const user = await requireSession();
  const data = {} as SiteSettingsDocument;

  for (const [key, limit] of Object.entries(textLimits) as [keyof typeof textLimits, number][]) {
    const value = textValue(formData, key);
    if (value.length > limit) return { status: "error", message: `${key} is too long.` };
    data[key] = value;
  }

  if (!data.siteName || !data.siteUrl || !data.metaTitle || !data.metaDescription) {
    return { status: "error", message: "Complete the required SEO fields before saving." };
  }
  if (!isHttpUrl(data.siteUrl)) {
    return { status: "error", message: "Site URL must be a complete http or https URL." };
  }
  for (const key of ["instagram", "facebook"] as const) {
    if (data[key] && !isHttpUrl(data[key])) {
      return { status: "error", message: `${key} must be a complete URL.` };
    }
  }
  if (data.publicEmail && !/^\S+@\S+\.\S+$/.test(data.publicEmail)) {
    return { status: "error", message: "Enter a valid public email address." };
  }

  data.ogTitle ||= data.metaTitle;
  data.ogDescription ||= data.metaDescription;
  data.ogImageUrl = textValue(formData, "ogImageUrl");
  data.faviconUrl = textValue(formData, "faviconUrl") || defaultSiteSettings.faviconUrl;
  if (data.ogImageUrl && !isSafeMediaSource(data.ogImageUrl)) {
    return { status: "error", message: "The current sharing image URL is invalid." };
  }
  if (!isSafeMediaSource(data.faviconUrl)) {
    return { status: "error", message: "The current favicon URL is invalid." };
  }

  const ogImage = formData.get("ogImageFile");
  const favicon = formData.get("faviconFile");

  try {
    if (ogImage instanceof File && ogImage.size > 0) {
      data.ogImageUrl = await uploadMedia(ogImage, "open-graph", sharingImageTypes, 4_000_000);
    }
    if (favicon instanceof File && favicon.size > 0) {
      data.faviconUrl = await uploadMedia(favicon, "favicon", faviconTypes, 1_000_000);
    }
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "The image could not be uploaded.",
    };
  }

  if (data.ogImageUrl && !data.ogImageAlt) {
    return { status: "error", message: "The sharing image needs alternative text." };
  }

  const sql = getCmsDatabase();
  await sql.query(
    `INSERT INTO cms_documents (key, data, updated_by)
     VALUES ('site_settings', $1::jsonb, $2)
     ON CONFLICT (key) DO UPDATE
       SET data = EXCLUDED.data,
           updated_by = EXCLUDED.updated_by,
           updated_at = now()`,
    [JSON.stringify(data), user.id],
  );

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return { status: "saved", message: "Site settings saved." };
}
