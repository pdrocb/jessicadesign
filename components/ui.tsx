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
 * Monograma J|S. La barra es un <span> de 1px, no el carácter "|":
 * su altura y separación se controlan al pixel y no dependen de la
 * métrica de la fuente. `tone` decide el color sobre claro u oscuro.
 */
export function Wordmark({
  size = "md",
  tone = "dark",
}: {
  size?: "sm" | "md" | "lg";
  tone?: "dark" | "light";
}) {
  const scale = {
    sm: { type: "text-[21px]", bar: "h-[19px]", gap: "gap-[5px]", sub: "text-[8px]" },
    md: { type: "text-[24px]", bar: "h-[22px]", gap: "gap-[6px]", sub: "text-[9px]" },
    lg: { type: "text-[27px]", bar: "h-[25px]", gap: "gap-[7px]", sub: "text-[10px]" },
  }[size];
  const bar = tone === "dark" ? "bg-ink" : "bg-bone";

  return (
    <span className="flex flex-col items-center gap-[3px] font-display">
      <span
        className={`flex items-center font-medium leading-none ${scale.type} ${scale.gap}`}
      >
        J<span className={`inline-block w-px ${scale.bar} ${bar}`} />S
      </span>
      <span
        className={`font-semibold tracking-[0.42em] indent-[0.42em] uppercase ${scale.sub}`}
      >
        Events
      </span>
    </span>
  );
}
