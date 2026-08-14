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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${karla.variable}`}>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
