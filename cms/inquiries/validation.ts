export type InquiryPayload = {
  name: string;
  email: string;
  phone: string;
  celebration: string;
  eventDate: string;
  venue: string;
  guestCount: number;
  moodboardUrl: string;
  notes: string;
};

export type InquiryFieldName =
  | "name"
  | "email"
  | "phone"
  | "celebration"
  | "date"
  | "venue"
  | "guests"
  | "pinterest"
  | "vision";

type ValidationResult =
  | { ok: true; value: InquiryPayload }
  | { ok: false; message: string; field?: InquiryFieldName };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function requiredText(
  body: Record<string, unknown>,
  field: InquiryFieldName,
  label: string,
  maxLength: number,
): { ok: true; value: string } | { ok: false; message: string; field: InquiryFieldName } {
  const value = text(body[field]);
  if (!value) return { ok: false, message: `${label} is required.`, field };
  if (value.length > maxLength) {
    return { ok: false, message: `${label} is too long.`, field };
  }
  return { ok: true, value };
}

function isCalendarDate(value: string) {
  if (!datePattern.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year
    && parsed.getUTCMonth() === month - 1
    && parsed.getUTCDate() === day;
}

export function validateInquiry(input: unknown): ValidationResult {
  if (!input || typeof input !== "object") {
    return { ok: false, message: "Please complete the required fields." };
  }

  const body = input as Record<string, unknown>;
  const nameResult = requiredText(body, "name", "Name", 160);
  if (!nameResult.ok) return nameResult;
  const emailResult = requiredText(body, "email", "Email", 320);
  if (!emailResult.ok) return emailResult;
  const email = emailResult.value.toLowerCase();
  if (!emailPattern.test(email)) {
    return { ok: false, message: "Enter a valid email address.", field: "email" };
  }
  const phoneResult = requiredText(body, "phone", "Contact number", 80);
  if (!phoneResult.ok) return phoneResult;
  const celebrationResult = requiredText(body, "celebration", "Type of celebration", 160);
  if (!celebrationResult.ok) return celebrationResult;
  const dateResult = requiredText(body, "date", "Event date", 10);
  if (!dateResult.ok) return dateResult;
  if (!isCalendarDate(dateResult.value)) {
    return { ok: false, message: "Enter a valid event date.", field: "date" };
  }
  const venueResult = requiredText(body, "venue", "Venue", 500);
  if (!venueResult.ok) return venueResult;
  const guestsResult = requiredText(body, "guests", "Guest count", 8);
  if (!guestsResult.ok) return guestsResult;
  const guestCount = Number(guestsResult.value);
  if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 10000) {
    return { ok: false, message: "Enter a guest count between 1 and 10,000.", field: "guests" };
  }
  const pinterestResult = requiredText(body, "pinterest", "Pinterest board", 2000);
  if (!pinterestResult.ok) return pinterestResult;
  try {
    const url = new URL(pinterestResult.value);
    if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error();
  } catch {
    return { ok: false, message: "Enter a valid Pinterest URL.", field: "pinterest" };
  }
  const visionResult = requiredText(body, "vision", "Your vision", 5000);
  if (!visionResult.ok) return visionResult;

  return {
    ok: true,
    value: {
      name: nameResult.value,
      email,
      phone: phoneResult.value,
      celebration: celebrationResult.value,
      eventDate: dateResult.value,
      venue: venueResult.value,
      guestCount,
      moodboardUrl: pinterestResult.value,
      notes: visionResult.value,
    },
  };
}
