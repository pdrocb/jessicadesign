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
import { getSiteSettings } from "@/cms/settings/repository";

export default async function Page() {
  const [content, settings] = await Promise.all([
    getHomeDocument(),
    getSiteSettings(),
  ]);
  return (
    <>
      <RevealObserver />
      <SiteHeader settings={settings} />
      <main className="pt-20 md:pt-22 lg:pt-24">
        <Hero content={content} />
        <Manifesto content={content} />
        <Services content={content} />
        <LookBook content={content} />
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
