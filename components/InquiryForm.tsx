"use client";

import { useState } from "react";
import { inquiry } from "@/lib/content";

/**
 * Formulario de inquiry (DESIGN.md §Inputs): campos subrayados con
 * hairline, sin cajas, foco en sage. Validación nativa del navegador —
 * `required` y `type` hacen el trabajo; no hay librería de forms.
 *
 * PENDIENTE DE NEGOCIO: no hay correo destino público (PRODUCT.md), así
 * que el envío aún no está conectado. En cuanto exista la dirección,
 * `handleSubmit` es el único punto a tocar.
 */

const FIELD =
  "w-full min-h-11 border-b border-line-warm bg-transparent py-2 text-body-lg text-ink outline-none transition-colors duration-[180ms] focus:border-sage focus:border-b-2";

export function InquiryForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO(negocio): enviar a la dirección de J|S en cuanto exista.
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
      <div className="grid gap-8 md:grid-cols-2 md:gap-x-10 md:gap-y-9">
        {inquiry.fields.map((field) => {
          const id = `inquiry-${field.name}`;
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
                {!field.required && (
                  <span className="ml-2 tracking-normal text-ink-faint lowercase">
                    (optional)
                  </span>
                )}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  id={id}
                  name={field.name}
                  rows={4}
                  required={field.required}
                  className={`${FIELD} resize-y`}
                />
              ) : field.type === "select" ? (
                <select
                  id={id}
                  name={field.name}
                  required={field.required}
                  defaultValue=""
                  // Sin `appearance-none`: el select conserva la flecha
                  // nativa. Quitarla dejaba un campo idéntico a un input
                  // de texto — nadie sabía que se desplegaba.
                  className={FIELD}
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
                  min={field.type === "number" ? 1 : undefined}
                  className={FIELD}
                />
              )}
            </div>
          );
        })}
      </div>

      <button
        type="submit"
        className="text-label w-full cursor-pointer bg-sage px-14 py-[18px] text-center font-medium text-bone uppercase transition-colors duration-[180ms] hover:bg-sage-deep md:w-auto md:self-start"
      >
        {inquiry.submit}
      </button>
    </form>
  );
}
