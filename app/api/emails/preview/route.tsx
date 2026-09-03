import { render } from "@react-email/render";
import { InquiryConfirmation } from "@/emails/InquiryConfirmation";
import { NewInquiry } from "@/emails/NewInquiry";

export const runtime = "nodejs";

const sample = {
  name: "Maya Thompson",
  email: "maya@example.com",
  phone: "(845) 555-0147",
  celebration: "Wedding",
  eventDate: "2027-10-10",
  venue: "Foxfire Mountain House · Mount Tremper, NY",
  guestCount: 125,
  moodboardUrl: "https://pinterest.com/example/celebration",
  notes:
    "We want the room to feel warm, layered, and intentional. Candlelight, tactile linens, and a tablescape that feels collected rather than overly formal.",
};

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not found", { status: 404 });
  }

  const url = new URL(request.url);
  const template = url.searchParams.get("template") ?? "confirmation";
  const html = await render(
    template === "internal" ? (
      <NewInquiry
        assetBase={url.origin}
        lead={{ ...sample, submittedAt: "Sep 2, 2026 · 5:15 PM EDT" }}
      />
    ) : (
      <InquiryConfirmation assetBase={url.origin} lead={sample} />
    ),
  );

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
