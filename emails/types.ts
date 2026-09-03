import type { InquiryPayload } from "@/cms/inquiries/validation";

export type InquiryEmailLead = InquiryPayload;

export type InternalInquiryEmailLead = InquiryEmailLead & {
  submittedAt: string;
};
