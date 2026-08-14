import Image from "next/image";
import Link from "next/link";
import {
  images,
  lookbook,
  lookbookIntro,
  process,
  quotes,
  services,
  silkFlorals,
  site,
} from "@/lib/content";
import {
  ButtonPrimary,
  Eyebrow,
  LinkUnderline,
  Wordmark,
} from "@/components/ui";
import { TestimonialRail } from "@/components/TestimonialRail";

/* ── Hero ──────────────────────────────────────────────────────────
   La geometría replica a Florale: apilado hasta 1439px y split 1:1 desde
   1440px. La identidad no se replica: tipografía, color, botones, copy y
   pie de foto siguen perteneciendo al sistema de Jessica. */
export function Hero() {
  return (
    <section
      aria-label="Introduction"
      className="gutter bg-paper pt-8 pb-4 md:py-16 wide:py-20"
    >
      <div className="shell grid gap-7 md:gap-12 wide:grid-cols-2 wide:items-center wide:gap-16">
        <div className="flex max-w-[560px] flex-col gap-5 md:max-w-[80%] md:gap-6 wide:min-h-[520px] wide:max-w-none wide:justify-center wide:gap-7">
          {/* El eyebrow es quien nombra el negocio en claro: sin esta
              línea, una visitante no sabía qué vendía Jessica hasta el
              segundo scroll. Categoría primero, geografía después. */}
          {/* Sin la ubicación: el pie de la foto ya dice "Hudson Valley,
              NY" a unos centímetros, y repetirlo en el eyebrow sonaba a
              relleno. */}
          <p className="text-label-sm font-medium tracking-[0.28em] text-ink-subtle uppercase md:text-label md:tracking-[0.3em]">
            {site.tagline}
          </p>

          <h1 className="text-display-hero max-w-none font-display font-medium leading-[1.1] tracking-[0.005em] text-ink md:max-w-[15ch] md:leading-[1.04] md:tracking-normal">
            <span className="block">You know how</span>
            <span className="block md:inline wide:block">
              it should <em className="font-normal">feel</em>.
            </span>{" "}
            <span className="block md:inline wide:block">
              We design the rest.
            </span>
          </h1>

          <p className="text-body-lg mt-1 max-w-[44ch] text-ink-muted md:mt-0">
            We shape the look and feel of the whole celebration, then style
            every piece of it ourselves, on the day.
          </p>

          <div className="mt-1 flex items-center gap-9">
            <div id="hero-primary-cta" className="w-full md:w-auto">
              <ButtonPrimary href="/inquire" className="w-full md:w-auto">
                Start With a Conversation
              </ButtonPrimary>
            </div>
            <div className="hidden md:block">
              <LinkUnderline href="/#look-book" className="!self-center">
                See the Work
              </LinkUnderline>
            </div>
          </div>
        </div>

        <figure className="m-0 flex flex-col gap-3">
          <div className="relative -mx-(--gutter) aspect-square w-[calc(100%_+_var(--gutter)_*_2)] max-w-none md:mx-0 md:aspect-[16/10] md:w-full wide:aspect-square">
            <Image
              src={images.heroTapers}
              alt="Long garden table set with white hydrangeas, taper candles and gold vessels at golden hour"
              sizes="(min-width: 1440px) 50vw, 100vw"
              priority
              fetchPriority="high"
              fill
              className="object-cover"
            />
          </div>
          <figcaption className="text-label-sm text-center font-medium tracking-[0.28em] text-ink-subtle uppercase md:text-left">
            Terrace welcome dinner · Hudson Valley, NY
          </figcaption>
          <div className="flex justify-center md:hidden">
            <LinkUnderline href="/#look-book" className="!self-center">
              See the Work
            </LinkUnderline>
          </div>
        </figure>
      </div>
    </section>
  );
}

/* ── Manifiesto ────────────────────────────────────────────────────
   Composición editorial asimétrica: una fotografía ancla la izquierda,
   el texto avanza hacia el centro y una segunda pieza, menor y más baja,
   cierra a la derecha. En móvil vuelve a una lectura lineal. */
