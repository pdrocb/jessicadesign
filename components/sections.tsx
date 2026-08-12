import Image from "next/image";
import Link from "next/link";
import { images, lookbook, process, quotes, services, site } from "@/lib/content";
import {
  ButtonPrimary,
  Eyebrow,
  LinkUnderline,
  Wordmark,
} from "@/components/ui";

/* ── Hero ──────────────────────────────────────────────────────────
   Collage de 3 imágenes en desktop, 2 en tablet, 1 en mobile (§4).
   El H1 se superpone al collage en desktop/tablet; en mobile va en
   blanco sobre la foto, que lleva su propio gradiente para contraste. */
export function Hero() {
  return (
    <section
      aria-label="Introduction"
      className="gutter relative shell pt-7 pb-10 md:pt-12 md:pb-16 lg:pt-18 lg:pb-24"
    >
      {/* El titular se apoya en papel en los tres breakpoints, nunca sobre
          una fotografía. Lo editorial del hero es el escalonado del
          collage, no la superposición — el escalonado se conserva entero. */}
      {/* La itálica del hero va en tinta, no en rose-umber: itálica de
          color + botón sage sobre crema era la fórmula literal del hero
          de Florale (DESIGN.md, Italic Accent Word). */}
      <h1 className="text-display-hero mx-auto max-w-[14ch] text-center font-display font-medium text-ink">
        The Art of the <em className="font-normal">Unforgettable</em>
      </h1>

      {/* Ubicación y CTA van ANTES del collage: sin el solape, el hero
          creció 250px y el botón caía fuera del pliegue en cualquier
          portátil. Aquí aterriza sobre los 500px y el collage queda
          como la recompensa del scroll. */}
      <div className="mt-5 flex flex-col items-center gap-3.5 md:mt-7 md:gap-4 lg:mt-9 lg:gap-[18px]">
        <p className="text-label-sm text-center font-medium tracking-[0.28em] text-ink-subtle uppercase md:text-label md:tracking-[0.3em]">
          {site.location} &amp; Beyond
        </p>
        <ButtonPrimary href="/inquire" className="w-full md:w-auto">
          Begin Your Design
        </ButtonPrimary>
      </div>

      <div className="mt-8 grid grid-cols-1 items-start gap-[18px] md:mt-12 md:grid-cols-[1fr_1.2fr] lg:mt-16 lg:grid-cols-[1fr_1.15fr_1fr] lg:gap-7">
        {/* El collage empieza en tablet: mobile muestra solo la recepción. */}
        <Image
          src={images.heroTablescape}
          alt="Styled wedding tablescape"
          sizes="(min-width: 1536px) 440px, (min-width: 1200px) 30vw, 40vw"
          className="hidden h-[300px] w-full object-cover md:mt-14 md:block lg:mt-18 lg:h-[440px]"
        />

        {/* Una sola instancia de la recepción — es el LCP en los tres
            breakpoints. */}
        <Image
          src={images.heroReception}
          alt="Wedding reception designed by J|S Events"
          sizes="(min-width: 1536px) 505px, (min-width: 1200px) 36vw, (min-width: 768px) 55vw, 100vw"
          priority
          fetchPriority="high"
          className="h-[420px] w-full object-cover md:h-[400px] lg:h-[560px]"
        />

        <Image
          src={images.heroDetail}
          alt="Event styling detail"
          sizes="(min-width: 1536px) 440px, 30vw"
          className="hidden h-[440px] w-full object-cover lg:mt-[110px] lg:block"
        />
      </div>

      {/* Umbral del colapso del nav (handoff §3): 120px antes del final
          del hero. SiteHeader lo observa por id. */}
      <div id="nav-threshold" aria-hidden className="absolute inset-x-0 bottom-[120px] h-px" />
    </section>
  );
}

/* ── Manifiesto ────────────────────────────────────────────────────
   Desktop 200/1fr/200 con las dos fotos flanqueando; tablet suelta la
   foto derecha; mobile apila con la imagen al final (§4). */
