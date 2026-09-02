import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/cms/settings/repository";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { siteUrl } = await getSiteSettings();
  const origin = siteUrl.replace(/\/$/, "");

  return [
    {
      url: origin,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${origin}/look-book`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${origin}/inquire`,
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];
}
