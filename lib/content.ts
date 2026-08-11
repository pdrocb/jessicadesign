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
    copy: "Showers, sweet sixteens, quinceañeras, mitzvahs — every milestone, thoughtfully styled.",
  },
  {
    numeral: "No. III",
    name: "Luxury Picnics",
    img: servicePicnics,
    copy: "Curated open-air experiences, styled to the last napkin and glass.",
  },
  {
    numeral: "No. IV",
    name: "Day-Of Styling",
    img: serviceDayOf,
    copy: "Your vision, our hands — flawless setup and styling of every detail on the day.",
  },
];

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
