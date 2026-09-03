"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/cms/auth/session";
import { getCmsDatabase } from "@/cms/database/client";
import type { LookBookDocument } from "@/cms/content/look-book";

export type LookBookSaveState = {
  status: "idle" | "saved" | "error";
  message: string;
  field?: keyof LookBookDocument;
};

const limits: Record<keyof LookBookDocument, number> = {
  heading: 160,
  introduction: 500,
  metaTitle: 80,
  metaDescription: 320,
};

export async function saveLookBook(
  _previousState: LookBookSaveState,
  formData: FormData,
): Promise<LookBookSaveState> {
  const user = await requireSession();
  const data = {} as LookBookDocument;

  for (const [field, limit] of Object.entries(limits) as [keyof LookBookDocument, number][]) {
    const raw = formData.get(field);
    const value = typeof raw === "string" ? raw.trim() : "";
    if (!value) {
      return { status: "error", message: "Complete every Look Book field before saving.", field };
    }
    if (value.length > limit) {
      return { status: "error", message: "Shorten this field before saving.", field };
    }
    data[field] = value;
  }

  try {
    const sql = getCmsDatabase();
    await sql.query(
      `INSERT INTO cms_documents (key, data, updated_by)
       VALUES ('look_book', $1::jsonb, $2)
       ON CONFLICT (key) DO UPDATE
         SET data = EXCLUDED.data,
             updated_by = EXCLUDED.updated_by,
             updated_at = now()`,
      [JSON.stringify(data), user.id],
    );
  } catch {
    return {
      status: "error",
      message: "The Look Book page could not be saved. Check your connection and try again.",
    };
  }

  revalidatePath("/look-book");
  revalidatePath("/admin/look-book");
  return { status: "saved", message: "Look Book page saved." };
}
