import type { Metadata } from "next";
import { LookBookExperience } from "@/components/LookBookExperience";
import { RevealObserver } from "@/components/RevealObserver";
import { SiteHeader } from "@/components/SiteHeader";
import { Cta, SiteFooter } from "@/components/sections";
import { getPublishedLookbookProjects } from "@/lib/lookbook";

export const metadata: Metadata = {
  title: "Look Book | Jessica S. Designs",
  description:
    "Explore weddings, dinner receptions, and styled celebrations designed by Jessica S. Designs across the Hudson Valley, New York City, and beyond.",
  alternates: { canonical: "/look-book" },
  openGraph: {
    title: "The Look Book | Jessica S. Designs",
    description:
      "A collection of weddings and celebrations designed down to every detail.",
    url: "/look-book",
  },
};

export default function LookBookPage() {
  const projects = getPublishedLookbookProjects();

  return (
    <>
      <RevealObserver />
      <SiteHeader />
      <main className="pt-20 md:pt-22 lg:pt-24">
        <LookBookExperience projects={projects} />
        <Cta />
      </main>
      <SiteFooter />
    </>
  );
}
