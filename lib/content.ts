/**
 * Contenido del sitio. El copy es real (handoff §6): servicios,
 * testimonios, FAQs y contacto vienen del negocio, no son placeholder.
 *
 * Las fotografías se descargaron del Wix vigente a `assets/` y se
 * importan estáticamente para que next/image conozca sus dimensiones y
 * genere AVIF/WebP en build. Sustituir por arte final cuando exista.
 */

import heroTablescape from "@/assets/hero-01-tablescape.jpg";
import heroReception from "@/assets/hero-02-reception.jpg";
import heroDetail from "@/assets/hero-03-detail.jpg";
import heroTerrace from "@/assets/hero-04-terrace.jpg";
import heroTapers from "@/assets/hero-05-tapers.jpg";
import jessica from "@/assets/jessica-salomon.jpg";
import lookbookDarbyOliver from "@/assets/lookbook-darby-oliver.webp";
import lookbookGoldenHour from "@/assets/lookbook-golden-hour.jpg";
import manifesto01 from "@/assets/philosophy-candlelit-tablescape.jpg";
import manifesto02 from "@/assets/manifesto-02.jpg";
import silkFloralsBlueCentrepiece from "@/assets/silk-florals-blue-centrepiece.webp";
import serviceCelebrations from "@/assets/service-celebrations.jpg";
import serviceDayOf from "@/assets/service-day-of.jpg";
import servicePicnics from "@/assets/service-picnics.jpg";
import serviceWeddings from "@/assets/service-weddings.jpg";

export const site = {
  // Nombre y tagline tomados del logotipo entregado por la clienta
  // (ago 2026), que cierra la decisión que PRODUCT.md tenía abierta.
  // `legalName` NO cambia: es la razón social de la LLC, otra cosa.
  name: "Jessica S. Designs",
  tagline: "Wedding & Event Design & Styling",
  location: "Hudson Valley, New York",
  phone: "845 · 375 · 7820",
  phoneHref: "tel:+18453757820",
  instagram: "https://www.instagram.com/jessicasalomondesigns__",
  facebook: "https://www.facebook.com/celebratewithJess",
  legalName: "J|S Events, Event Styling & Decorating Co. LLC",
};

/**
 * Los anclas van con `/` delante a propósito: el nav vive también en
 * `/inquire`, y un `#look-book` suelto ahí no lleva a ninguna parte.
 *
 * No hay "Blog": el enlace existía apuntando a `#` y no llevaba a
 * ninguna parte. Vuelve cuando haya blog.
 */
export const navItems = [
  { label: "Home", href: "/" },
  { label: "Look Book", href: "/#look-book" },
  { label: "Luxury Picnics", href: "/#luxury-picnics" },
  { label: "Process", href: "/#process" },
];

export const images = {
  heroTablescape,
  heroReception,
  heroDetail,
  heroTerrace,
  heroTapers,
  manifesto01,
  manifesto02,
  silkFloralsBlueCentrepiece,
  jessica,
  serviceWeddings,
};

export const founderStory = {
  heading:
    "Weddings with intention, personality & beautifully considered details.",
  introduction:
    "Jessica S. Designs is a boutique wedding design and styling studio led by founder and lead designer Jessica Salomon.",
  paragraphs: [
    "With a background in wedding and event planning, I understand how every element of a celebration works together. But it was always the creative side that drew me in most—the details, the atmosphere, and the transformation of a space. Today, I focus exclusively on wedding design and styling, creating celebrations that feel personal, intentional, and distinctly yours.",
    "From the first design concept to the final styling on wedding day, I work closely with my couples to shape the visual story of their celebration—bringing together tablescapes, florals, candlelight, signage, stationery, décor, and all the thoughtful details that make a space feel complete.",
  ],
} as const;

/** `slug` es el ancla de cada servicio: el nav enlaza a la tarjeta, no
 *  a la sección entera, para que la etiqueta cumpla lo que promete. */
export const services = [
  {
    numeral: "No. I",
    slug: "weddings",
    name: "Weddings",
    img: serviceWeddings,
    copy: "Full design and styling, from the first concept through the reveal on the day.",
  },
  {
    numeral: "No. II",
    slug: "celebrations",
    name: "Celebrations",
    img: serviceCelebrations,
    copy: "Micro weddings, birthday dinner parties, bridal and baby showers, designed with the same care as a wedding.",
  },
  {
    numeral: "No. III",
    slug: "luxury-picnics",
    name: "Luxury Picnics",
    img: servicePicnics,
    copy: "Open-air celebrations, styled to the last napkin and glass.",
  },
  {
    numeral: "No. IV",
    slug: "day-of-set-up",
    name: "Day-Of Set-Up",
    img: serviceDayOf,
    copy: "You have the vision and the décor—we bring it all together. Our team handles the set-up and styling on site, making sure every detail is placed just as you envisioned.",
  },
];

