import type { Metadata } from "next";
import { LookBookExperience } from "@/components/LookBookExperience";
import { RevealObserver } from "@/components/RevealObserver";
import { SiteHeader } from "@/components/SiteHeader";
import { Cta, SiteFooter } from "@/components/sections";
import { getCmsProjects } from "@/cms/projects/repository";
import { getSiteSettings } from "@/cms/settings/repository";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const description =
    "Explore weddings, dinner receptions, and styled celebrations designed by Jessica S. Designs across the Hudson Valley, New York City, and beyond.";
  return {
    title: `Look Book | ${settings.siteName}`,
    description,
    alternates: { canonical: "/look-book" },
    openGraph: {
      title: `The Look Book | ${settings.siteName}`,
      description:
        "A collection of weddings and celebrations designed down to every detail.",
      url: "/look-book",
      images: settings.ogImageUrl
        ? [{ url: settings.ogImageUrl, width: 1200, height: 630, alt: settings.ogImageAlt }]
        : undefined,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function LookBookPage() {
  const [{ projects: allProjects }, settings] = await Promise.all([
    getCmsProjects(),
    getSiteSettings(),
  ]);
  const projects = allProjects.filter((project) => project.published);

  return (
    <>
      <RevealObserver />
      <SiteHeader settings={settings} />
      <main className="pt-20 md:pt-22 lg:pt-24">
        <LookBookExperience projects={projects} />
        <Cta />
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
