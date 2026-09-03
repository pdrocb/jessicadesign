"use client";

import { useState } from "react";
import type { InquiryFieldName } from "@/cms/inquiries/validation";
import { inquiry } from "@/lib/content";

/**
 * Formulario de inquiry (DESIGN.md §Inputs): campos subrayados con
 * hairline, sin cajas, foco en sage. Validación nativa del navegador —
 * `required` y `type` hacen el trabajo; no hay librería de forms.
 * El envío se persiste primero en Neon. Resend se agregará como una capa
 * posterior, sin convertir al correo en la fuente de verdad del lead.
 */

const FIELD =
  "w-full min-h-11 border-b border-line-warm bg-transparent py-2 text-body-lg text-ink outline-none transition-colors duration-[180ms] focus:border-sage focus:border-b-2";

const REQUIRED_MESSAGES: Record<InquiryFieldName, string> = {
  name: "Enter your first and last name.",
  email: "Enter your email address.",
  celebration: "Choose a type of celebration.",
  phone: "Enter your contact number.",
  date: "Choose the date of the event.",
  venue: "Enter the venue name and location.",
  guests: "Enter the number of guests.",
  pinterest: "Enter the link to your Pinterest board.",
  vision: "Tell us about your vision.",
};

function clientValidationMessage(
  control: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
  field: InquiryFieldName,
) {
  if (control.validity.valueMissing) return REQUIRED_MESSAGES[field];
  if (field === "email" && control.validity.typeMismatch) return "Enter a valid email address.";
  if (field === "pinterest" && control.validity.typeMismatch) return "Enter a valid Pinterest URL.";
  if (field === "guests" && (control.validity.rangeUnderflow || control.validity.rangeOverflow)) {
    return "Enter a guest count between 1 and 10,000.";
  }
  if (control.validity.tooLong) return "This response is too long.";
  return "Review this field and try again.";
}

export function InquiryForm() {
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState<{
    field: InquiryFieldName;
    message: string;
  } | null>(null);

  function clearFieldError(field: InquiryFieldName) {
    setFieldError((current) => current?.field === field ? null : current);
  }

  function handleInvalid(event: React.InvalidEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const firstInvalid = event.currentTarget.form?.querySelector(":invalid");
    if (firstInvalid && firstInvalid !== event.currentTarget) return;
    const field = event.currentTarget.name as InquiryFieldName;
    setFieldError({
      field,
      message: clientValidationMessage(event.currentTarget, field),
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    setFieldError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const response = await fetch("/api/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    });
    const result = (await response.json().catch(() => null)) as {
      message?: string;
      field?: InquiryFieldName;
    } | null;

    if (!response.ok) {
      const message = result?.message ?? "We could not send your inquiry. Please try again.";
      if (result?.field) {
        setFieldError({ field: result.field, message });
        const control = form.elements.namedItem(result.field);
        if (control instanceof HTMLElement) control.focus();
      } else {
        setError(message);
      }
      setPending(false);
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-4" role="status">
        <h2 className="text-heading-lg font-display font-medium">
          {inquiry.successHeading}
        </h2>
        <p className="text-body-lg max-w-[60ch] text-ink-muted">
          {inquiry.successBody}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 md:gap-9">
      <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="inquiry-company">Company</label>
        <input id="inquiry-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid gap-8 md:grid-cols-2 md:gap-x-10 md:gap-y-9">
        {inquiry.fields.map((field) => {
          const id = `inquiry-${field.name}`;
          const invalid = fieldError?.field === field.name;
          const errorId = `${id}-error`;
          // La descripción larga ocupa el ancho completo en tablet/desktop.
          const wide = field.type === "textarea" || field.name === "pinterest";

          return (
            <div
              key={field.name}
              className={`flex flex-col gap-2 ${wide ? "md:col-span-2" : ""}`}
            >
              <label
                htmlFor={id}
                className="text-label-sm font-medium tracking-[0.26em] text-ink-subtle uppercase"
              >
                {field.label}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  id={id}
                  name={field.name}
                  rows={4}
                  required={field.required}
                  maxLength={"maxLength" in field ? field.maxLength : undefined}
                  aria-invalid={invalid || undefined}
                  aria-describedby={invalid ? errorId : undefined}
                  onInvalid={handleInvalid}
                  onInput={() => clearFieldError(field.name)}
                  className={`${FIELD} resize-y ${invalid ? "border-rose-umber focus:border-rose-umber" : ""}`}
                />
              ) : field.type === "select" ? (
                <select
                  id={id}
                  name={field.name}
                  required={field.required}
                  defaultValue=""
                  aria-invalid={invalid || undefined}
                  aria-describedby={invalid ? errorId : undefined}
                  onInvalid={handleInvalid}
                  onChange={() => clearFieldError(field.name)}
                  // Sin `appearance-none`: el select conserva la flecha
                  // nativa. Quitarla dejaba un campo idéntico a un input
                  // de texto — nadie sabía que se desplegaba.
                  className={`${FIELD} ${invalid ? "border-rose-umber focus:border-rose-umber" : ""}`}
                >
                  <option value="" disabled />
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={id}
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  autoComplete={
                    "autoComplete" in field ? field.autoComplete : undefined
                  }
                  min={"min" in field ? field.min : undefined}
                  max={"max" in field ? field.max : undefined}
                  maxLength={"maxLength" in field ? field.maxLength : undefined}
                  aria-invalid={invalid || undefined}
                  aria-describedby={invalid ? errorId : undefined}
                  onInvalid={handleInvalid}
                  onInput={() => clearFieldError(field.name)}
                  className={`${FIELD} ${invalid ? "border-rose-umber focus:border-rose-umber" : ""}`}
                />
              )}
              {invalid ? (
                <p id={errorId} className="text-body-sm text-rose-umber" role="alert">
                  {fieldError.message}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="text-label w-full cursor-pointer bg-sage px-14 py-[18px] text-center font-medium text-bone uppercase transition-colors duration-[180ms] hover:bg-sage-deep md:w-auto md:self-start"
      >
        {pending ? "Sending…" : inquiry.submit}
      </button>
      {error ? <p role="alert" className="text-body-md text-ink-muted">{error}</p> : null}
    </form>
  );
}
