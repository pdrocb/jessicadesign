import type { Metadata } from "next";
import type { SiteSettingsDocument } from "@/cms/settings/config";

type PageSeo = {
  title: string;
  description: string;
  pathname: string;
};

function sharingImages(settings: SiteSettingsDocument) {
  return settings.ogImageUrl
    ? [{
        url: settings.ogImageUrl,
        width: 1200,
        height: 630,
        alt: settings.ogImageAlt,
      }]
    : undefined;
}

/**
 * Cada página aporta sus señales de búsqueda. Site Settings aporta una sola
 * identidad visual de compartido: título e imagen globales. La descripción de
 * Open Graph reutiliza la descripción de la página para conservar contexto.
 */
export function createPageMetadata(
  settings: SiteSettingsDocument,
  page: PageSeo,
): Metadata {
  const openGraphTitle = settings.ogTitle;
  const openGraphDescription = page.description;

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.pathname },
    openGraph: {
      title: openGraphTitle,
      description: openGraphDescription,
      url: page.pathname,
      siteName: settings.siteName,
      locale: "en_US",
      type: "website",
      images: sharingImages(settings),
    },
    twitter: {
      card: "summary_large_image",
      title: openGraphTitle,
      description: openGraphDescription,
      images: settings.ogImageUrl ? [settings.ogImageUrl] : undefined,
    },
  };
}