export function Manifesto() {
  return (
    <section
      aria-label="Our philosophy"
      className="gutter section-y border-t border-line bg-bone lg:py-30"
    >
      <div className="shell grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-x-8 md:gap-y-10 lg:gap-x-12 lg:gap-y-12">
        <div
          data-reveal
          className="flex flex-col gap-5 md:col-span-8 md:col-start-5 md:gap-6 lg:col-span-6 lg:col-start-4 lg:pt-4"
        >
          <Eyebrow>Our Philosophy</Eyebrow>
          <p className="text-quote-xl max-w-[22ch] font-display font-normal">
            An unforgettable celebration is designed to be <em>felt</em>.
          </p>
        </div>

        <div
          data-reveal
          className="text-body-lg flex flex-col gap-5 text-ink-muted md:col-span-7 md:col-start-6 lg:col-span-5 lg:col-start-5 lg:max-w-[520px]"
        >
          <p>
            We shape how your celebration looks, feels, and comes together.
            From tablescapes and candlelight to florals, stationery, signage,
            furniture, and the smallest finishing details, every element is
            thoughtfully considered.
          </p>
          <p>
            We look at the celebration as a whole, making sure each piece works
            together to create a space that feels cohesive, intentional, and
            distinctly yours.
          </p>
        </div>

        <Image
          src={images.manifesto01}
          alt="Candlelit reception table beneath suspended greenery"
          sizes="(min-width: 1200px) 25vw, (min-width: 768px) 33vw, 100vw"
          className="aspect-[4/3] w-full object-cover md:col-span-4 md:col-start-1 md:row-start-2 md:aspect-[3/4] lg:col-span-3 lg:row-start-1 lg:row-end-3 lg:mt-20"
        />

        <Image
          src={images.manifesto02}
          alt="Tablescape detail"
          sizes="25vw"
          className="hidden aspect-[3/4] w-full object-cover lg:col-span-3 lg:col-start-10 lg:row-start-2 lg:-mt-24 lg:block xl:-mt-32"
        />
      </div>
    </section>
  );
}

/* ── Expertise ─────────────────────────────────────────────────────
   La información repetida necesita una retícula compacta: 4 col →
   2 col → 1 col. El gesto editorial vive en el encabezado, donde el
   texto de apoyo se desplaza al extremo derecho. */
