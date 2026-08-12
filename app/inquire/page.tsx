import type { Metadata } from "next";
import Link from "next/link";
import { InquiryForm } from "@/components/InquiryForm";
import { Eyebrow, Wordmark } from "@/components/ui";
import { inquiry, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Inquire | J|S Events",
  description:
    "Tell us about your celebration. Every inquiry begins with a complimentary one-hour design consultation.",
};

/**
 * Pantalla propia del inquiry (DESIGN.md §"The inquiry page is its own
 * room"): full-screen en los tres breakpoints, con la fila 1 del nav
 * como única salida — sin links de sección ni botón Inquire, porque el
 * visitante ya llegó. No se reproduce el calendario de auto-agendado
 * del Wix vigente: el horario se acuerda en la respuesta.
 */
export default function InquirePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="gutter border-b border-line py-1 md:py-[9px] lg:pt-[10px]">
        <Link
          href="/"
          aria-label={`${site.name} — home`}
          className="flex min-h-11 items-center justify-center md:min-h-0"
        >
          <span className="lg:hidden">
            <Wordmark size="sm" />
          </span>
          <span className="hidden lg:inline-flex">
            <Wordmark size="md" />
          </span>
        </Link>
      </header>

      <main className="gutter section-y shell flex-1">
        <div className="flex flex-col gap-4 md:gap-5">
          <Eyebrow>{inquiry.eyebrow}</Eyebrow>
          <h1 className="text-display-md max-w-[18ch] font-display font-medium">
            {inquiry.heading}
          </h1>
          <p className="text-body-lg max-w-[62ch] text-ink-muted">
            {inquiry.intro}
          </p>
        </div>

        <div className="mt-10 max-w-[900px] md:mt-14">
          <InquiryForm />
        </div>

        <p className="text-body-md mt-10 border-t border-line pt-6 text-ink-subtle md:mt-14">
          Prefer to talk?{" "}
          <a
            href={site.phoneHref}
            className="border-b border-ink pb-px transition-colors duration-[180ms] hover:text-ink-subtle"
          >
            {site.phone}
          </a>
        </p>
      </main>
    </div>
  );
}