/**
 * Silk florals: línea en crecimiento (PRODUCT.md, ago 2026). Los tres
 * mensajes van en un solo párrafo — alternativa a la fresca, rental al
 * cliente, y diseño híbrido.
 *
 * El matiz de posicionamiento (la fresca sigue siendo del florista del
 * cliente; la seda sí es suya) NO va aquí: sonaría defensivo. Vive en la
 * FAQ "Can you do the florals?", que es donde de verdad se pregunta.
 */
export const silkFlorals = {
  eyebrow: "Silk Florals",
  statement: "Real enough to lean in and check.",
  copy: "Beautiful blooms, designed to last. Our elevated silk florals offer the look and feel of fresh flowers, thoughtfully arranged and styled to complement your celebration. Available to rent. Inquire to learn more.",
};

/**
 * Proceso de diseño confirmado por la clienta (PRODUCT.md, ago 2026).
 * El mock-up presencial es la prueba diferenciadora: casi ningún
 * competidor lo ofrece — no diluirlo entre los demás pasos.
 */
export const process = {
  eyebrow: "The Process",
  heading: "How a room becomes yours.",
  intro:
    "Six steps, from the first conversation to the last candle lit. You see the room for yourself before the day arrives.",
  steps: [
    {
      numeral: "No. I",
      name: "The Concept",
      copy: "We begin with your story, your inspiration, and the feeling you want your guests to experience.",
    },
    {
      numeral: "No. II",
      name: "Your Design Deck",
      copy: "A custom design presentation featuring your color palette, textures, tablescapes, floral direction, stationery, signage, and styling details, allowing you to see your celebration long before it comes to life.",
    },
    {
      numeral: "No. III",
      name: "Sourcing",
      copy: "We thoughtfully curate each design element from candles and tabletop details to furniture, florals (fresh or silk), and décor, bringing it all together into one cohesive vision.",
    },
    {
      numeral: "No. IV",
      name: "Floor Plans",
      copy: "When the design calls for it, we map the space, how guests move through it, where focal points unfold, and how the room feels from every angle.",
    },
    {
      numeral: "No. V",
      name: "The Mock-Up",
      copy: "We build your tablescape in person before the wedding or celebration day, giving you the chance to see it, experience it, and refine every detail before anything is finalized.",
    },
    {
      numeral: "No. VI",
      name: "Styling the Day",
      copy: "We personally style every design element on site, placing each candle, bloom, and finishing touch with intention, so the room your guests walk into is exactly the room you envisioned.",
    },
  ],
} as const;

export const quotes = [
  {
    text: "Truly more beautiful than I could have ever imagined. She is patient, responsive, and has great design ideas — I would work with Jess again in a heartbeat.",
    who: "Brittney A. · Summer Wedding",
  },
  {
    text: "My wedding was perfect and envisioned exactly the way I wanted. Jessica is very personable and I loved working with her.",
    who: "Yvette A. · Summer Wedding",
  },
  {
    text: "She thought of every last detail, from the flower arrangement to the napkins and glassware — and she nailed it.",
    who: "Emily G. · Engagement, Beacon NY",
  },
];

/**
 * Álbumes del Look Book. Cada uno tendrá varias fotos y una portada;
 * por ahora solo existe `cover` y el título — el campo se llama así, y
 * no `img`, para que el modelo ya sea el correcto cuando lleguen las
 * galerías.
 *
 * PENDIENTE DE LA CLIENTA: los títulos describen lo que se ve en cada
 * foto. Los nombres reales de álbum (pareja, venue, temporada) los tiene
 * que dar ella — no se inventan.
 *
 * OJO con los nombres de archivo: vienen del Wix y NO describen su
 * contenido. `hero-01-tablescape` es una pareja en blanco y negro, y las
 * dos `manifesto-*` son bodegones de papelería. Fiarse de la imagen, no
 * del nombre.
 */
/**
 * `shape` arma el mosaico de Florale: `wide` ocupa 8 de 12 columnas en
 * 3/2, `tall` ocupa 4 en 3/4 y `square` ocupa 4 en 1/1.
 *
 * El reparto NO es estético, es de recorte: las cuatro fotos originales
 * son verticales (1000×1333 y 1200×1800), así que las celdas anchas se
 * las quedan los bodegones —un flat lay aguanta que le corten alto— y
 * las verticales se quedan con la pareja y el barril, cuyos sujetos se
 * decapitarían en un 3/2.
 */
/**
 * El orden ES la composición: fila ancha, fila ancha espejeada y tres
 * cuadrados al final. En tablet se oculta la segunda ancha, exactamente
 * como en la referencia; mobile muestra las siete piezas.
 *
 * Los tres cuadrados son PROVISIONALES: se repiten de la sección
 * Expertise porque solo hay 10 fotos para 12 huecos. Se cambian en
 * cuanto lleguen las de la clienta.
 */
