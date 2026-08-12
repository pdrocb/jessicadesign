"use client";

import { useEffect } from "react";

/**
 * Observador único del Reveal (DESIGN.md §Motion): revela cada
 * [data-reveal] una vez al entrar al viewport y deja de observarlo.
 * Sin envoltorios en el árbol — los componentes solo marcan el atributo
 * y el CSS de globals.css hace la animación.
 */
export function RevealObserver() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // También revela lo que ya quedó ARRIBA del viewport (recarga a
          // media página): nunca debe quedar contenido invisible al subir.
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        }
      },
      // El elemento asoma un 10% antes de dispararse: llega, no aparece.
      { rootMargin: "0px 0px -10% 0px" },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
