"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

const CLICK_EVENTS = new Set([
  "look_book_click",
  "inquire_click",
  "contact_click",
  "social_click",
]);

/**
 * Traduce las marcas declarativas del HTML en eventos del dataLayer y
 * observa secciones/formulario sin convertir el contenido editorial en
 * Client Components.
 */
export function AnalyticsRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest<HTMLElement>("[data-analytics-event]");
      if (!target) return;

      const eventName = target.dataset.analyticsEvent;
      const linkLocation = target.dataset.linkLocation;
      if (!eventName || !linkLocation || !CLICK_EVENTS.has(eventName)) return;

      if (eventName === "look_book_click" || eventName === "inquire_click") {
        trackEvent({ event: eventName, link_location: linkLocation });
      } else if (eventName === "contact_click") {
        const contactMethod = target.dataset.contactMethod;
        if (contactMethod === "phone" || contactMethod === "email") {
          trackEvent({
            event: "contact_click",
            contact_method: contactMethod,
            link_location: linkLocation,
          });
        }
      } else {
        const socialNetwork = target.dataset.socialNetwork;
        if (socialNetwork === "instagram" || socialNetwork === "facebook") {
          trackEvent({
            event: "social_click",
            social_network: socialNetwork,
            link_location: linkLocation,
          });
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const observed = document.querySelectorAll<HTMLElement>(
      "[data-analytics-section], [data-analytics-form-view]",
    );
    const seen = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || seen.has(entry.target)) return;
          seen.add(entry.target);
          observer.unobserve(entry.target);

          const element = entry.target as HTMLElement;
          const sectionName = element.dataset.analyticsSection;
          if (sectionName) {
            trackEvent({ event: "section_view", section_name: sectionName });
          } else if (element.dataset.analyticsFormView !== undefined) {
            trackEvent({ event: "form_view" });
          }
        });
      },
      { threshold: 0.15 },
    );

    observed.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