export const lookbookIntro = {
  eyebrow: "The Look Book · Recent selection",
  heading: "A selection of celebrations, designed down to every detail.",
  description:
    "Recent weddings, private dinners, and styled gatherings across the Hudson Valley and beyond.",
} as const;

export const lookbook = [
  { cover: heroTerrace, shape: "wide", title: "Wedding dinner party", meta: "Hopewell Junction, NY", alt: "Two grooms beside a long terrace table set with white florals, taper candles and a welcome sign" },
  { cover: heroTablescape, shape: "tall", title: "Hudson Valley Wedding", meta: "Gardnier NY", alt: "Couple walking through tall grasses, in black and white" },

  { cover: heroDetail, shape: "portraitPair", title: "Waterfront Details", alt: "Floral-topped barrel on a riverside terrace" },
  { cover: lookbookDarbyOliver, shape: "portraitPair", title: "Darby & Oliver", meta: "Blackwalnut Farm, Saugerties NY", alt: "Bride in red sunglasses reading with a guest beside a sunlit window" },

  { cover: serviceDayOf, shape: "square", title: "Dinner reception", meta: "B Social Port Chester NY", alt: "Place setting with gold-rimmed charger and menu card against exposed brick" },
  { cover: lookbookGoldenHour, shape: "square", title: "Cori & Ezra", meta: "Blackwalnut Farm, Saugerties NY", alt: "Bud vases and taper candles down a gauze runner on a wooden table in late afternoon light" },
  { cover: servicePicnics, shape: "square", title: "Citrus Picnic", alt: "Low picnic table with lemon-print china, rattan chargers and cushions" },
] as const;

/**
 * Formulario de inquiry (`/inquire`). Los campos replican el formulario
 * vigente de jessicasalomondesigns.com/contact SIN el calendario de
 * auto-agendado: el horario se acuerda en la respuesta.
 *
 * `required: false` se marca en la UI con "(optional)" — se señala la
 * excepción, no la regla, para no llenar la página de asteriscos.
 */
export const inquiry = {
  eyebrow: "Inquire",
  heading: "Tell us about your celebration.",
  intro:
    "A few details to start. We reply personally, and the first conversation is a complimentary hour.",
  submit: "Send Your Inquiry",
  successHeading: "Thank you. Your inquiry is on its way.",
  successBody:
    "We read every one personally and reply within a few days to arrange your complimentary consultation.",
  fields: [
    { name: "name", label: "First & Last Name", type: "text", required: true, autoComplete: "name" },
    { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
    {
      name: "celebration",
      label: "Type of Celebration",
      type: "select",
      required: true,
      options: [
        "Wedding",
        "Celebration (birthday, shower, sweet sixteen, quinceañera, mitzvah)",
        "Luxury Picnic",
        "Day-Of Set-Up",
        "Something else",
      ],
    },
    { name: "phone", label: "Contact Number", type: "tel", required: true, autoComplete: "tel" },
    { name: "date", label: "Date of the Event", type: "date", required: false },
    { name: "venue", label: "Name & Location of Venue", type: "text", required: false },
    { name: "guests", label: "How Many Guests", type: "number", required: false },
    { name: "pinterest", label: "Pinterest Board", type: "url", required: false },
    { name: "vision", label: "Share Your Vision", type: "textarea", required: false },
  ],
} as const;

export const faqs = [
  {
    numeral: "i.",
    q: "How do you work with my wedding planner?",
    a: "Hand in hand. Your planner runs the logistics and the timeline; we design and style every visual moment. We collaborate closely with planners, florists, and venues so the day holds together from start to finish.",
  },
  {
    numeral: "ii.",
    q: "What if I don’t have a planner yet?",
    a: "No problem. We’ll connect you with trusted planners we love working with, and partner with them from day one so your design vision leads the way.",
  },
  {
    numeral: "iii.",
    q: "Can you do the florals?",
    a: "Fresh florals stay with your florist, and we design hand in hand with them. Silk is ours, a collection you can buy outright, rent for the day, or blend with fresh so the two read as one.",
  },
  {
    numeral: "iv.",
    q: "When should I book design & styling?",
    a: "Ideally 6–12 months before your date, so the design concept can inform your florals, rentals, and stationery. We have worked on shorter timelines too, so ask us.",
  },
  {
    numeral: "v.",
    q: "Do you travel outside the Hudson Valley?",
    a: "Home base is the Hudson Valley, New York, and yes, we love to travel. Tell us where you’re celebrating.",
  },
  {
    numeral: "vi.",
    q: "What does the complimentary consultation include?",
    a: "A one-hour conversation about the celebration you’re imagining. You’ll leave with a clear sense of direction, and no obligation to book.",
  },
];
