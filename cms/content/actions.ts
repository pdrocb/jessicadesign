"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { homeFieldDefinitions } from "@/cms/config/site";
import { getCmsDatabase } from "@/cms/database/client";
import { requireSession } from "@/cms/auth/session";
import {
  HOME_FAQS_KEY,
  HOME_TESTIMONIALS_KEY,
  type HomeDocument,
  type HomeFaq,
  type HomeTestimonial,
} from "@/cms/content/model";

export type SaveState = { status: "idle" | "saved" | "error"; message: string };

const imageFields = homeFieldDefinitions.filter((field) => field.type === "image");
const allowedKeys = new Set(
  homeFieldDefinitions.flatMap((field) =>
    field.type === "image" ? [field.key, field.altKey] : [field.key],
  ),
);
const collectionKeys = new Set([HOME_TESTIMONIALS_KEY, HOME_FAQS_KEY]);
const homeImageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
]);

async function uploadHomeImage(file: File, key: string) {
  const extension = homeImageTypes.get(file.type);
  if (!extension) throw new Error("Choose a JPG or WebP image.");
  if (file.size > 4_000_000) throw new Error("The image must be under 4 MB.");
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("Image uploads are not configured yet.");

  const blob = await put(`home/${key.replaceAll(".", "-")}.${extension}`, file, {
    access: "public",
    addRandomSuffix: true,
    cacheControlMaxAge: 31_536_000,
    contentType: file.type,
  });
  return blob.url;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseCollection<T>(
  formData: FormData,
  key: string,
  normalize: (item: Record<string, unknown>) => T | null,
) {
  const value = formData.get(key);
  if (typeof value !== "string") throw new Error("The collection could not be read.");

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error("The collection contains invalid data.");
  }
  if (!Array.isArray(parsed) || parsed.length < 1 || parsed.length > 24) {
    throw new Error("Keep between 1 and 24 items in each collection.");
  }

  const items = parsed.map((item) => isRecord(item) ? normalize(item) : null);
  if (items.some((item) => item === null)) throw new Error("Complete every collection item before saving.");
  const normalized = items as T[];
  const ids = normalized.map((item) => (item as { id: string }).id);
  if (new Set(ids).size !== ids.length) throw new Error("Each collection item needs a unique ID.");
  return normalized;
}

function normalizeText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized && normalized.length <= maxLength ? normalized : null;
}

function normalizeTestimonial(item: Record<string, unknown>): HomeTestimonial | null {
  const id = normalizeText(item.id, 100);
  const text = normalizeText(item.text, 5000);
  const who = normalizeText(item.who, 500);
  return id && text && who ? { id, text, who } : null;
}

function normalizeFaq(item: Record<string, unknown>): HomeFaq | null {
  const id = normalizeText(item.id, 100);
  const q = normalizeText(item.q, 500);
  const a = normalizeText(item.a, 5000);
  return id && q && a ? { id, q, a } : null;
}

export async function saveHome(
  _previousState: SaveState,
  formData: FormData,
): Promise<SaveState> {
  const user = await requireSession();
  const data: HomeDocument = {};

  for (const [key, value] of formData.entries()) {
    if (collectionKeys.has(key) || !allowedKeys.has(key) || typeof value !== "string") continue;
    const normalized = value.trim();
    if (normalized.length > 5000) {
      return { status: "error", message: "One of the fields is too long." };
    }
    data[key] = normalized;
  }

  try {
    data[HOME_TESTIMONIALS_KEY] = parseCollection(
      formData,
      HOME_TESTIMONIALS_KEY,
      normalizeTestimonial,
    );
    data[HOME_FAQS_KEY] = parseCollection(formData, HOME_FAQS_KEY, normalizeFaq);
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "A collection could not be saved.",
    };
  }

  for (const field of imageFields) {
    if (typeof data[field.altKey] !== "string" || !data[field.altKey]) {
      return { status: "error", message: `${field.label} needs alternative text.` };
    }
    const file = formData.get(`${field.key}File`);
    if (!(file instanceof File) || file.size === 0) continue;

    try {
      data[field.key] = await uploadHomeImage(file, field.key);
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : "The image could not be uploaded.",
      };
    }
  }

  const sql = getCmsDatabase();
  await sql.query(
    `INSERT INTO cms_documents (key, data, updated_by)
     VALUES ('home', $1::jsonb, $2)
     ON CONFLICT (key) DO UPDATE
       SET data = EXCLUDED.data,
           updated_by = EXCLUDED.updated_by,
           updated_at = now()`,
    [JSON.stringify(data), user.id],
  );

  revalidatePath("/");
  revalidatePath("/admin");
  return { status: "saved", message: "Changes saved." };
}
