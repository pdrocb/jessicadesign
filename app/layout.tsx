import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Karla } from "next/font/google";
import "./globals.css";

// La pareja aprobada por la clienta se aloja localmente en el build por
// `next/font`: Cormorant lleva la voz editorial y Karla la lectura/UI.
const cormorant = Cormorant_Garamond({
  weight: "variable",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const karla = Karla({
  weight: "variable",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-karla",
  display: "swap",
});

const siteUrl = "https://jessicadesign.vercel.app";
const title = "Jessica S. Designs | Hudson Valley Wedding & Event Design";
// Descripción alineada con el copy del hero: nombra la categoría, la
// distinción diseñadora-no-planner, y los objetos concretos — que es lo
// que una novia reconoce al escanear resultados de Google.
const description =
  "Wedding and event design & styling in the Hudson Valley, New York. We design how your celebration looks and feels: tablescapes, linens, candles, florals, signage and stationery, composed as one idea.";

export const viewport: Viewport = {
  // El marfil de --color-paper, no blanco puro: el sistema no lleva
  // blanco puro en ninguna parte (DESIGN.md §Colors), y la barra del
  // navegador móvil es superficie del sitio como cualquier otra.
  themeColor: "#fefbf6",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Jessica S. Designs",
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Jessica S. Designs",
  legalName: "J|S Events, Event Styling & Decorating Co. LLC",
  description,
  telephone: "+1-845-375-7820",
  // Sin `priceRange`: no hay precios ni mínimos publicados y el sitio no
  // debe insinuar rangos (PRODUCT.md). "$$$" lo insinuaba en Google.
  address: {
    "@type": "PostalAddress",
    addressRegion: "NY",
    addressCountry: "US",
  },
  areaServed: [
    "Hudson Valley",
    "New York",
    "The Catskills",
    "Westchester",
    "Beacon",
  ],
  sameAs: [
    "https://instagram.com/js_eventsllc",
    "https://www.facebook.com/celebratewithJess",
  ],
};

const lookbookDirectionContract = `<!--
THESIS: A continuous editorial portfolio lets each celebration unfold at photographic scale; it refuses the default card grid and project-detail funnel.
OWN-WORLD: Warm paper and bone, ink hairlines, Cormorant display type, Karla metadata, square controls, no shadows or ornamental chrome.
STORY: Visitors scan the range, enter one project in sequence, inspect every photograph fullscreen, then move toward inquiry with confidence in Jessica's eye.
FIRST VIEWPORT: A fixed brand header precedes a wide Look Book title, a concise promise, a hairline, and the first horizontal project cover entering below.
FORM: Ordered aspect-led chapter sequence with compact contact-sheet rows; position 6 of the grounded list; seed key e35e2af9.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${karla.variable}`}>
      <body>
        <template
          data-impeccable-direction="lookbook"
          dangerouslySetInnerHTML={{ __html: lookbookDirectionContract }}
        />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