export function Manifesto() {
  return (
    <section
      aria-label="Our philosophy"
      className="gutter section-y border-t border-line bg-bone lg:py-30"
    >
      <div className="shell grid items-center gap-6 md:grid-cols-[150px_1fr] md:gap-10 lg:grid-cols-[200px_1fr_200px] lg:gap-16">
        <Image
          src={images.manifesto01}
          alt="Reception detail"
          sizes="(min-width: 1200px) 200px, (min-width: 768px) 150px, 100vw"
          className="order-2 aspect-[4/3] w-full object-cover md:order-none md:aspect-[3/4]"
        />
        <div data-reveal className="flex flex-col gap-5 md:gap-6 lg:items-center lg:gap-8 lg:text-center">
          <Eyebrow>Our Philosophy</Eyebrow>
          <p className="text-quote-xl font-display font-normal lg:max-w-[22ch]">
            A beautiful wedding is planned. An unforgettable one is{" "}
            <em>designed</em>.
          </p>
          <p className="text-body-md text-ink-muted lg:max-w-[520px] lg:text-body-lg">
            We are the design layer of your celebration. Working hand in hand
            with your planner, florist, and venue, we shape the look, feel, and
            atmosphere of your day — every color, texture, and detail composed
            with intention, so the moment feels unmistakably yours.
          </p>
        </div>
        <Image
          src={images.manifesto02}
          alt="Tablescape detail"
          sizes="200px"
          className="hidden aspect-[3/4] w-full object-cover lg:mt-20 lg:block"
        />
      </div>
    </section>
  );
}

/* ── Expertise ─────────────────────────────────────────────────────
   4 col → 2 col → 1 col apilada (§4). */
