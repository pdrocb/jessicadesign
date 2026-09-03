import type { Metadata } from "next";
import { LookBookExperience } from "@/components/LookBookExperience";
import { RevealObserver } from "@/components/RevealObserver";
import { SiteHeader } from "@/components/SiteHeader";
import { Cta, SiteFooter } from "@/components/sections";
import { getCmsProjects } from "@/cms/projects/repository";
import { getLookBookDocument } from "@/cms/content/look-book";
import { getSiteSettings } from "@/cms/settings/repository";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, document] = await Promise.all([
    getSiteSettings(),
    getLookBookDocument(),
  ]);
  return createPageMetadata(settings, {
    title: document.metaTitle,
    description: document.metaDescription,
    pathname: "/look-book",
  });
}

export const revalidate = 300;

export default async function LookBookPage() {
  const [{ projects: allProjects }, settings, document] = await Promise.all([
    getCmsProjects(),
    getSiteSettings(),
    getLookBookDocument(),
  ]);
  const projects = allProjects.filter((project) => project.published);

  return (
    <>
      <RevealObserver />
      <SiteHeader settings={settings} />
      <main className="pt-20 md:pt-22 lg:pt-24">
        <LookBookExperience
          projects={projects}
          heading={document.heading}
          introduction={document.introduction}
        />
        <Cta />
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
