"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/cms/auth/session";
import { getCmsDatabase } from "@/cms/database/client";

export async function setInquiryRead(inquiryId: number, isRead: boolean) {
  await requireSession();
  if (!Number.isSafeInteger(inquiryId) || inquiryId < 1) {
    throw new Error("Inquiry not found.");
  }

  const sql = getCmsDatabase();
  const rows = (await sql.query(
    "UPDATE leads SET is_read = $2 WHERE id = $1 RETURNING id",
    [inquiryId, isRead],
  )) as { id: number }[];
  if (!rows[0]) throw new Error("Inquiry not found.");
  revalidatePath("/admin/inquiries");
  return { ok: true };
}