export function Services() {
  return (
    <section
      id="expertise"
      aria-label="Expertise"
      className="gutter section-y shell scroll-mt-28 border-t border-line"
    >
      <div data-reveal className="mb-8 md:mb-12 lg:mb-14">
        <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
          <h2 className="text-heading-lg font-display font-medium">Expertise</h2>
          <div className="text-label-sm font-medium tracking-[0.3em] text-ink-subtle uppercase md:text-label">
            Design · Styling · Execution
          </div>
        </div>
        <p className="text-body-lg mt-6 max-w-[42ch] text-ink-muted md:mt-8 md:ml-auto md:text-right">
          Four ways to bring a clear, cohesive design vision to life.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-7">
        {services.map((svc, i) => (
          <article
            key={svc.name}
            id={svc.slug}
            data-reveal
            // Escalonado de 80ms entre tarjetas (DESIGN.md §Motion).
            style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
            className="group flex scroll-mt-28 flex-col gap-3"
          >
            <div className="mb-1 overflow-hidden lg:mb-2">
              <Image
                src={svc.img}
                alt={svc.name}
                sizes="(min-width: 1536px) 340px, (min-width: 1200px) 25vw, (min-width: 768px) 50vw, 100vw"
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.03] md:aspect-[3/4]"
              />
            </div>
            <div className="font-display text-[13px] text-ink-subtle md:text-[14px] lg:text-[15px]">
              {svc.numeral}
            </div>
            <h3 className="text-heading-md font-display font-medium">
              {svc.name}
            </h3>
            <p className="text-body-md text-ink-subtle">{svc.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ── Proceso ───────────────────────────────────────────────────────
   Los seis pasos del brief de la clienta (PRODUCT.md). Sin tarjetas:
   numeral, título y copy separados por hairlines. Desktop 3 col →
   tablet 2 → mobile 1; la retícula compacta facilita escanear el método.

   El paso V (el mock-up presencial) lleva el fleurón — la única
   ornamentación que permite el sistema, gastada en el único paso que
   casi ningún competidor puede ofrecer. */
export function Process() {
  return (
    <section
      id="process"
      aria-label="Our design process"
      className="gutter section-y scroll-mt-28 border-t border-line bg-paper lg:py-24"
    >
      <div className="shell">
        <div data-reveal className="flex flex-col gap-4 md:max-w-[62ch] md:gap-5">
          <Eyebrow>{process.eyebrow}</Eyebrow>
          <h2 className="text-heading-lg font-display font-medium">
            {process.heading}
          </h2>
          <p className="text-body-lg text-ink-muted">
            {process.intro}
          </p>
        </div>

        <ol className="mt-9 grid grid-cols-1 gap-px border-t border-line-warm md:mt-12 md:grid-cols-2 lg:grid-cols-3">
          {process.steps.map((step, i) => (
            <li
              key={step.name}
              data-reveal
              style={{ "--reveal-delay": `${(i % 3) * 80}ms` } as React.CSSProperties}
              className="flex flex-col gap-2.5 border-b border-line-warm py-6 pr-0 md:py-8 md:pr-10"
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
              <p className="text-body-md max-w-[46ch] text-ink-subtle">
                {step.copy}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── Silk Florals ──────────────────────────────────────────────────
   Línea en crecimiento de la marca (PRODUCT.md). NO es una quinta
   tarjeta de Expertise: los cuatro servicios son tipos de ocasión y
   esto es un material — mezclarlos degrada la línea a "un servicio
   más" justo cuando está creciendo.

   Composición deliberadamente distinta de Manifesto y About, que ya son
   splits de foto + texto: aquí el texto manda y las dos fotografías van
   escalonadas a distinta altura, el gesto del collage del hero. La
   página venía de dos rejillas seguidas (4 col y 3 col) y una tercera
   la habría vuelto una pila de grids. */
export function SilkFlorals() {
  return (
    <section
      id="silk-florals"
      aria-label="Silk florals"
      className="gutter section-y scroll-mt-28 border-t border-line bg-bone lg:py-30"
    >
      <div className="shell grid items-start gap-8 md:grid-cols-[1fr_0.8fr] md:gap-12 lg:grid-cols-[1fr_0.7fr_0.7fr] lg:gap-16">
        <div data-reveal className="flex flex-col gap-5 md:self-center md:gap-6 lg:gap-7">
          <Eyebrow>{silkFlorals.eyebrow}</Eyebrow>
          <p className="text-quote-xl font-display font-normal lg:max-w-[16ch]">
            {silkFlorals.statement}
          </p>
          <p className="text-body-lg max-w-[52ch] text-ink-muted">
            {silkFlorals.copy}
          </p>
          <div className="mt-1">
            <ButtonPrimary href="/inquire" className="w-full md:w-auto">
              Start With a Conversation
            </ButtonPrimary>
          </div>
        </div>

        <Image
          src={images.heroDetail}
          alt="Silk floral arrangement styled on a table"
          sizes="(min-width: 1200px) 26vw, (min-width: 768px) 36vw, 100vw"
          data-reveal
          className="aspect-[4/5] w-full object-cover md:aspect-[3/4]"
        />

        {/* La segunda foto aparece solo en desktop y baja 80px: el
            escalonado es lo que distingue esta banda de un split. */}
        <Image
          src={images.manifesto02}
          alt="Silk and fresh florals combined in a centrepiece"
          sizes="26vw"
          data-reveal
          style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
          className="hidden aspect-[3/4] w-full object-cover lg:mt-20 lg:block"
        />
      </div>
    </section>
  );
}

/* ── Break editorial ──────────────────────────────────────────────
   Lámina a sangre y nada más: sin scrim y sin pie (DESIGN.md §"The
   uncaptioned plate"). La fotografía es el argumento entero; cualquier
   cosa encima o debajo le restaba. */
export function EditorialBreak() {
  return (
    <div data-reveal>
      {/* La lámina se queda con `heroReception`: es la imagen de banda que
          la marca ya tenía y no se cambia. Cuando el hero se partió, el
          hero cedió y tomó otra foto — no al revés. */}
      <Image
        src={images.heroReception}
        alt="Full wedding reception design"
        sizes="100vw"
        className="h-80 w-full object-cover md:h-[420px] lg:h-[640px]"
      />
    </div>
  );
}

/* ── About ─────────────────────────────────────────────────────── */
export function About() {
  return (
    <section
      aria-label="About Jessica Salomon"
      className="gutter section-y bg-paper lg:py-30"
    >
      <div className="shell grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-x-10 lg:gap-x-16">
        <Image
          src={images.jessica}
          alt="Jessica Salomon, owner and lead stylist"
          sizes="(min-width: 1200px) 42vw, (min-width: 768px) 42vw, 100vw"
          className="w-full object-cover md:col-span-5"
        />
        <div
          data-reveal
          className="flex flex-col gap-5 md:col-span-7 md:mt-14 lg:col-span-6 lg:col-start-7 lg:mt-24 lg:gap-6"
        >
          <Eyebrow>The Designer</Eyebrow>
          <h2 className="text-display-md font-display font-medium">
            Jessica Salomon
          </h2>
          <p className="text-quote-italic font-display text-ink-muted italic">
            Fifteen years of styling celebrations, from the Bronx to the Hudson
            Valley.
          </p>
          {/* Tope de medida: con el rail a 1536 esta columna llega a ~76ch,
              por encima del límite cómodo de lectura. */}
          <p className="text-body-lg max-w-[66ch] text-ink-muted">
            Jessica is the eye behind every JSD celebration. Her work begins
            with your story, your Pinterest board, and the feeling you can’t
            quite put into words. It ends in a room your guests will talk
            about for years. Details matter; she designs every one of them. And
            she takes on a small number of celebrations each year, by choice:
            fewer rooms, more of her in each one.
          </p>
          {/* Firma de autor, no CTA: cierra la biografía identificando el
              rol y a la persona detrás del trabajo. La jerarquía viene de
              Clementine; tipografía y color permanecen en el sistema JSD. */}
          <footer className="mt-3 flex flex-col gap-2">
            <p className="text-label font-medium tracking-[0.28em] text-ink-subtle uppercase">
              Founder &amp; Creative Director
            </p>
            <p className="text-heading-md font-display font-medium text-ink">
              Jessica Salomon
            </p>
          </footer>
        </div>
      </div>
    </section>
  );
}

/* ── Testimonios ──────────────────────────────────────────────────
   Desktop deja las tres voces visibles en cards 6 / 3 / 3. Tablet y
   mobile usan un rail infinito nativo: el contenido se compacta sin
   convertir una pieza de lectura en autoplay. */
export function Testimonials() {
  return (
    <section
      aria-label="Testimonials"
      className="gutter section-y bg-petal lg:py-24"
    >
      <div className="shell">
        <header
          data-reveal
          className="flex flex-col gap-3.5 border-b border-petal-line pb-8 md:pb-10 lg:gap-6"
        >
          <div className="text-label-sm font-medium tracking-[0.34em] text-rose-umber uppercase md:text-label">
            Kind Words
          </div>
          <h2 className="text-display-md font-display font-normal">
            In their <em className="text-rose-umber">own</em> words
          </h2>
        </header>

        <div className="mt-8 md:mt-10 lg:mt-12">
          <TestimonialRail items={quotes} label="Client testimonials" />

          <div className="hidden lg:grid lg:grid-cols-12 lg:gap-5 xl:gap-6">
            {quotes.map((q, i) => (
              <figure
                key={q.who}
                data-reveal
                style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
                className={`flex min-h-[340px] flex-col justify-between border border-petal-line bg-paper p-8 xl:p-10 ${
                  i === 0 ? "lg:col-span-6" : "lg:col-span-3"
                }`}
              >
                <blockquote
                  className={`${
                    i === 0
                      ? "text-quote-xl max-w-[36ch]"
                      : "text-quote-md max-w-[62ch]"
                  } font-display text-ink`}
                >
                  “{q.text}”
                </blockquote>
                <figcaption className="text-label-xs mt-8 font-medium tracking-[0.3em] text-rose-umber uppercase md:text-label-sm">
                  {q.who}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Look Book ────────────────────────────────────────────────────
   Réplica estructural del Portfolio de Florale: encabezado escalonado y
   mosaico 1 → 6 → 12 columnas. La identidad y los captions son Jessica. */
const SPAN = {
  wide: "md:col-span-6 lg:col-span-8",
  tall: "md:col-span-3 lg:col-span-4",
  square: "md:col-span-2 lg:col-span-4",
} as const;

const RATIO = {
  wide: "aspect-[3/2]",
  tall: "aspect-[3/4] lg:aspect-auto lg:min-h-0 lg:flex-1",
  square: "aspect-square",
} as const;

export function LookBook() {
  return (
    <section
      id="look-book"
      aria-label="Look book"
      className="w-full scroll-mt-28 bg-bone px-6 pt-20 pb-16 md:px-8 md:pt-22 md:pb-18 lg:px-12 lg:pt-28 lg:pb-24"
    >
      <div className="shell">
        <header data-reveal className="flex flex-col gap-6">
          <Eyebrow>{lookbookIntro.eyebrow}</Eyebrow>
          <h2 className="text-heading-lg max-w-[640px] font-display font-medium wide:max-w-[640px] xl:max-w-[70%]">
            {lookbookIntro.heading}
          </h2>
        </header>

        <div data-reveal className="mt-8 flex justify-start md:justify-end">
          <p className="text-body-lg max-w-none text-left text-ink-muted md:max-w-[70%] md:text-right lg:max-w-[60%] wide:max-w-[40%]">
            {lookbookIntro.description}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12">
          {lookbook.map((album, i) => (
            <article
              key={album.title}
              data-reveal
              style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
              className={`group flex flex-col ${SPAN[album.shape]} ${
                i === 3 ? "md:hidden lg:flex" : ""
              }`}
            >
              <div className={`relative w-full overflow-hidden ${RATIO[album.shape]}`}>
                <Image
                  src={album.cover}
                  alt={album.alt}
                  fill
                  sizes={
                    album.shape === "wide"
                      ? "(max-width: 1024px) 100vw, 66vw"
                      : album.shape === "tall"
                        ? "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        : "(max-width: 768px) 100vw, 33vw"
                  }
                  className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex items-start justify-between gap-3 px-2 pt-3.5 text-[9px] leading-[1.4] font-medium tracking-[0.14em] text-ink-subtle uppercase md:text-[10px] md:tracking-[0.16em] lg:pt-4 wide:tracking-[0.18em]">
                <h3 className="shrink-0 whitespace-nowrap">{album.title}</h3>
                {"meta" in album && album.meta ? (
                  <p className="whitespace-nowrap text-right">{album.meta}</p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
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
        {/* El cierre hace eco del hero a propósito: la página abre con
            "You know how it should feel" y cierra pidiendo justo eso.
            El mismo CTA en los dos extremos, y el "no obligation" para
            quitarle peso al último clic. */}
        <Eyebrow>Let’s Begin</Eyebrow>
        <h2 className="text-display-lg max-w-[16ch] font-display font-medium">
          Tell us how you want it to feel.
        </h2>
        <p className="text-body-lg max-w-[46ch] text-ink-subtle">
          A complimentary hour together, and no obligation after it.
        </p>
        <ButtonPrimary href="/inquire" className="w-full md:w-auto">
          Start With a Conversation
        </ButtonPrimary>
      </div>
    </section>
  );
}

/* ── Footer ───────────────────────────────────────────────────── */
export function SiteFooter() {
  const footerNav = [
    { label: "Home", href: "/" },
    { label: "Look Book", href: "/#look-book" },
    { label: "Luxury Picnics", href: "/#luxury-picnics" },
    { label: "Silk Florals", href: "/#silk-florals" },
    { label: "Process", href: "/#process" },
    { label: "Inquire", href: "/inquire" },
  ];

  return (
    <footer className="gutter bg-ink pt-11 pb-7 text-bone md:pt-14 lg:pt-18 lg:pb-10">
      <div className="shell flex flex-col gap-6 md:gap-9 lg:gap-12">
        <div className="flex flex-col gap-6 md:flex-row md:flex-wrap md:items-start md:justify-between md:gap-10">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-start">
              <Wordmark tone="light" className="h-[80px]" />
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
          {/* Se retiró "Intentional Design · Elevated Experience": dos
              abstracciones que no decían nada, y el tagline real ya vive
              arriba en este mismo footer. */}
          <span>© 2026 {site.legalName}</span>
          <span>{site.location}</span>
        </div>
      </div>
    </footer>
  );
}
