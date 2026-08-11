import type { Metadata, Viewport } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

// Helvetica Neue es de sistema — no se descarga nada para el cuerpo.
// Solo Playfair viaja por la red (handoff §2.1).
const playfair = Playfair_Display({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const siteUrl = "https://jsevents.vercel.app";
const title = "J|S Events | Hudson Valley Wedding & Event Design";
const description =
  "Wedding and event design + styling in the Hudson Valley, New York. We are the design layer of your celebration — every color, texture, and detail composed with intention.";

export const viewport: Viewport = {
  themeColor: "#ffffff",
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
    siteName: "J|S Events",
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "J|S Events",
  legalName: "J|S Events, Event Styling & Decorating Co. LLC",
  description,
  telephone: "+1-845-375-7820",
  priceRange: "$$$",
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
    <html lang="en" className={playfair.variable}>
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
