import type { Metadata } from "next";
import { Faqs } from "@/components/Faqs";
import { RevealObserver } from "@/components/RevealObserver";
import { SiteHeader } from "@/components/SiteHeader";
import {
  About,
  Cta,
  Hero,
  LookBook,
  Manifesto,
  Process,
  Services,
  SilkFlorals,
  SiteFooter,
  Testimonials,
} from "@/components/sections";
import { getHomeDocument } from "@/cms/content/home";
import { getHomeLookbookProjects } from "@/cms/projects/repository";
import { getSiteSettings } from "@/cms/settings/repository";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return createPageMetadata(settings, {
    title: settings.metaTitle,
    description: settings.metaDescription,
    pathname: "/",
    openGraphTitle: settings.ogTitle || settings.metaTitle,
    openGraphDescription: settings.ogDescription || settings.metaDescription,
  });
}

export default async function Page() {
  const [content, settings, homeProjects] = await Promise.all([
    getHomeDocument(),
    getSiteSettings(),
    getHomeLookbookProjects(),
  ]);
  return (
    <>
      <RevealObserver />
      <SiteHeader settings={settings} />
      <main className="pt-20 md:pt-22 lg:pt-24">
        <Hero content={content} />
        <Manifesto content={content} />
        <Services content={content} />
        <LookBook projects={homeProjects} />
        <Process content={content} />
        <SilkFlorals content={content} />
        <About content={content} />
        <Testimonials content={content} />
        <Faqs content={content} />
        <Cta content={content} />
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
