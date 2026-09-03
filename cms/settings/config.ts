export type SiteSettingsDocument = {
  siteName: string;
  siteUrl: string;
  ogTitle: string;
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
  ogTitle: "Jessica S. Designs | Wedding & Event Design",
  ogImageUrl: "/site/open-graph.webp",
  ogImageAlt:
    "Outdoor wedding dinner table designed with white florals, taper candles and warm wooden chairs",
  faviconUrl: "/favicon.png",
  phone: "845 · 375 · 7820",
  publicEmail: "",
  instagram: "https://www.instagram.com/jessicasalomondesigns__",
  facebook: "https://www.facebook.com/celebratewithJess",
};

export const siteSettingsSections = [
  {
    id: "identity",
    title: "Site identity",
    description: "Name and canonical website address",
  },
  {
    id: "sharing",
    title: "Social sharing",
    description: "Global title and image shown when any page link is shared",
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
