export type InquiryPayload = {
  name: string;
  email: string;
  phone: string;
  celebration: string;
  eventDate: string | null;
  venue: string | null;
  guestCount: number | null;
  moodboardUrl: string | null;
  notes: string | null;
};

type ValidationResult =
  | { ok: true; value: InquiryPayload }
  | { ok: false; message: string };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function text(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export function validateInquiry(input: unknown): ValidationResult {
  if (!input || typeof input !== "object") {
    return { ok: false, message: "Please complete the required fields." };
  }

  const body = input as Record<string, unknown>;
  const name = text(body.name, 160);
  const email = text(body.email, 320).toLowerCase();
  const phone = text(body.phone, 80);
  const celebration = text(body.celebration, 160);

  if (!name || !emailPattern.test(email) || !phone || !celebration) {
    return { ok: false, message: "Please complete the required fields." };
  }

  const eventDate = text(body.date, 10) || null;
  if (eventDate && !datePattern.test(eventDate)) {
    return { ok: false, message: "Please enter a valid event date." };
  }

  const guestText = text(body.guests, 8);
  const guestCount = guestText ? Number(guestText) : null;
  if (guestCount !== null && (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 10000)) {
    return { ok: false, message: "Please enter a valid guest count." };
  }

  const moodboardUrl = text(body.pinterest, 2000) || null;
  if (moodboardUrl) {
    try {
      const url = new URL(moodboardUrl);
      if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error();
    } catch {
      return { ok: false, message: "Please enter a valid Pinterest URL." };
    }
  }

  return {
    ok: true,
    value: {
      name,
      email,
      phone,
      celebration,
      eventDate,
      venue: text(body.venue, 500) || null,
      guestCount,
      moodboardUrl,
      notes: text(body.vision, 5000) || null,
    },
  };
}
