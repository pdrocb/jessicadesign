import { Faqs } from "@/components/Faqs";
import { SiteHeader } from "@/components/SiteHeader";
import {
  About,
  Cta,
  EditorialBreak,
  Hero,
  LookBook,
  Manifesto,
  Services,
  SiteFooter,
  Testimonials,
} from "@/components/sections";

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Manifesto />
        <Services />
        <EditorialBreak />
        <About />
        <Testimonials />
        <LookBook />
        <Faqs />
        <Cta />
      </main>
      <SiteFooter />
    </>
  );
}
