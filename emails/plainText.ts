import type { InquiryEmailLead, InternalInquiryEmailLead } from "@/emails/types";
import { formatEventDate } from "@/emails/shared";

const line = (label: string, value: string | number) => `${label.padEnd(18)}${value}`;

export function plainTextConfirmation(lead: InquiryEmailLead) {
  const firstName = lead.name.split(/\s+/)[0] || lead.name;
  return [
    "JESSICA S. DESIGNS",
    "Wedding & Event Design & Styling",
    "",
    `Thank you, ${firstName}.`,
    "",
    "Your inquiry has been received. Jessica reads every one personally and will be in touch within a few days to arrange your complimentary one-hour consultation.",
    "",
    "WHAT HAPPENS NEXT",
    "",
    "1. Jessica reviews every detail.",
    "2. We arrange a complimentary conversation.",
    "3. If it feels like the right fit, the design process begins with your vision.",
    "",
    "A QUICK LOOK AT WHAT YOU SENT",
    line("Celebration", lead.celebration),
    line("Event date", formatEventDate(lead.eventDate)),
    line("Venue", lead.venue),
    line("Guest count", lead.guestCount.toLocaleString("en-US")),
    "",
    "YOUR VISION",
    lead.notes,
    "",
    "Warmly,",
    "Jessica Salomon",
    "Founder & Creative Director",
    "",
    "Jessica S. Designs · Hudson Valley, New York · 845-375-7820",
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
    line("Pinterest", lead.moodboardUrl),
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
