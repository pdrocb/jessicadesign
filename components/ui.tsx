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
  onClick,
}: Props & { href: string; onClick?: () => void }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`text-label inline-block bg-sage px-14 py-[18px] text-center font-medium text-bone uppercase transition-colors duration-[180ms] hover:bg-sage-deep ${className}`}
    >
      {children}
    </a>
  );
}

/**
 * CTA del nav. Va relleno en sage, igual que el botón primario: un solo
 * idioma en todo el sitio — verde es la acción.
 *
 * Crece a 44px en desktop. Los 32px originales existían "para no dominar
 * una fila de 53px", y esa fila ya no existe: con el logotipo a 84px la
 * fila mide 104 y sobraban 70px de holgura. En móvil se queda como
 * estaba, donde el tamaño ya era el correcto.
 */
export function ButtonOutline({
  href,
  children,
  className = "",
}: Props & { href: string }) {
  return (
    <a
      href={href}
      // En móvil la caja visible mide 34px y el área táctil llega a 44 con
      // un ::after que la extiende arriba y abajo: tamaño visual y
      // superficie de toque no tienen por qué ser el mismo rectángulo, y
      // forzarlos a serlo es lo que engorda el botón en una fila estrecha.
      // Desde `lg` la caja ya mide 44 por sí sola y el ::after sobra, pero
      // se deja: no estorba y evita un segundo juego de reglas.
      // El py móvil es 10px y no 8: al pasar de contorno a relleno se
      // perdieron los 2px del borde, y con 8px el área táctil caía a 42.
      // Los 44 no se negocian.
      className={`text-label-sm relative inline-flex items-center bg-sage px-4 py-[10px] font-medium text-bone uppercase transition-colors duration-[180ms] after:absolute after:inset-x-0 after:-top-1.5 after:-bottom-1.5 after:content-[''] hover:bg-sage-deep md:px-5 lg:px-8 lg:py-[14px] lg:text-label ${className}`}
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
 * las versales ocupan el 13.7% del alto, así que harían falta ~80px para
 * igualar el token `label`. El nav lo usa deliberadamente más pequeño:
 * la clienta priorizó una sola barra delgada aun con esa pérdida de
 * legibilidad. Una versión horizontal sigue siendo la mejora real.
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
      sizes="(min-width: 1024px) 70px, 64px"
      className={`w-auto ${className}`}
    />
  );
}
