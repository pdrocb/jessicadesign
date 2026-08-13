import type { Metadata } from "next";
import { InquiryForm } from "@/components/InquiryForm";
import { SiteHeader } from "@/components/SiteHeader";
import { Eyebrow } from "@/components/ui";
import { inquiry } from "@/lib/content";

export const metadata: Metadata = {
  title: "Inquire | Jessica S. Designs",
  description:
    "Tell us about your celebration. Every inquiry begins with a complimentary one-hour design consultation.",
};

/**
 * Pantalla propia del inquiry (DESIGN.md §"The inquiry page is its own
 * room"): full-screen en los tres breakpoints, con el nav completo —
 * fuera del home no hay centinela, así que la fila 2 no colapsa y el
 * visitante siempre tiene por dónde volver. No se reproduce el
 * calendario de auto-agendado del Wix: el horario se acuerda al
 * responder.
 *
 * La columna se centra en el documento (`mx-auto`) en vez de colgar del
 * borde izquierdo: sin fotografía que sostenga el rail completo, una
 * columna alineada a la izquierda dejaba medio viewport vacío.
 */
export default function InquirePage() {
  return (
    <>
      <SiteHeader />
      <main className="gutter section-y">
        <div className="mx-auto flex w-full max-w-[900px] flex-col">
          <div className="flex flex-col gap-4 md:gap-5">
            <Eyebrow>{inquiry.eyebrow}</Eyebrow>
            <h1 className="text-display-md max-w-[18ch] font-display font-medium">
              {inquiry.heading}
            </h1>
            <p className="text-body-lg max-w-[62ch] text-ink-muted">
              {inquiry.intro}
            </p>
          </div>

          {/* Sin salida al teléfono a propósito (petición de la clienta,
              ago 2026): esta pantalla existe para que el formulario sea
              el único camino, y una escapatoria a "mejor te llamo"
              compite con eso. El teléfono se sigue viendo en el nav, el
              menú móvil y el footer — solo no aquí. */}
          <div className="mt-10 md:mt-14">
            <InquiryForm />
          </div>
        </div>
      </main>
    </>
  );
}
