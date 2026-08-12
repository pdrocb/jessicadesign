/**
 * Primitivas del sistema (handoff §5). Todo el estilo sale de los tokens
 * de `app/globals.css` — ningún valor literal de color o tipografía.
 */

import Image from "next/image";
import logoMark from "@/assets/logo-mark.png";
import logoMarkLight from "@/assets/logo-mark-light.png";

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
 * Logotipo "Jessica S. Designs" — el de la clienta, recortado del
 * original y con el fondo blanco convertido en alfa para que se apoye
 * sobre marfil sin recuadro.
 *
 * Se usa la versión SIN la línea "Wedding & Event Design & Styling"
 * (decisión PM): en el nav esa tercera línea satura, y el tagline ya
 * vive en el hero y en el footer. `logo-full.png` conserva el lockup
 * completo para piezas donde sí quepa.
 *
 * Hay dos archivos en vez de recolorear por CSS porque el logotipo es un
 * mapa de bits: el ink va en `logo-mark`, el bone en `logo-mark-light`.
 *
 * El alto manda: el lockup es apilado (1.35:1) y son sus proporciones,
 * no el ancho, las que fijan si "JESSICA S. DESIGNS" se lee. En el asset
 * las versales ocupan el 13.7% del alto, así que hacen falta ~80px de
 * logo para que lleguen a los 11px del token `label`; por debajo de ~70
 * el nombre se vuelve una mancha. Quien pone el alto es el llamador —
 * en el nav cambia al colapsar. Arreglo real pendiente: versión
 * horizontal del logotipo.
 *
 * `width`/`height` fijan la relación de aspecto y el srcset apuntando al
 * uso MÁS GRANDE; el alto real lo decide `className`.
 */
export function Wordmark({
  tone = "dark",
  className = "",
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Image
      src={tone === "dark" ? logoMark : logoMarkLight}
      alt="Jessica S. Designs"
      width={113}
      height={84}
      priority
      className={`w-auto ${className}`}
    />
  );
}
