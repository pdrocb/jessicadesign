"use client";

import { useState } from "react";
import { faqs } from "@/lib/content";
import { Eyebrow } from "@/components/ui";

/**
 * Acordeón de FAQs (handoff §5): una abierta a la vez, signo + / − en
 * Playfair, numerales romanos en minúscula, respuesta a 60ch máximo.
 *
 * En desktop el encabezado ocupa la columna izquierda y todas las
 * preguntas quedan juntas a la derecha; tablet y mobile apilan.
 */
export function Faqs() {
  const [open, setOpen] = useState(0);

  return (
    <section
      aria-label="Frequently asked questions"
      className="gutter section-y border-t border-line bg-bone lg:py-24"
    >
      <div className="shell grid items-start gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <div className="flex flex-col gap-3.5 lg:sticky lg:top-16 lg:gap-6">
          <Eyebrow>Good to Know</Eyebrow>
          <h2 className="text-display-md font-display font-normal">
            Questions, <em>answered</em>
          </h2>
          <div aria-hidden className="hidden h-px w-12 bg-ink-faint md:block" />
          <p className="font-display text-[16px] leading-relaxed text-ink-subtle italic lg:text-[17px]">
            Everything else, over a glass of something — in your complimentary
            consultation.
          </p>
        </div>

        <div className="flex flex-col border-t border-line-warm">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={faq.q} className="border-b border-line-warm">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    className="flex w-full cursor-pointer items-baseline justify-between gap-6 px-1 py-[18px] text-left md:py-[22px]"
                  >
                    <span className="flex items-baseline gap-3 lg:gap-[18px]">
                      <span className="font-display text-[13px] text-ink-faint">
                        {faq.numeral}
                      </span>
                      <span className="font-display text-[17px] font-medium lg:text-[19px]">
                        {faq.q}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="font-display text-[22px] leading-none text-ink-faint"
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                </h3>
                {isOpen && (
                  <p
                    id={`faq-panel-${i}`}
                    className="text-body-md max-w-[60ch] px-1 pb-6 pl-9 text-ink-muted"
                  >
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
