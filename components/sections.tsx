import Image from "next/image";
import Link from "next/link";
import {
  founderStory,
  images,
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
import { FounderStoryDialog } from "@/components/FounderStoryDialog";
import type { HomeDocument } from "@/cms/content/home";
import type { HomeLookbookProject } from "@/lib/lookbook";
import { homeTestimonials, homeText } from "@/cms/content/model";
import { phoneHref, type SiteSettingsDocument } from "@/cms/settings/config";

type EditableSectionProps = { content?: HomeDocument };

function editable(content: HomeDocument | undefined, key: string, fallback: string) {
  return homeText(content, key, fallback);
}

function EmphasizedEnding({ children }: { children: string }) {
  const match = children.trim().match(/^(.*?)([^\s]+?)([.!?]*)$/);
  if (!match) return children;

  const [, opening, finalWord, punctuation] = match;
  return (
    <>
      {opening}
      <em className="font-normal">{finalWord}</em>
      {punctuation}
    </>
  );
}

/* ── Hero ──────────────────────────────────────────────────────────
   La geometría replica a Florale: apilado hasta 1439px y split 1:1 desde
   1440px. La identidad no se replica: tipografía, color, botones, copy y
   pie de foto siguen perteneciendo al sistema de Jessica. */
export function Hero({ content }: EditableSectionProps = {}) {
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
            {editable(content, "hero.eyebrow", site.tagline)}
          </p>

          <h1 className="text-display-hero max-w-none font-display font-medium leading-[1.1] tracking-[0.005em] text-ink md:max-w-[15ch] md:leading-[1.04] md:tracking-normal">
            <span className="block">{editable(content, "hero.lead", "You know how")}</span>
            <span className="block md:inline wide:block">
              <EmphasizedEnding>{editable(content, "hero.feeling", "it should feel.")}</EmphasizedEnding>
            </span>{" "}
            <span className="block md:inline wide:block">{editable(content, "hero.tail", "We design the rest.")}</span>
          </h1>

          <p className="text-body-lg mt-1 max-w-[44ch] text-ink-muted md:mt-0">
            {editable(content, "hero.intro", "Boutique wedding design & styling for thoughtfully created celebrations in the Hudson Valley, NYC, and CT.")}
          </p>

          <div className="mt-1 flex items-center gap-9">
            <div id="hero-primary-cta" className="w-full md:w-auto">
              <ButtonPrimary href="/inquire" className="w-full md:w-auto">
                {editable(content, "hero.primaryLabel", "Start With a Conversation")}
              </ButtonPrimary>
            </div>
            <div className="hidden md:block">
              <LinkUnderline href="/look-book" className="!self-center">
                {editable(content, "hero.secondaryLabel", "See the Work")}
              </LinkUnderline>
            </div>
          </div>
        </div>

        <figure className="m-0 flex flex-col gap-3">
          <div className="relative -mx-(--gutter) aspect-square w-[calc(100%_+_var(--gutter)_*_2)] max-w-none md:mx-0 md:aspect-[16/10] md:w-full wide:aspect-square">
            <Image
              src={editable(content, "hero.image", images.heroTapers.src)}
              alt={editable(content, "hero.imageAlt", "Long garden table set with white hydrangeas, taper candles and gold vessels at golden hour")}
              sizes="(min-width: 1440px) 50vw, 100vw"
              loading="eager"
              fetchPriority="high"
              fill
              className="object-cover"
            />
          </div>
          <figcaption className="text-label-sm text-center font-medium tracking-[0.28em] text-ink-subtle uppercase md:text-left">
            {editable(content, "hero.caption", "Terrace welcome dinner · Hudson Valley, NY")}
          </figcaption>
          <div className="flex justify-center md:hidden">
            <LinkUnderline href="/look-book" className="!self-center">
              {editable(content, "hero.secondaryLabel", "See the Work")}
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
export function Manifesto({ content }: EditableSectionProps = {}) {
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
          <Eyebrow>{editable(content, "philosophy.eyebrow", "Our Philosophy")}</Eyebrow>
          <p className="text-quote-xl max-w-[22ch] font-display font-normal">
            {editable(content, "philosophy.heading", "An unforgettable celebration is designed to be")}{" "}
            <em>{editable(content, "philosophy.emphasis", "felt.")}</em>
          </p>
        </div>

        <div
          data-reveal
          className="text-body-lg flex flex-col gap-5 text-ink-muted md:col-span-7 md:col-start-6 lg:col-span-5 lg:col-start-5 lg:max-w-[520px]"
        >
          <p>
            {editable(content, "philosophy.paragraphOne", "We shape how your celebration looks, feels, and comes together. From tablescapes and candlelight to florals, stationery, signage, furniture, and the smallest finishing details, every element is thoughtfully considered.")}
          </p>
          <p>
            {editable(content, "philosophy.paragraphTwo", "We look at the celebration as a whole, making sure each piece works together to create a space that feels cohesive, intentional, and distinctly yours.")}
          </p>
        </div>

        <Image
          src={editable(content, "philosophy.primaryImage", images.philosophyOutdoorBarn.src)}
          alt={editable(content, "philosophy.primaryImageAlt", "Outdoor reception table set beside a white barn")}
          width={1600}
          height={2000}
          sizes="(min-width: 1200px) 25vw, (min-width: 768px) 33vw, 100vw"
          className="aspect-[4/3] w-full object-cover md:col-span-4 md:col-start-1 md:row-start-2 md:aspect-[3/4] lg:col-span-3 lg:row-start-1 lg:row-end-3 lg:mt-20"
        />

        <Image
          src={editable(content, "philosophy.secondaryImage", images.philosophyOutdoorTablescape.src)}
          alt={editable(content, "philosophy.secondaryImageAlt", "Sunlit outdoor reception table with soft florals and taper candles")}
          width={1600}
          height={2000}
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
export function Services({ content }: EditableSectionProps = {}) {
  const editableServices = services.map((service, index) => ({
    ...service,
    name: editable(content, `expertise.items.${index + 1}.title`, service.name),
    copy: editable(content, `expertise.items.${index + 1}.paragraph`, service.copy),
    image: editable(content, `expertise.items.${index + 1}.image`, service.img.src),
    imageAlt: editable(content, `expertise.items.${index + 1}.imageAlt`, service.name),
  }));

  return (
    <section
      id="expertise"
      aria-label="Expertise"
      className="gutter section-y shell scroll-mt-28 border-t border-line"
    >
      <div data-reveal className="mb-8 md:mb-12 lg:mb-14">
        <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
          <h2 className="text-heading-lg font-display font-medium">{editable(content, "expertise.heading", "Expertise")}</h2>
          <div className="text-label-sm font-medium tracking-[0.3em] text-ink-subtle uppercase md:text-label">
            {editable(content, "expertise.meta", "Design · Styling · Execution")}
          </div>
        </div>
        <p className="text-body-lg mt-6 max-w-[42ch] text-ink-muted md:mt-8 md:ml-auto md:text-right">
          {editable(content, "expertise.intro", "Four ways to bring a clear, cohesive design vision to life.")}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-7">
        {editableServices.map((svc, i) => (
          <article
            key={svc.slug}
            id={svc.slug}
            data-reveal
            // Escalonado de 80ms entre tarjetas (DESIGN.md §Motion).
            style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
            className="group flex scroll-mt-28 flex-col gap-3"
          >
            <div className="mb-1 overflow-hidden lg:mb-2">
              <Image
                src={svc.image}
                alt={svc.imageAlt}
                width={1600}
                height={2000}
                sizes="(min-width: 1536px) 339px, (min-width: 1200px) calc((100vw - 180px) / 4), (min-width: 1024px) calc((100vw - 148px) / 4), (min-width: 768px) calc((100vw - 96px) / 2), calc(100vw - 40px)"
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
export function Process({ content }: EditableSectionProps = {}) {
  const editableSteps = process.steps.map((step, index) => ({
    ...step,
    name: editable(content, `process.steps.${index + 1}.title`, step.name),
    copy: editable(content, `process.steps.${index + 1}.paragraph`, step.copy),
  }));

  return (
    <section
      id="process"
      aria-label="Our design process"
      className="gutter section-y scroll-mt-28 border-t border-line bg-paper lg:py-24"
    >
      <div className="shell">
        <div data-reveal className="flex flex-col gap-4 md:max-w-[62ch] md:gap-5">
          <Eyebrow>{editable(content, "process.eyebrow", process.eyebrow)}</Eyebrow>
          <h2 className="text-heading-lg font-display font-medium">
            {editable(content, "process.heading", process.heading)}
          </h2>
          <p className="text-body-lg text-ink-muted">
            {editable(content, "process.intro", process.intro)}
          </p>
        </div>

        <ol className="mt-9 grid grid-cols-1 gap-px border-t border-line-warm md:mt-12 md:grid-cols-2 lg:grid-cols-3">
          {editableSteps.map((step, i) => (
            <li
              key={step.numeral}
              data-reveal
              style={{ "--reveal-delay": `${(i % 3) * 80}ms` } as React.CSSProperties}
              className="flex flex-col gap-2.5 border-b border-line-warm py-6 pr-0 md:py-8 md:pr-10"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-display text-[13px] text-ink-subtle md:text-[14px]">
                  {step.numeral}
                </span>
                {i === 4 && (
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
export function SilkFlorals({ content }: EditableSectionProps = {}) {
  return (
    <section
      id="silk-florals"
      aria-label="Silk florals"
      className="gutter section-y scroll-mt-28 border-t border-line bg-bone lg:py-30"
    >
      <div className="shell grid items-start gap-8 md:grid-cols-[1fr_0.8fr] md:gap-12 lg:grid-cols-[1fr_0.7fr_0.7fr] lg:gap-16">
        <div data-reveal className="flex flex-col gap-5 md:self-center md:gap-6 lg:gap-7">
          <Eyebrow>{editable(content, "silk.eyebrow", silkFlorals.eyebrow)}</Eyebrow>
          <p className="text-quote-xl font-display font-normal lg:max-w-[16ch]">
            {editable(content, "silk.statement", silkFlorals.statement)}
          </p>
          <p className="text-body-lg max-w-[52ch] text-ink-muted">
            {editable(content, "silk.copy", silkFlorals.copy)}
          </p>
          <div className="mt-1">
            <ButtonPrimary href="/inquire" className="w-full md:w-auto">
              {editable(content, "silk.ctaLabel", "Start With a Conversation")}
            </ButtonPrimary>
          </div>
        </div>

        <Image
          src={editable(content, "silk.primaryImage", images.silkFloralsBlueCentrepiece.src)}
          alt={editable(content, "silk.primaryImageAlt", "Blue and white silk floral centrepiece in a brass compote on a reception table")}
          width={1600}
          height={2000}
          sizes="(min-width: 1200px) 26vw, (min-width: 768px) 36vw, 100vw"
          data-reveal
          className="aspect-[4/5] w-full object-cover md:aspect-[3/4]"
        />

        {/* La segunda foto aparece solo en desktop y baja 80px: el
            escalonado es lo que distingue esta banda de un split. */}
        <Image
          src={editable(content, "silk.secondaryImage", images.silkFloralsReceptionCentrepiece.src)}
          alt={editable(content, "silk.secondaryImageAlt", "Tall blue and white silk floral centrepiece above a candlelit reception table")}
          width={1600}
          height={2000}
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
export function About({ content }: EditableSectionProps = {}) {
  const story = {
    heading: editable(content, "founder.story.heading", founderStory.heading),
    introduction: editable(content, "founder.story.introduction", founderStory.introduction),
    paragraphs: [
      editable(content, "founder.story.paragraphOne", founderStory.paragraphs[0]),
      editable(content, "founder.story.paragraphTwo", founderStory.paragraphs[1]),
    ],
  };

  return (
    <section
      id="about"
      aria-label="About Jessica Salomon"
      className="gutter section-y scroll-mt-28 bg-paper lg:py-30"
    >
      <div className="shell grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-x-10 lg:gap-x-16">
        <p className="text-heading-lg font-display font-medium md:hidden">
          About Jessica
        </p>
        <Image
          src={editable(content, "founder.primaryImage", images.jessica.src)}
          alt={editable(content, "founder.primaryImageAlt", "Jessica Salomon, founder and creative director")}
          width={1600}
          height={2000}
          sizes="(min-width: 1200px) 42vw, (min-width: 768px) 42vw, 100vw"
          className="w-full object-cover md:col-span-5"
        />
        <div
          data-reveal
          className="flex flex-col gap-5 md:col-span-7 md:mt-14 lg:col-span-6 lg:col-start-7 lg:mt-24 lg:gap-6"
        >
          <Eyebrow>{editable(content, "founder.eyebrow", "Founder & Creative Director")}</Eyebrow>
          <h2 className="text-display-md font-display font-medium">
            {editable(content, "founder.name", "Jessica Salomon")}
          </h2>
          {/* Tope de medida: con el rail a 1536 esta columna llega a ~76ch,
              por encima del límite cómodo de lectura. */}
          <p className="text-body-lg max-w-[66ch] text-ink-muted">
            {editable(content, "founder.bio", "With a background in wedding and event planning, I bring years of experience and a deep understanding of how celebrations come together. Over time, I found myself drawn most to the creative side—the details, the atmosphere, and the way thoughtful design can completely transform a space. That led me to step away from planning and focus exclusively on wedding design and styling, creating celebrations that feel intentional, personal, and beautifully considered.")}
          </p>
          <FounderStoryDialog
            image={editable(content, "founder.story.image", images.jessicaFounderStory.src)}
            imageAlt={editable(content, "founder.story.imageAlt", "Portrait of Jessica Salomon")}
            triggerLabel={editable(content, "founder.triggerLabel", "Meet Jessica")}
            ctaLabel={editable(content, "founder.story.ctaLabel", "Start With a Conversation")}
            story={story}
          />
        </div>
      </div>
    </section>
  );
}

/* ── Testimonios ──────────────────────────────────────────────────
   Todas las resoluciones usan un rail infinito nativo: admite una colección
   creciente y voces extensas sin convertir la lectura en autoplay. */
export function Testimonials({ content }: EditableSectionProps = {}) {
  const editableQuotes = homeTestimonials(
    content,
    quotes.map((quote, index) => ({
      id: `testimonial-${index + 1}`,
      text: quote.text,
      who: quote.who,
    })),
  );

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
            {editable(content, "testimonials.eyebrow", "Kind Words")}
          </div>
          <h2 className="text-display-md font-display font-normal">
            {editable(content, "testimonials.lead", "In their")}{" "}
            <em className="text-rose-umber">{editable(content, "testimonials.emphasis", "own")}</em>{" "}
            {editable(content, "testimonials.tail", "words")}
          </h2>
        </header>

        <div className="mt-8 md:mt-10 lg:mt-12">
          <TestimonialRail items={editableQuotes} label="Client testimonials" />
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
  portraitPair: "md:col-span-3 lg:col-span-6",
  square: "md:col-span-2 lg:col-span-4",
} as const;

const RATIO = {
  wide: "aspect-[3/2]",
  tall: "aspect-[3/4] lg:aspect-auto lg:min-h-0 lg:flex-1",
  portraitPair: "aspect-[5/4] md:aspect-[3/4] lg:aspect-[5/4]",
  square: "aspect-square",
} as const;

const LOOKBOOK_IMAGE_SIZES = {
  wide: "(min-width: 1632px) 1013px, (min-width: 1024px) calc((100vw - 112px) * 2 / 3), (min-width: 768px) calc(100vw - 64px), calc(100vw - 48px)",
  tall: "(min-width: 1632px) 507px, (min-width: 1024px) calc((100vw - 112px) / 3), (min-width: 768px) calc((100vw - 80px) / 2), calc(100vw - 48px)",
  portraitPair: "(min-width: 1632px) 760px, (min-width: 1024px) calc((100vw - 112px) / 2), (min-width: 768px) calc((100vw - 80px) / 2), calc(100vw - 48px)",
  square:
    "(min-width: 1632px) 507px, (min-width: 1024px) calc((100vw - 112px) / 3), (min-width: 768px) calc((100vw - 96px) / 3), calc(100vw - 48px)",
} as const;

const HOME_LOOKBOOK_SHAPES = [
  "wide",
  "tall",
  "portraitPair",
  "portraitPair",
  "square",
  "square",
  "square",
] as const;

export function LookBook({ projects }: { projects: readonly HomeLookbookProject[] }) {
  if (!projects.length) return null;

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
          {projects.map((project, i) => {
            const shape = HOME_LOOKBOOK_SHAPES[i];
            const place = project.location || project.venue || "";
            const objectPosition = project.cover.focalPoint
              ? `${project.cover.focalPoint.x * 100}% ${project.cover.focalPoint.y * 100}%`
              : "50% 50%";

            return (
              <article
                key={project.id}
                data-reveal
                style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
                className={`group flex flex-col ${SPAN[shape]}`}
              >
                <Link
                  href={`/look-book#${project.slug}`}
                  className="flex h-full flex-col"
                >
                  <div className={`relative w-full overflow-hidden ${RATIO[shape]}`}>
                    <Image
                      src={project.cover.src}
                      alt={project.cover.alt}
                      fill
                      sizes={LOOKBOOK_IMAGE_SIZES[shape]}
                      style={{ objectPosition }}
                      className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex items-start justify-between gap-3 px-2 pt-3.5 text-[9px] leading-[1.4] font-medium tracking-[0.14em] text-ink-subtle uppercase md:text-[10px] md:tracking-[0.16em] lg:pt-4 wide:tracking-[0.18em]">
                    <h3 className="min-w-0 max-w-[56%] truncate">{project.title}</h3>
                    {place ? (
                      <p className="min-w-0 max-w-[44%] truncate text-right">{place}</p>
                    ) : null}
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        <div data-reveal className="mt-10 flex justify-center md:mt-14">
          <LinkUnderline href="/look-book">View the full Look Book</LinkUnderline>
        </div>
      </div>
    </section>
  );
}

/* ── CTA ──────────────────────────────────────────────────────── */
export function Cta({ content }: EditableSectionProps = {}) {
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
        <Eyebrow>{editable(content, "cta.eyebrow", "Let’s Begin")}</Eyebrow>
        <h2 className="text-display-lg max-w-[16ch] font-display font-medium">
          {editable(content, "cta.heading", "Tell us how you want it to feel.")}
        </h2>
        <p className="text-body-lg max-w-[46ch] text-ink-subtle">
          {editable(content, "cta.copy", "A complimentary hour together, and no obligation after it.")}
        </p>
        <ButtonPrimary href="/inquire" className="w-full md:w-auto">
          {editable(content, "cta.label", "Start With a Conversation")}
        </ButtonPrimary>
      </div>
    </section>
  );
}

/* ── Footer ───────────────────────────────────────────────────── */
export function SiteFooter({ settings }: { settings?: SiteSettingsDocument } = {}) {
  const contactPhone = settings?.phone || site.phone;
  const contactPhoneHref = settings ? phoneHref(settings.phone) : site.phoneHref;
  const instagram = settings?.instagram || site.instagram;
  const facebook = settings?.facebook || site.facebook;
  const footerNav = [
    { label: "Home", href: "/" },
    { label: "Look Book", href: "/look-book" },
    { label: "Expertise", href: "/#expertise" },
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
              href={contactPhoneHref}
              className="py-[15px] transition-colors duration-[180ms] hover:text-bone md:py-0"
            >
              Tel: {contactPhone}
            </a>
            {settings?.publicEmail ? (
              <a
                href={`mailto:${settings.publicEmail}`}
                className="py-[15px] transition-colors duration-[180ms] hover:text-bone md:py-0"
              >
                {settings.publicEmail}
              </a>
            ) : null}
            <div className="text-label-sm flex gap-4 font-medium tracking-[0.2em] uppercase md:mt-1.5 md:justify-end">
              <a
                href={instagram}
                target="_blank"
                rel="noreferrer"
                className="py-[15px] text-bone transition-colors duration-[180ms] hover:text-ink-faint md:py-0"
              >
                Instagram
              </a>
              <a
                href={facebook}
                target="_blank"
                rel="noreferrer"
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
