import { Resend } from "resend";
import { InquiryConfirmation } from "@/emails/InquiryConfirmation";
import { NewInquiry } from "@/emails/NewInquiry";
import { formatSubmittedAt, plainTextConfirmation, plainTextNewInquiry } from "@/emails/plainText";
import { inquiryConfirmationSubject, internalInquirySubject } from "@/emails/subjects";
import type { InquiryEmailLead } from "@/emails/types";

export const INQUIRY_SENDER =
  "Jessica S. Designs <celebrate@jessicasalomonevents.com>";

type BuildInquiryEmailsInput = {
  lead: InquiryEmailLead;
  submittedAt: Date;
  internalRecipient: string;
  assetBase: string;
};

type SendInquiryEmailsInput = BuildInquiryEmailsInput & {
  apiKey: string;
  inquiryId: string;
};

export function buildInquiryEmails({
  lead,
  submittedAt,
  internalRecipient,
  assetBase,
}: BuildInquiryEmailsInput) {
  const internalLead = {
    ...lead,
    submittedAt: formatSubmittedAt(submittedAt),
  };

  return [
    {
      from: INQUIRY_SENDER,
      to: internalRecipient,
      replyTo: lead.email,
      subject: internalInquirySubject(lead),
      react: NewInquiry({ lead: internalLead, assetBase }),
      text: plainTextNewInquiry(internalLead),
    },
    {
      from: INQUIRY_SENDER,
      to: lead.email,
      replyTo: internalRecipient,
      subject: inquiryConfirmationSubject(lead),
      react: InquiryConfirmation({ lead, assetBase }),
      text: plainTextConfirmation(lead),
    },
  ] satisfies Parameters<Resend["batch"]["send"]>[0];
}

export async function sendInquiryEmails(input: SendInquiryEmailsInput) {
  const resend = new Resend(input.apiKey);
  const result = await resend.batch.send(buildInquiryEmails(input), {
    idempotencyKey: `inquiry/${input.inquiryId}`,
  });

  if (result.error) {
    throw new Error(`RESEND_BATCH_FAILED:${result.error.name}`);
  }

  const [internalEmail, clientEmail] = result.data.data;
  if (!internalEmail?.id || !clientEmail?.id) {
    throw new Error("RESEND_BATCH_INCOMPLETE");
  }

  return {
    internalEmailId: internalEmail.id,
    clientEmailId: clientEmail.id,
  };
}
