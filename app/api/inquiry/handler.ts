import { validateInquiry, type InquiryPayload } from "@/cms/inquiries/validation";

type Delivery = (inquiry: InquiryPayload) => Promise<void>;

export function createInquiryPost(deliver: Delivery) {
  return async function POST(request: Request) {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return Response.json({ message: "Invalid request." }, { status: 400 });
    }

    const raw = body as Record<string, unknown> | null;
    if (raw?.company) return Response.json({ ok: true });

    const result = validateInquiry(body);
    if (!result.ok) {
      return Response.json({ message: result.message }, { status: 400 });
    }

    try {
      await deliver(result.value);
      return Response.json({ ok: true }, { status: 201 });
    } catch (error) {
      console.error("Inquiry delivery failed", error);
      return Response.json(
        { message: "We could not send your inquiry. Please try again." },
        { status: 503 },
      );
    }
  };
}
