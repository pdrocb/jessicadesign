import type { Metadata } from "next";
import { InquiryForm } from "@/components/InquiryForm";
import { SiteHeader } from "@/components/SiteHeader";
import { Eyebrow } from "@/components/ui";
import { inquiry } from "@/lib/content";
import { getInquireDocument } from "@/cms/content/inquire";
import { getSiteSettings } from "@/cms/settings/repository";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, document] = await Promise.all([
    getSiteSettings(),
    getInquireDocument(),
  ]);

  return createPageMetadata(settings, {
    title: document.metaTitle,
    description: document.metaDescription,
    pathname: "/inquire",
  });
}

/**
 * Pantalla propia del inquiry (DESIGN.md §"The inquiry page is its own
 * room"): full-screen en los tres breakpoints, con la misma barra fija
 * del home y sus rutas root-relative para que siempre haya regreso. No se reproduce el
 * calendario de auto-agendado del Wix: el horario se acuerda al
 * responder.
 *
 * La columna se centra en el documento (`mx-auto`) en vez de colgar del
 * borde izquierdo: sin fotografía que sostenga el rail completo, una
 * columna alineada a la izquierda dejaba medio viewport vacío.
 */
export default async function InquirePage() {
  const [settings, document] = await Promise.all([
    getSiteSettings(),
    getInquireDocument(),
  ]);
  return (
    <>
      <SiteHeader settings={settings} />
      <main className="gutter section-y pt-[calc(var(--section-y)_+_80px)] md:pt-[calc(var(--section-y)_+_88px)] lg:pt-[calc(var(--section-y)_+_96px)]">
        <div className="mx-auto flex w-full max-w-[900px] flex-col">
          <div className="flex flex-col gap-4 md:gap-5">
            <Eyebrow>{inquiry.eyebrow}</Eyebrow>
            <h1 className="text-display-md max-w-[18ch] font-display font-medium">
              {document.heading}
            </h1>
            <p className="text-body-lg max-w-[62ch] text-ink-muted">
              {document.introduction}
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
