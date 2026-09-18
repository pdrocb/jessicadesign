import "server-only";

import { getCmsDatabase } from "@/cms/database/client";
import type { InquiryPayload } from "@/cms/inquiries/validation";
import { getSiteSettings } from "@/cms/settings/repository";
import { sendInquiryEmails } from "@/emails/delivery";
import { resolveInternalInquiryRecipient } from "@/emails/routing";

async function updateEmailDelivery(
  inquiryId: string,
  status: "sent" | "failed",
  ids?: { internalEmailId: string; clientEmailId: string },
) {
  const sql = getCmsDatabase();
  await sql.query(
    `UPDATE leads
       SET email_status = $2,
           internal_email_id = $3,
           client_email_id = $4
     WHERE id = $1`,
    [
      inquiryId,
      status,
      ids?.internalEmailId ?? null,
      ids?.clientEmailId ?? null,
    ],
  );
}

function assetBase(siteUrl: string) {
  return siteUrl.replace(/\/+$/, "");
}

export async function saveInquiry(inquiry: InquiryPayload, requestUrl: string) {
  const sql = getCmsDatabase();
  const rows = await sql.query(
    `INSERT INTO leads (
       name, email, phone, celebration, event_date, venue,
       guest_count, moodboard_url, notes, email_status
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'not_configured')
     RETURNING id, created_at`,
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

  const inquiryId = String(id);
  const apiKey = process.env.RESEND_API_KEY?.trim();
  let ids: { internalEmailId: string; clientEmailId: string };
  try {
    const settings = await getSiteSettings();
    const productionRecipient = settings.publicEmail.trim();
    const internalRecipient = resolveInternalInquiryRecipient(
      requestUrl,
      productionRecipient,
    );

    if (!apiKey || !productionRecipient) {
      console.warn("Inquiry email delivery is not configured", {
        inquiryId,
        missingApiKey: !apiKey,
        missingRecipient: !productionRecipient,
      });
      return inquiryId;
    }

    ids = await sendInquiryEmails({
      apiKey,
      inquiryId,
      lead: inquiry,
      submittedAt: new Date(rows[0]?.created_at as string | Date),
      internalRecipient,
      assetBase: assetBase(settings.siteUrl),
    });
  } catch (error) {
    console.error("Inquiry email delivery failed", { inquiryId, error });
    try {
      await updateEmailDelivery(inquiryId, "failed");
    } catch (statusError) {
      console.error("Inquiry email failure status could not be saved", {
        inquiryId,
        error: statusError,
      });
    }
    return inquiryId;
  }

  try {
    await updateEmailDelivery(inquiryId, "sent", ids);
  } catch (error) {
    console.error("Inquiry email IDs could not be saved", { inquiryId, error });
  }

  return inquiryId;
}
