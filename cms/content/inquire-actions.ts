"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/cms/auth/session";
import { getCmsDatabase } from "@/cms/database/client";
import type { InquireDocument } from "@/cms/content/inquire";

export type InquireSaveState = {
  status: "idle" | "saved" | "error";
  message: string;
  field?: keyof InquireDocument;
};

const limits: Record<keyof InquireDocument, number> = {
  heading: 160,
  introduction: 500,
  metaTitle: 80,
  metaDescription: 320,
};

export async function saveInquire(
  _previousState: InquireSaveState,
  formData: FormData,
): Promise<InquireSaveState> {
  const user = await requireSession();

  const data = {} as InquireDocument;
  for (const [field, limit] of Object.entries(limits) as [keyof InquireDocument, number][]) {
    const raw = formData.get(field);
    const value = typeof raw === "string" ? raw.trim() : "";
    if (!value) {
      return { status: "error", message: "Complete every Inquire page field before saving.", field };
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
       VALUES ('inquire', $1::jsonb, $2)
       ON CONFLICT (key) DO UPDATE
         SET data = EXCLUDED.data,
             updated_by = EXCLUDED.updated_by,
             updated_at = now()`,
      [JSON.stringify(data), user.id],
    );
  } catch {
    return {
      status: "error",
      message: "The Inquire page could not be saved. Check your connection and try again.",
    };
  }

  revalidatePath("/inquire");
  revalidatePath("/admin/inquire");
  return { status: "saved", message: "Inquire page saved." };
}
