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

function cardPosition(track: HTMLDivElement, card: HTMLElement) {
  const trackBounds = track.getBoundingClientRect();
  const paddingStart = Number.parseFloat(getComputedStyle(track).paddingLeft);
  const maxScroll = track.scrollWidth - track.clientWidth;

  return Math.min(
    Math.max(
      0,
      track.scrollLeft +
        card.getBoundingClientRect().left -
        trackBounds.left -
        paddingStart,
    ),
    maxScroll,
  );
}

function closestCardIndex(track: HTMLDivElement, cards: HTMLElement[]) {
  return cards.reduce(
    (closest, card, index) =>
      Math.abs(track.scrollLeft - cardPosition(track, card)) <
      Math.abs(track.scrollLeft - cardPosition(track, cards[closest]))
        ? index
        : closest,
    0,
  );
}

/**
 * Rail infinito solo para tablet y móvil. Los tres juegos son copias
 * visuales; el central es el único que existe para lectores de pantalla.
 */
export function TestimonialRail({ items, label }: TestimonialRailProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || items.length === 0) return;

    const cards = Array.from(
      track.querySelectorAll<HTMLElement>("[data-testimonial-card]"),
    );
    const middleFirstCard = cards[items.length];
    if (!middleFirstCard) return;

    let activeFrame = 0;
    let restoreFrame = 0;
    let settleTimer: ReturnType<typeof setTimeout> | null = null;
    let positioned = false;

    const positionInitialCard = () => {
      if (positioned || track.clientWidth === 0) return;
      track.style.scrollBehavior = "auto";
      track.scrollLeft = cardPosition(track, middleFirstCard);
      track.style.removeProperty("scroll-behavior");
      positioned = true;
    };

    const updateActiveCard = () => {
      activeFrame = 0;
      setActive(closestCardIndex(track, cards) % items.length);
    };

    const recenterTrack = () => {
      settleTimer = null;
      const currentIndex = closestCardIndex(track, cards);
      const currentSet = Math.floor(currentIndex / items.length);
      if (currentSet === 1) return;

      const logicalIndex = currentIndex % items.length;
      const currentCard = cards[currentIndex];
      const middleCard = cards[items.length + logicalIndex];
      if (!currentCard || !middleCard) return;

      const delta =
        middleCard.getBoundingClientRect().left -
        currentCard.getBoundingClientRect().left;
      if (Math.abs(delta) < 1) return;

      track.style.scrollSnapType = "none";
      track.style.scrollBehavior = "auto";
      track.scrollLeft += delta;
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

    const resizeObserver = new ResizeObserver(positionInitialCard);
    resizeObserver.observe(track);
    positionInitialCard();
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
