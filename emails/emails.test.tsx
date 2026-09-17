import assert from "node:assert/strict";
import test from "node:test";
import { render } from "@react-email/render";
import { InquiryConfirmation } from "@/emails/InquiryConfirmation";
import { NewInquiry } from "@/emails/NewInquiry";
import { buildInquiryEmails, INQUIRY_SENDER } from "@/emails/delivery";
import { plainTextConfirmation, plainTextNewInquiry } from "@/emails/plainText";
import { inquiryConfirmationSubject, internalInquirySubject } from "@/emails/subjects";

const lead = {
  name: "Maya Thompson",
  email: "maya@example.com",
  phone: "(845) 555-0147",
  celebration: "Wedding",
  eventDate: "2027-10-10",
  venue: "Foxfire Mountain House · Mount Tremper, NY",
  guestCount: 125,
  moodboardUrl: "https://pinterest.com/example/celebration",
  notes: "Warm, layered, and intentional.",
};

test("renders the client confirmation with Jessica's verified process", async () => {
  const html = await render(<InquiryConfirmation lead={lead} assetBase="https://example.com" />);
  const text = plainTextConfirmation(lead);

  for (const value of ["Thank you", "complimentary", "Jessica Salomon", lead.venue, lead.notes]) {
    assert.match(html, new RegExp(value, "i"));
    assert.match(text, new RegExp(value, "i"));
  }
  assert.doesNotMatch(`${html}\n${text}`, /The Clementine|48.?72|investment|contract/i);
});

test("renders the internal inquiry with every submitted field", async () => {
  const internalLead = { ...lead, submittedAt: "Sep 2, 2026 · 5:15 PM EDT" };
  const html = await render(<NewInquiry lead={internalLead} assetBase="https://example.com" />);
  const text = plainTextNewInquiry(internalLead);

  for (const value of [
    lead.name,
    lead.email,
    lead.phone,
    lead.celebration,
    lead.venue,
    String(lead.guestCount),
    lead.moodboardUrl,
    lead.notes,
  ]) {
    assert.match(`${html}\n${text}`, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }
  assert.doesNotMatch(`${html}\n${text}`, /The Clementine|investment/i);
});

test("builds safe, concise subjects for both messages", () => {
  const unsafeLead = { ...lead, name: "Maya\r\nBcc: someone@example.com" };

  assert.equal(inquiryConfirmationSubject(unsafeLead), "Your inquiry is in, Maya");
  assert.match(internalInquirySubject(unsafeLead), /^New inquiry · Maya Bcc:/);
  assert.doesNotMatch(internalInquirySubject(unsafeLead), /[\r\n]/);
  assert.ok(internalInquirySubject(unsafeLead).length <= 120);
});

test("routes both inquiry messages through the verified sender", () => {
  assert.equal(
    INQUIRY_SENDER,
    "Jessica S. Designs <celebrate@jessicasalomonevents.com>",
  );

  const [internal, confirmation] = buildInquiryEmails({
    lead,
    submittedAt: new Date("2026-09-02T21:15:00.000Z"),
    internalRecipient: "celebrate@jessicasalomonevents.com",
    assetBase: "https://www.jessicasalomondesigns.com",
  });

  assert.equal(internal.from, INQUIRY_SENDER);
  assert.equal(internal.to, "celebrate@jessicasalomonevents.com");
  assert.equal(internal.replyTo, lead.email);
  assert.equal(confirmation.from, INQUIRY_SENDER);
  assert.equal(confirmation.to, lead.email);
  assert.equal(confirmation.replyTo, "celebrate@jessicasalomonevents.com");
  assert.match(internal.text, /Sep 2, 2026 · 5:15 PM EDT/);
  assert.match(confirmation.text, /Thank you, Maya/);
});