export function Services() {
  return (
    <section
      id="expertise"
      aria-label="Expertise"
      className="gutter section-y shell border-t border-line"
    >
      <div data-reveal className="mb-7 flex flex-col gap-2 md:mb-11 md:flex-row md:items-baseline md:justify-between lg:mb-16">
        <h2 className="text-heading-lg font-display font-medium">Expertise</h2>
        <div className="text-label-sm font-medium tracking-[0.3em] text-ink-subtle uppercase md:text-label">
          Design · Styling · Execution
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-7">
        {services.map((svc, i) => (
          <article
            key={svc.name}
            data-reveal
            // Escalonado de 80ms entre tarjetas (DESIGN.md §Motion).
            style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
            className="flex flex-col gap-3"
          >
            <Image
              src={svc.img}
              alt={svc.name}
              sizes="(min-width: 1536px) 340px, (min-width: 1200px) 25vw, (min-width: 768px) 50vw, 100vw"
              className="mb-1 aspect-[4/5] w-full object-cover md:aspect-[3/4] lg:mb-2"
            />
            <div className="font-display text-[13px] text-ink-subtle md:text-[14px] lg:text-[15px]">
              {svc.numeral}
            </div>
            <h3 className="text-heading-md font-display font-medium">
              {svc.name}
            </h3>
            <p className="text-body-sm text-ink-subtle">{svc.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ── Proceso ───────────────────────────────────────────────────────
   Los seis pasos del brief de la clienta (PRODUCT.md). Sin tarjetas:
   numeral, título y copy separados por hairlines, como la lista de
   reglas de las FAQs. Desktop 3 col → tablet 2 → mobile 1.

   El paso V (el mock-up presencial) lleva el fleurón — la única
   ornamentación que permite el sistema, gastada en el único paso que
   casi ningún competidor puede ofrecer. */
export function Process() {
  return (
    <section
      id="process"
      aria-label="Our design process"
      className="gutter section-y scroll-mt-28 border-t border-line bg-bone lg:py-30"
    >
      <div className="shell">
        <div
          data-reveal
          className="flex flex-col gap-4 md:max-w-[62ch] md:gap-5"
        >
          <Eyebrow>{process.eyebrow}</Eyebrow>
          <h2 className="text-heading-lg font-display font-medium">
            {process.heading}
          </h2>
          <p className="text-body-md text-ink-muted lg:text-body-lg">
            {process.intro}
          </p>
        </div>

        <ol className="mt-9 grid grid-cols-1 gap-px border-t border-line-warm md:mt-12 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {process.steps.map((step, i) => (
            <li
              key={step.name}
              data-reveal
              style={{ "--reveal-delay": `${(i % 3) * 80}ms` } as React.CSSProperties}
              className="flex flex-col gap-2.5 border-b border-line-warm py-6 pr-0 md:py-8 md:pr-10 lg:py-10"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-display text-[13px] text-ink-subtle md:text-[14px]">
                  {step.numeral}
                </span>
                {step.name === "The Mock-Up" && (
                  <span aria-hidden className="font-display text-[15px] text-sage">
                    ❋
                  </span>
                )}
              </div>
              <h3 className="text-heading-md font-display font-medium">
                {step.name}
              </h3>
              <p className="text-body-sm max-w-[46ch] text-ink-subtle">
                {step.copy}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── Break editorial ──────────────────────────────────────────────
   Lámina a sangre con su pie debajo, como una plancha de libro de
   fotografía. Sin scrim: la imagen no se toca, y el pie se lee sobre
   papel en vez de pelear con un mantel blanco. */
export function EditorialBreak() {
  return (
    <figure data-reveal className="m-0">
      <Image
        src={images.heroReception}
        alt="Full wedding reception design"
        sizes="100vw"
        className="h-80 w-full object-cover md:h-[420px] lg:h-[640px]"
      />
      <figcaption className="gutter shell flex flex-col gap-1 pt-3.5 md:flex-row md:items-baseline md:justify-between md:gap-8 md:pt-4 lg:pt-5">
        <p className="text-quote-italic font-display text-ink italic">
          Every detail, composed with intention.
        </p>
        <span className="text-label-sm shrink-0 font-medium tracking-[0.3em] text-ink-subtle uppercase">
          Hudson Valley, NY
        </span>
      </figcaption>
    </figure>
  );
}

/* ── About ─────────────────────────────────────────────────────── */
export function About() {
  return (
    <section aria-label="About Jessica Salomon" className="gutter section-y lg:py-30">
      <div className="shell grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-22">
        <Image
          src={images.jessica}
          alt="Jessica Salomon, owner and lead stylist"
          sizes="(min-width: 1536px) 610px, (min-width: 1200px) 40vw, 100vw"
          className="w-full object-cover"
        />
        <div data-reveal className="flex flex-col gap-5 lg:gap-6">
          <Eyebrow>The Designer</Eyebrow>
          <h2 className="text-display-md font-display font-medium">
            Jessica Salomon
          </h2>
          <p className="text-quote-italic font-display text-ink-muted italic">
            Fifteen years of styling celebrations — from the Bronx to the Hudson
            Valley.
          </p>
          {/* Tope de medida: con el rail a 1536 esta columna llega a ~76ch,
              por encima del límite cómodo de lectura. */}
          <p className="text-body-md max-w-[66ch] text-ink-muted lg:text-body-lg">
            Jessica is the eye behind every J|S celebration. Her work begins
            with you — your story, your Pinterest board, the feeling you can’t
            quite put into words — and ends in a room your guests will talk
            about for years. Details matter; she designs every one of them.
          </p>
          {/* Antes decía "Meet Jessica" y llevaba al bloque de inquiry:
              la etiqueta prometía una biografía que no existe. */}
          <LinkUnderline href="/inquire">Work With Jessica</LinkUnderline>
        </div>
      </div>
    </section>
  );
}

/* ── Testimonios ──────────────────────────────────────────────────
   Encabezado sticky en desktop; apilado en tablet y mobile (§4).
   Vive sobre --petal (recalibración ago 2026): el rosa de sus flores
   como atmósfera — las citas se leen luminosas, no solemnes. */
export function Testimonials() {
  return (
    <section
      aria-label="Testimonials"
      className="gutter section-y bg-petal lg:py-30"
    >
      <div className="shell grid items-start gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <div data-reveal className="flex flex-col gap-3.5 lg:sticky lg:top-16 lg:gap-6">
          <div className="text-label-sm font-medium tracking-[0.34em] text-rose-umber uppercase md:text-label">
            Kind Words
          </div>
          <h2 className="text-display-md font-display font-normal">
            In their <em className="text-rose-umber">own</em> words
          </h2>
          <div aria-hidden className="hidden h-px w-12 bg-petal-line md:block" />
        </div>
        <div className="flex flex-col">
          {quotes.map((q, i) => (
            <figure
              key={q.who}
              data-reveal
              style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
              className="flex flex-col gap-3 border-b border-petal-line py-[26px] md:gap-3.5 md:py-8 lg:gap-[18px] lg:py-11"
            >
              <blockquote className="text-quote-md max-w-[62ch] font-display text-ink">
                “{q.text}”
              </blockquote>
              <figcaption className="text-label-xs font-medium tracking-[0.3em] text-rose-umber uppercase md:text-label-sm md:tracking-[0.3em]">
                {q.who}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Look Book ────────────────────────────────────────────────────
   Grid full-bleed con gap 8 (§6). Enlaza a la galería, aún por diseñar. */
export function LookBook() {
  return (
    <section id="look-book" aria-label="Look book" className="section-y">
      <div data-reveal className="gutter shell mb-7 flex items-baseline justify-between lg:mb-14">
        <h2 className="text-heading-lg font-display font-medium">
          The Look Book
        </h2>
        <LinkUnderline href="#look-book">View All</LinkUnderline>
      </div>
      <div className="grid grid-cols-2 gap-2 px-2 lg:grid-cols-4">
        {lookbook.map((shot, i) => (
          <div
            key={shot.alt}
            data-reveal
            style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
          >
            <Image
              src={shot.img}
              alt={shot.alt}
              sizes="(min-width: 1200px) 25vw, 50vw"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── CTA ──────────────────────────────────────────────────────── */
export function Cta() {
  return (
    <section
      aria-label="Begin the experience"
      className="gutter section-y border-t border-line bg-cream lg:py-32"
    >
      {/* El reveal va en el contenido, no en la sección: transformar la
          banda a sangre completa dejaría ver el fondo de atrás. */}
      <div data-reveal className="flex flex-col items-center gap-5 text-center md:gap-7 lg:gap-9">
        <Eyebrow>Begin the Experience</Eyebrow>
        <h2 className="text-display-lg max-w-[16ch] font-display font-medium">
          Your day, designed to be remembered.
        </h2>
        <p className="text-body-md text-ink-subtle">
          Complimentary one-hour design consultation.
        </p>
        <ButtonPrimary href="/inquire" className="w-full md:w-auto">
          Inquire
        </ButtonPrimary>
      </div>
    </section>
  );
}

/* ── Footer ───────────────────────────────────────────────────── */
export function SiteFooter() {
  const footerNav = [
    { label: "Home", href: "/" },
    { label: "Look Book", href: "#look-book" },
    { label: "Luxury Picnics", href: "#expertise" },
    { label: "Blog", href: "#" },
    { label: "Inquire", href: "/inquire" },
  ];

  return (
    <footer className="gutter bg-ink pt-11 pb-7 text-bone md:pt-14 lg:pt-18 lg:pb-10">
      <div className="shell flex flex-col gap-6 md:gap-9 lg:gap-12">
        <div className="flex flex-col gap-6 md:flex-row md:flex-wrap md:items-start md:justify-between md:gap-10">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-start">
              <Wordmark size="md" tone="light" />
            </div>
            <div className="text-label-xs font-medium text-ink-faint uppercase">
              {site.tagline}
            </div>
          </div>

          <nav
            aria-label="Footer"
            className="text-label-sm grid grid-cols-2 gap-x-3.5 font-medium uppercase md:flex md:gap-9"
          >
            {footerNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                // Igual que el nav: 44px de área táctil en mobile sin gap
                // extra — el propio padding hace la separación visual.
                className="py-[15px] transition-colors duration-[180ms] hover:text-ink-faint md:py-0"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-1.5 text-[11px] text-on-dark-muted md:gap-2 md:text-right md:text-[12px]">
            <div>{site.location}</div>
            <a
              href={site.phoneHref}
              className="py-[15px] transition-colors duration-[180ms] hover:text-bone md:py-0"
            >
              {site.phone}
            </a>
            <div className="text-label-sm flex gap-4 font-medium tracking-[0.2em] uppercase md:mt-1.5 md:justify-end">
              <a
                href={site.instagram}
                className="py-[15px] text-bone transition-colors duration-[180ms] hover:text-ink-faint md:py-0"
              >
                Instagram
              </a>
              <a
                href={site.facebook}
                className="py-[15px] text-bone transition-colors duration-[180ms] hover:text-ink-faint md:py-0"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-line-dark pt-5 text-[9px] tracking-[0.18em] text-ink-faint md:flex-row md:justify-between md:text-[10px] lg:pt-6">
          <span>© 2026 {site.legalName}</span>
          <span>Intentional Design · Elevated Experience</span>
        </div>
      </div>
    </footer>
  );
}
