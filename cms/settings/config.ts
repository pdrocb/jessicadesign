export type SiteSettingsDocument = {
  siteName: string;
  siteUrl: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  ogImageAlt: string;
  faviconUrl: string;
  phone: string;
  publicEmail: string;
  instagram: string;
  facebook: string;
};

export const defaultSiteSettings: SiteSettingsDocument = {
  siteName: "Jessica S. Designs",
  siteUrl: "https://jessicadesign.vercel.app",
  metaTitle: "Jessica S. Designs | Hudson Valley Wedding & Event Design",
  metaDescription:
    "Wedding and event design & styling in the Hudson Valley, New York. We design how your celebration looks and feels: tablescapes, linens, candles, florals, signage and stationery, composed as one idea.",
  ogTitle: "Jessica S. Designs | Wedding & Event Design",
  ogDescription:
    "Boutique wedding design and styling for thoughtfully created celebrations in the Hudson Valley, NYC, and Connecticut.",
  ogImageUrl: "",
  ogImageAlt: "Jessica S. Designs wedding and event styling",
  faviconUrl: "/favicon.ico",
  phone: "845 · 375 · 7820",
  publicEmail: "",
  instagram: "https://www.instagram.com/jessicasalomondesigns__",
  facebook: "https://www.facebook.com/celebratewithJess",
};

export const siteSettingsSections = [
  {
    id: "seo",
    title: "SEO defaults",
    description: "Search titles, descriptions and canonical site identity",
  },
  {
    id: "sharing",
    title: "Social sharing",
    description: "Open Graph copy and the image shown when a link is shared",
  },
  {
    id: "browser",
    title: "Browser identity",
    description: "The small icon used in browser tabs and bookmarks",
  },
  {
    id: "contact",
    title: "Contact & social",
    description: "Global contact details used across the site",
  },
] as const;

export function phoneHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.length === 10 ? `1${digits}` : digits;
  return normalized ? `tel:+${normalized}` : "";
}
