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
import jessica from "@/assets/jessica-salomon.jpg";
import manifesto01 from "@/assets/manifesto-01.jpg";
import manifesto02 from "@/assets/manifesto-02.jpg";
import serviceCelebrations from "@/assets/service-celebrations.jpg";
import serviceDayOf from "@/assets/service-day-of.jpg";
import servicePicnics from "@/assets/service-picnics.jpg";
import serviceWeddings from "@/assets/service-weddings.jpg";

export const site = {
  name: "J|S Events",
  tagline: "Wedding & Event Design + Styling",
  location: "Hudson Valley, New York",
  phone: "845 · 375 · 7820",
  phoneHref: "tel:+18453757820",
  instagram: "https://instagram.com/js_eventsllc",
  facebook: "https://www.facebook.com/celebratewithJess",
  legalName: "J|S Events, Event Styling & Decorating Co. LLC",
};

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Look Book", href: "#look-book" },
  { label: "Luxury Picnics", href: "#expertise" },
  { label: "Blog", href: "#" },
];

export const images = {
  heroTablescape,
  heroReception,
  heroDetail,
  manifesto01,
  manifesto02,
  jessica,
};

export const services = [
  {
    numeral: "No. I",
    name: "Weddings",
    img: serviceWeddings,
    copy: "Full design & styling, from concept to reveal — the complete visual world of your wedding day.",
  },
  {
    numeral: "No. II",
    name: "Celebrations",
    img: serviceCelebrations,
    copy: "Birthdays, bridal and baby showers, sweet sixteens, quinceañeras, mitzvahs — every milestone, thoughtfully styled.",
  },
  {
    numeral: "No. III",
    name: "Luxury Picnics",
    img: servicePicnics,
    copy: "Curated open-air experiences, styled to the last napkin and glass.",
  },
  {
    numeral: "No. IV",
    name: "Day-Of Set-Up",
    img: serviceDayOf,
    copy: "Your vision, our hands — including the decor you made yourself. Our team sets up every detail on the day.",
  },
];

/**
 * Proceso de diseño confirmado por la clienta (PRODUCT.md, ago 2026).
 * El mock-up presencial es la prueba diferenciadora: casi ningún
 * competidor lo ofrece — no diluirlo entre los demás pasos.
 */
export const process = {
  eyebrow: "The Process",
  heading: "How a room becomes yours.",
  intro:
    "Design is the work, and the work has a shape. From the first conversation to the last candle lit, here is how we get there together.",
  steps: [
    {
      numeral: "No. I",
      name: "The Concept",
      copy: "We start with your story, your inspiration, and the feeling you want the day to hold — and shape it into a direction.",
    },
    {
      numeral: "No. II",
      name: "Your Design Deck",
      copy: "A custom deck: palette, textures, tablescapes, florals, stationery, signage. The whole world of the day, on paper.",
    },
    {
      numeral: "No. III",
      name: "Sourcing",
      copy: "Every piece selected and secured — linens, candles, china, furniture, florals fresh or silk. Nothing left to chance.",
    },
    {
      numeral: "No. IV",
      name: "Floor Plans",
      copy: "When the room calls for it, we map it: how the space flows, where the eye lands, how your guests move through the night.",
    },
    {
      numeral: "No. V",
      name: "The Mock-Up",
      copy: "We build a table in person, before the day. You see it, touch it, change your mind — while changing it still costs nothing.",
    },
    {
      numeral: "No. VI",
      name: "Styling the Day",
      copy: "We set every detail ourselves, on site, so the room your guests walk into is the one you were promised.",
    },
  ],
} as const;

export const quotes = [
  {
    text: "Truly more beautiful than I could have ever imagined. She is patient, responsive, and has great design ideas — I would work with Jess again in a heartbeat.",
    who: "Brittney A. — Summer Wedding",
  },
  {
    text: "My wedding was perfect and envisioned exactly the way I wanted. Jessica is very personable and I loved working with her.",
    who: "Yvette A. — Summer Wedding",
  },
  {
    text: "She thought of every last detail, from the flower arrangement to the napkins and glassware — and she nailed it.",
    who: "Emily G. — Engagement, Beacon NY",
  },
];

export const lookbook = [
  { img: manifesto01, alt: "Reception styling" },
  { img: manifesto02, alt: "Tablescape detail" },
  { img: heroTablescape, alt: "Luxury picnic" },
  { img: heroDetail, alt: "Ceremony design" },
];

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
    "A few details to start. We reply personally, and the first conversation is a complimentary hour — your story, your inspiration, and the feeling you want the day to hold.",
  submit: "Send Your Inquiry",
  successHeading: "Thank you — your inquiry is on its way.",
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
        "Celebration — birthday, shower, sweet sixteen, quinceañera, mitzvah",
        "Luxury Picnic",
        "Day-Of Set-Up",
        "Something else",
      ],
    },
    { name: "phone", label: "Contact Number", type: "tel", required: true, autoComplete: "tel" },
    { name: "date", label: "Date of the Event", type: "date", required: false },
    { name: "venue", label: "Name & Location of Venue", type: "text", required: false },
    { name: "guests", label: "How Many Guests", type: "number", required: false },
    { name: "pinterest", label: "Pinterest Board — share the link", type: "url", required: false },
    { name: "vision", label: "Share Your Vision", type: "textarea", required: false },
  ],
} as const;

export const faqs = [
  {
    numeral: "i.",
    q: "How do you work with my wedding planner?",
    a: "Hand in hand. Your planner runs the logistics and the timeline; we design and style every visual moment. We collaborate closely with planners, florists, and venues so the day looks — and feels — seamless.",
  },
  {
    numeral: "ii.",
    q: "What if I don’t have a planner yet?",
    a: "No problem. We’ll connect you with trusted planners we love working with, and partner with them from day one so your design vision leads the way.",
  },
  {
    numeral: "iii.",
    q: "When should I book design & styling?",
    a: "Ideally 6–12 months before your date, so the design concept can inform your florals, rentals, and stationery. That said, we’ve created magic on shorter timelines — reach out.",
  },
  {
    numeral: "iv.",
    q: "Do you travel outside the Hudson Valley?",
    a: "Home base is the Hudson Valley, New York — and yes, we love to travel. Tell us where you’re celebrating.",
  },
  {
    numeral: "v.",
    q: "What does the complimentary consultation include?",
    a: "A one-hour conversation about your story, your inspiration, and the feeling you want the day to hold. You’ll leave with a clear sense of direction — no strings attached.",
  },
];
