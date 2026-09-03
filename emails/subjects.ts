import type { InquiryEmailLead } from "@/emails/types";

function subjectPart(value: string) {
  return value.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
}

export function internalInquirySubject(lead: InquiryEmailLead) {
  return `New inquiry · ${subjectPart(lead.name)} · ${subjectPart(lead.celebration)}`.slice(0, 120);
}

export function inquiryConfirmationSubject(lead: InquiryEmailLead) {
  const firstName = subjectPart(lead.name).split(" ")[0] || "there";

  return `Your inquiry is in, ${firstName}`.slice(0, 120);
}
