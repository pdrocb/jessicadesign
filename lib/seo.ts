import type { Metadata } from "next";
import type { SiteSettingsDocument } from "@/cms/settings/config";

type PageSeo = {
  title: string;
  description: string;
  pathname: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
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
 * Mantiene las señales de búsqueda y de compartido sincronizadas por ruta.
 * La imagen y los valores por defecto pertenecen a Site Settings para que la
 * clienta pueda actualizarlos desde el CMS sin tocar el código.
 */
export function createPageMetadata(
  settings: SiteSettingsDocument,
  page: PageSeo,
): Metadata {
  const openGraphTitle = page.openGraphTitle ?? page.title;
  const openGraphDescription = page.openGraphDescription ?? page.description;

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
