import "server-only";

import { getCmsDatabase } from "@/cms/database/client";
import type { InquiryPayload } from "@/cms/inquiries/validation";

export async function saveInquiry(inquiry: InquiryPayload) {
  const sql = getCmsDatabase();
  await sql.query(
    `INSERT INTO leads (
       name, email, phone, celebration, event_date, venue,
       guest_count, moodboard_url, notes
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
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
}
