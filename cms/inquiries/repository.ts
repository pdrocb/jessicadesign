import "server-only";

import { getCmsDatabase, isCmsDatabaseConfigured } from "@/cms/database/client";

export type CmsInquiry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  celebration: string | null;
  event_date: string | null;
  venue: string | null;
  guest_count: number | null;
  moodboard_url: string | null;
  notes: string | null;
  created_at: string;
  is_read: boolean;
};

export async function getInquiries() {
  if (!isCmsDatabaseConfigured()) return { inquiries: [] as CmsInquiry[], connected: false };
  const sql = getCmsDatabase();
  const inquiries = (await sql.query(
    `SELECT id, name, email, phone, celebration, event_date, venue,
            guest_count, moodboard_url, notes, created_at, is_read
       FROM leads
      ORDER BY created_at DESC
      LIMIT 100`,
  )) as CmsInquiry[];
  return { inquiries, connected: true };
}
