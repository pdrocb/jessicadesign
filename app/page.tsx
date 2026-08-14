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

export default function Page() {
  return (
    <>
      <RevealObserver />
      <SiteHeader />
      <main className="pt-20 md:pt-22 lg:pt-24">
        <Hero />
        <Manifesto />
        <Services />
        <LookBook />
        <Process />
        <SilkFlorals />
        <About />
        <Testimonials />
        <Faqs />
        <Cta />
      </main>
      <SiteFooter />
    </>
  );
}
