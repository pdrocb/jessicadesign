import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Karla } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getSiteSettings } from "@/cms/settings/repository";
import { phoneHref } from "@/cms/settings/config";
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

export const viewport: Viewport = {
  // El marfil de --color-paper, no blanco puro: el sistema no lleva
  // blanco puro en ninguna parte (DESIGN.md §Colors), y la barra del
  // navegador móvil es superficie del sitio como cualquier otra.
  themeColor: "#fefbf6",
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    metadataBase: new URL(settings.siteUrl),
    applicationName: settings.siteName,
    icons: { icon: settings.faviconUrl },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

const lookbookDirectionContract = `<!--
THESIS: A continuous editorial portfolio lets each celebration unfold at photographic scale; it refuses the default card grid and project-detail funnel.
OWN-WORLD: Warm paper and bone, ink hairlines, Cormorant display type, Karla metadata, square controls, no shadows or ornamental chrome.
STORY: Visitors scan the range, enter one project in sequence, inspect every photograph fullscreen, then move toward inquiry with confidence in Jessica's eye.
FIRST VIEWPORT: A fixed brand header precedes a wide Look Book title, a concise promise, a hairline, and the first horizontal project cover entering below.
FORM: Ordered aspect-led chapter sequence with compact contact-sheet rows; position 6 of the grounded list; seed key e35e2af9.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings.siteName,
    legalName: "J|S Events, Event Styling & Decorating Co. LLC",
    description: settings.metaDescription,
    url: settings.siteUrl,
    telephone: phoneHref(settings.phone).replace("tel:", "") || undefined,
    email: settings.publicEmail || undefined,
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
    sameAs: [settings.instagram, settings.facebook].filter(Boolean),
  };

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
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <SpeedInsights />
      </body>
    </html>
  );
}
