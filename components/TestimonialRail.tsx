"use client";

import { useEffect, useRef, useState } from "react";

type Testimonial = {
  text: string;
  who: string;
};

type TestimonialRailProps = {
  items: readonly Testimonial[];
  label: string;
};

const SETS = 3;

/**
 * Rail infinito solo para tablet y móvil. Los tres juegos son copias
 * visuales; el central es el único que existe para lectores de pantalla.
 */
export function TestimonialRail({ items, label }: TestimonialRailProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || items.length === 0) return;

    const cards = Array.from(
      track.querySelectorAll<HTMLElement>("[data-testimonial-card]"),
    );
    const firstCard = cards[0];
    const secondCard = cards[1];
    if (!firstCard || !secondCard) return;

    let activeFrame = 0;
    let restoreFrame = 0;
    let settleTimer: ReturnType<typeof setTimeout> | null = null;
    let firstPosition = 0;
    let cardStep = 0;
    let measured = false;

    const closestCardIndex = () => {
      if (!measured || cardStep <= 0) return items.length;
      return Math.min(
        cards.length - 1,
        Math.max(0, Math.round((track.scrollLeft - firstPosition) / cardStep)),
      );
    };

    const measureTrack = () => {
      if (track.clientWidth === 0) return;

      const logicalIndex = measured
        ? closestCardIndex() % items.length
        : activeRef.current;
      const trackBounds = track.getBoundingClientRect();
      const paddingStart = Number.parseFloat(
        getComputedStyle(track).paddingLeft,
      );
      firstPosition =
        track.scrollLeft +
        firstCard.getBoundingClientRect().left -
        trackBounds.left -
        paddingStart;
      const secondPosition =
        track.scrollLeft +
        secondCard.getBoundingClientRect().left -
        trackBounds.left -
        paddingStart;
      cardStep = secondPosition - firstPosition;
      measured = cardStep > 0;
      if (!measured) return;

      track.style.scrollBehavior = "auto";
      track.scrollLeft =
        firstPosition + (items.length + logicalIndex) * cardStep;
      track.style.removeProperty("scroll-behavior");
    };

    const updateActiveCard = () => {
      activeFrame = 0;
      const logicalIndex = closestCardIndex() % items.length;
      if (logicalIndex === activeRef.current) return;
      activeRef.current = logicalIndex;
      setActive(logicalIndex);
    };

    const recenterTrack = () => {
      settleTimer = null;
      const currentIndex = closestCardIndex();
      const currentSet = Math.floor(currentIndex / items.length);
      if (currentSet === 1) return;

      const logicalIndex = currentIndex % items.length;
      const middlePosition =
        firstPosition + (items.length + logicalIndex) * cardStep;

      track.style.scrollSnapType = "none";
      track.style.scrollBehavior = "auto";
      track.scrollLeft = middlePosition;
      restoreFrame = requestAnimationFrame(() => {
        track.style.removeProperty("scroll-snap-type");
        track.style.removeProperty("scroll-behavior");
      });
    };

    const handleScroll = () => {
      if (!activeFrame) {
        activeFrame = requestAnimationFrame(updateActiveCard);
      }
      if (settleTimer) clearTimeout(settleTimer);
      settleTimer = setTimeout(recenterTrack, 160);
    };

    const resizeObserver = new ResizeObserver(measureTrack);
    resizeObserver.observe(track);
    measureTrack();
    track.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      resizeObserver.disconnect();
      track.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(activeFrame);
      cancelAnimationFrame(restoreFrame);
      if (settleTimer) clearTimeout(settleTimer);
    };
  }, [items.length]);

  const cards = Array.from({ length: SETS }, (_, set) =>
    items.map((item, index) => ({
      item,
      set,
      key: `${set}-${index}`,
    })),
  ).flat();

  return (
    <div className="lg:hidden">
      <div className="-mx-(--gutter)">
        <div
          ref={trackRef}
          role="region"
          aria-roledescription="carousel"
          aria-label={label}
          tabIndex={0}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-(--gutter) pb-2 [scroll-padding-inline:var(--gutter)] [scrollbar-width:none] [-webkit-overflow-scrolling:touch] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-umber [&::-webkit-scrollbar]:hidden"
        >
          {cards.map(({ item, set, key }) => (
            <figure
              key={key}
              data-testimonial-card=""
              aria-hidden={set !== 1 || undefined}
              className="flex w-[80vw] max-w-[320px] shrink-0 snap-start flex-col justify-between border border-petal-line bg-paper p-7 md:w-[340px] md:max-w-none md:p-8"
            >
              <blockquote className="text-quote-md font-display text-ink">
                “{item.text}”
              </blockquote>
              <figcaption className="text-label-xs mt-8 font-medium tracking-[0.3em] text-rose-umber uppercase md:text-label-sm">
                {item.who}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div aria-hidden="true" className="flex justify-center gap-2 pt-6">
        {items.map((item, index) => (
          <span
            key={item.who}
            className={`h-1.5 transition-[width,background-color] duration-300 ease-out motion-reduce:transition-none ${
              index === active ? "w-5 bg-rose-umber" : "w-1.5 bg-petal-line"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
