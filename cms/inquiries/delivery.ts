import "server-only";

import { getCmsDatabase } from "@/cms/database/client";
import type { InquiryPayload } from "@/cms/inquiries/validation";

export async function saveInquiry(inquiry: InquiryPayload) {
  const sql = getCmsDatabase();
  const rows = await sql.query(
    `INSERT INTO leads (
       name, email, phone, celebration, event_date, venue,
       guest_count, moodboard_url, notes, email_status
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'not_configured')
     RETURNING id`,
    [
      inquiry.name,
      inquiry.email,
      inquiry.phone,
      inquiry.celebration,
      inquiry.eventDate,
      inquiry.venue,
      inquiry.guestCount,
      inquiry.moodboardUrl,
      inquiry.notes,
    ],
  );

  const id = rows[0]?.id;
  if (id === undefined || id === null) throw new Error("INQUIRY_NOT_CREATED");
  return String(id);
}
