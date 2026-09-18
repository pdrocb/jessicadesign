import type { InquiryEmailLead, InternalInquiryEmailLead } from "@/emails/types";
import { formatEventDate } from "@/emails/shared";

const line = (label: string, value: string | number) => `${label.padEnd(18)}${value}`;

export function plainTextConfirmation(lead: InquiryEmailLead) {
  const firstName = lead.name.split(/\s+/)[0] || lead.name;
  return [
    `${firstName},`,
    "",
    "Thank you so much for reaching out. I personally review every inquiry and will be in touch within the next few days to schedule your complimentary consultation. I’m looking forward to learning more about your celebration, hearing your ideas, and getting to know the vision you have in mind.",
    "",
    "Warmly,",
    "Jessica",
    "",
    "Hudson Valley, New York · 845-375-7820",
  ].join("\n");
}

export function plainTextNewInquiry(lead: InternalInquiryEmailLead) {
  return [
    "NEW INQUIRY",
    lead.name,
    `Received ${lead.submittedAt}`,
    "",
    line("Email", lead.email),
    line("Phone", lead.phone),
    line("Celebration", lead.celebration),
    line("Event date", formatEventDate(lead.eventDate)),
    line("Venue", lead.venue),
    line("Guest count", lead.guestCount.toLocaleString("en-US")),
    ...(lead.moodboardUrl ? [line("Pinterest", lead.moodboardUrl)] : []),
    "",
    "THEIR VISION",
    lead.notes,
    "",
    `Reply to this message to answer ${lead.name.split(/\s+/)[0]} directly.`,
  ].join("\n");
}

export function formatSubmittedAt(when: Date) {
  const date = when.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  });
  const time = when.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
    timeZoneName: "short",
  });
  return `${date} · ${time}`;
}
