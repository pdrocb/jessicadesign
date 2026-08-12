"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navItems, site } from "@/lib/content";
import { ButtonOutline, Wordmark } from "@/components/ui";

/**
 * Nav editorial de dos filas (handoff §3).
 *
 * Fila 1 (logo + CTA) nunca se mueve. Fila 2 (links) colapsa al pasar el
 * hero y solo reaparece al volver por encima del umbral — no con cualquier
 * scroll hacia arriba a media página.
 *
 * El umbral es un centinela de 1px que Hero coloca 120px antes de su
 * final. Un IntersectionObserver sobre él sustituye al listener de scroll
 * del prototipo: cero trabajo en el hilo principal mientras se hace scroll.
 */
export function SiteHeader() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("nav-threshold");
    if (!sentinel) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        // Colapsado solo cuando el centinela quedó ARRIBA del viewport.
        // Si sale por abajo (no debería pasar) el nav se mantiene expandido.
        setCollapsed(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-(--z-nav) bg-paper">
      {/* En mobile el padding baja a 4px porque el logo y el CTA ya miden
          44px por accesibilidad: la fila mantiene los ~52px del handoff. */}
      <div className="gutter grid grid-cols-[1fr_auto_1fr] items-center border-b border-line py-1 md:py-[9px] lg:pt-[10px]">
        <div />
        <Link
          href="/"
          aria-label={`${site.name} — home`}
          className="flex min-h-11 items-center justify-center md:min-h-0"
        >
          <span className="lg:hidden">
            <Wordmark size="sm" />
          </span>
          <span className="hidden lg:inline-flex xl:hidden">
            <Wordmark size="md" />
          </span>
          <span className="hidden xl:inline-flex">
            <Wordmark size="lg" />
          </span>
        </Link>
        <div className="flex justify-end">
          <ButtonOutline href="/inquire">Inquire</ButtonOutline>
        </div>
      </div>

      <div
        // El colapso anima grid-template-rows 1fr → 0fr en lugar de una
        // max-height fija: la fila mide distinto por breakpoint (la altura
        // táctil de mobile la hace más alta) y así no hay valor mágico que
        // mantener sincronizado. `prefers-reduced-motion` lo vuelve
        // instantáneo desde globals.css.
        className="grid transition-[grid-template-rows,opacity] duration-[420ms] ease-(--ease-geometry)"
        style={{
          gridTemplateRows: collapsed ? "0fr" : "1fr",
          opacity: collapsed ? 0 : 1,
          transitionDuration: "420ms, 260ms",
        }}
        // Fuera del flujo de tabulación cuando está colapsada: no se
        // enfoca un link invisible.
        inert={collapsed}
      >
        {/* El borde va dentro del recorte: colapsada, la fila no deja una
            línea de 1px flotando bajo el logo. */}
        <div className="overflow-hidden border-b border-line">
          <nav
            aria-label="Primary"
            // `justify-center-safe` centra los links en los tres
            // breakpoints, pero degrada solo a alineación izquierda cuando
            // no caben — en un teléfono estrecho, un `center` normal
            // recortaría el principio de la fila y dejaría "Home"
            // inalcanzable por scroll.
            className="gutter text-label-sm flex items-center justify-center-safe gap-[22px] overflow-x-auto font-medium tracking-[0.2em] uppercase md:gap-7 md:py-[10px] md:tracking-[0.22em] lg:gap-10 lg:pt-3 lg:pb-[11px] lg:text-label lg:tracking-[0.24em]"
          >
            {navItems.map((item, i) => (
              <Link
                key={item.label}
                href={item.href}
                aria-current={i === 0 ? "page" : undefined}
                // 15px arriba y abajo llevan el target táctil a 44px en
                // mobile (handoff §4); desde tablet manda el padding del nav.
                className="whitespace-nowrap py-[15px] transition-colors duration-[180ms] hover:text-ink-subtle md:py-0"
              >
                {/* El subrayado del activo va en el span: pegado al texto,
                    no al borde del área táctil. */}
                <span
                  className={i === 0 ? "border-b border-ink pb-[2px]" : undefined}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
