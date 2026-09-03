import assert from "node:assert/strict";
import test from "node:test";
import type { InquiryPayload } from "@/cms/inquiries/validation";
import { createInquiryPost } from "@/app/api/inquiry/handler";

const valid = {
  name: "  Maya Thompson  ",
  email: "MAYA@EXAMPLE.COM",
  phone: "(845) 555-0147",
  celebration: "Wedding",
  date: "2027-10-10",
  venue: "Foxfire Mountain House · Mount Tremper, NY",
  guests: "125",
  pinterest: "https://pinterest.com/example/celebration",
  vision: "Warm, layered, and intentional.",
};

function post(
  body: unknown,
  deliver: (inquiry: InquiryPayload) => Promise<string> = async () => "123",
) {
  return createInquiryPost(deliver)(new Request("http://localhost/api/inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }));
}

test("rejects invalid JSON", async () => {
  const response = await createInquiryPost(async () => "123")(
    new Request("http://localhost/api/inquiry", { method: "POST", body: "{" }),
  );
  assert.equal(response.status, 400);
});

test("normalizes and delivers a complete inquiry", async () => {
  let delivered: InquiryPayload | undefined;
  const response = await post(valid, async (inquiry) => {
    delivered = inquiry;
    return "456";
  });

  assert.equal(response.status, 201);
  assert.deepEqual(delivered, {
    name: "Maya Thompson",
    email: "maya@example.com",
    phone: "(845) 555-0147",
    celebration: "Wedding",
    eventDate: "2027-10-10",
    venue: "Foxfire Mountain House · Mount Tremper, NY",
    guestCount: 125,
    moodboardUrl: "https://pinterest.com/example/celebration",
    notes: "Warm, layered, and intentional.",
  });
});

for (const field of Object.keys(valid)) {
  test(`requires ${field}`, async () => {
    const response = await post({ ...valid, [field]: "  " });
    const result = await response.json() as { field?: string };
    assert.equal(response.status, 400);
    assert.equal(result.field, field);
  });
}

test("rejects malformed constrained fields", async () => {
  const cases = [
    ["email", "not-an-email"],
    ["date", "2027-02-31"],
    ["guests", "0"],
    ["guests", "many"],
    ["pinterest", "javascript:alert(1)"],
  ] as const;

  for (const [field, value] of cases) {
    const response = await post({ ...valid, [field]: value });
    const result = await response.json() as { field?: string };
    assert.equal(response.status, 400);
    assert.equal(result.field, field);
  }
});

test("rejects overlong values instead of truncating them", async () => {
  const response = await post({ ...valid, venue: "v".repeat(501) });
  const result = await response.json() as { field?: string };
  assert.equal(response.status, 400);
  assert.equal(result.field, "venue");
});

test("honeypot returns success without storing a lead", async () => {
  let called = false;
  const response = await post({ ...valid, company: "bot" }, async () => {
    called = true;
    return "123";
  });
  assert.equal(response.status, 200);
  assert.equal(called, false);
});

test("returns a recoverable error when Neon persistence fails", async () => {
  const originalError = console.error;
  console.error = () => undefined;
  try {
    const response = await post(valid, async () => {
      throw new Error("database unavailable");
    });
    assert.equal(response.status, 503);
  } finally {
    console.error = originalError;
  }
});
