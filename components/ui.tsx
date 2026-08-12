/**
 * Primitivas del sistema (handoff §5). Todo el estilo sale de los tokens
 * de `app/globals.css` — ningún valor literal de color o tipografía.
 */

type Props = { children: React.ReactNode; className?: string };

/** Eyebrow de sección: label 11px/500, tracking .34em, --ink-subtle. */
export function Eyebrow({ children, className = "" }: Props) {
  return (
    <div
      className={`text-label font-medium tracking-[0.34em] text-ink-subtle uppercase ${className}`}
    >
      {children}
    </div>
  );
}

/** CTA principal: fondo --sage, el único acento fuerte del sistema.
 *  Hover profundiza a --sage-deep — sin inversión, sin lift. */
export function ButtonPrimary({
  href,
  children,
  className = "",
}: Props & { href: string }) {
  return (
    <a
      href={href}
      className={`text-label inline-block bg-sage px-14 py-[18px] text-center font-medium text-bone uppercase transition-colors duration-[180ms] hover:bg-sage-deep ${className}`}
    >
      {children}
    </a>
  );
}

/** CTA secundario del nav: borde 1px, fondo transparente. */
export function ButtonOutline({
  href,
  children,
  className = "",
}: Props & { href: string }) {
  return (
    <a
      href={href}
      // La caja visible mide 32px para no dominar una fila de 53; el área
      // táctil llega a 44px con un ::after que la extiende 6px arriba y
      // abajo. Tamaño visual y superficie de toque no son el mismo
      // rectángulo — forzarlos a serlo es lo que engorda el botón.
      // La extensión se mantiene en todos los breakpoints: las tablets
      // también son táctiles, y en desktop un target indulgente no estorba.
      className={`text-label-sm relative inline-flex items-center border border-ink px-4 py-[8px] font-medium uppercase transition-colors duration-[180ms] after:absolute after:inset-x-0 after:-top-1.5 after:-bottom-1.5 after:content-[''] hover:border-sage hover:bg-sage hover:text-bone md:px-5 lg:px-6 lg:py-[9px] ${className}`}
    >
      {children}
    </a>
  );
}

/** Link de texto con subrayado propio (no `text-decoration`). */
export function LinkUnderline({
  href,
  children,
  className = "",
}: Props & { href: string }) {
  return (
    <a
      href={href}
      // El padding da los 44px de área táctil en mobile; el subrayado vive
      // en el span para quedar pegado al texto y no al borde del área.
      className={`text-label self-start py-[15px] font-medium uppercase transition-colors duration-[180ms] hover:text-ink-subtle md:py-0 ${className}`}
    >
      <span className="border-b border-ink pb-1">{children}</span>
    </a>
  );
}

/**
 * Logotipo "Jessica S. Designs".
 *
 * PROVISIONAL — reproduce en texto la parte de palabra del logotipo que
 * entregó la clienta (serif en versales), pero NO el monograma J+S
 * entrelazado, que es un dibujo y necesita su SVG. Cuando llegue el
 * archivo, esto se sustituye por la imagen.
 *
 * La línea "Wedding & Event Design & Styling" del logotipo NO se usa
 * aquí por decisión del PM: en el nav satura, y el tagline ya vive en el
 * hero y en el footer.
 *
 * `tone` decide el color sobre claro u oscuro.
 */
export function Wordmark({
  size = "md",
  tone = "dark",
}: {
  size?: "sm" | "md" | "lg";
  tone?: "dark" | "light";
}) {
  const scale = {
    sm: "text-[12px] tracking-[0.16em]",
    md: "text-[14px] tracking-[0.18em]",
    lg: "text-[15px] tracking-[0.2em]",
  }[size];

  return (
    <span
      className={`font-display font-medium whitespace-nowrap uppercase ${scale} ${
        tone === "dark" ? "text-ink" : "text-bone"
      }`}
    >
      Jessica S. Designs
    </span>
  );
}
