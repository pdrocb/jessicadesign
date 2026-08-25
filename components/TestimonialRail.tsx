"use client";

import { useEffect, useRef, useState } from "react";

type Testimonial = {
  id: string;
  text: string;
  who: string;
};

type TestimonialRailProps = {
  items: readonly Testimonial[];
  label: string;
};

/**
 * Rail finito para todas las resoluciones. Empieza y termina con una tarjeta
 * completa; no duplica contenido para simular continuidad.
 */
export function TestimonialRail({ items, label }: TestimonialRailProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(items.length > 1);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || items.length === 0) return;

    const cards = Array.from(
      track.querySelectorAll<HTMLElement>("[data-testimonial-card]"),
    );
    let activeFrame = 0;

    const updateRailState = () => {
      activeFrame = 0;
      const trackBounds = track.getBoundingClientRect();
      const paddingStart = Number.parseFloat(getComputedStyle(track).paddingLeft);
      const snapLine = trackBounds.left + paddingStart;
      const firstCardBounds = cards[0]?.getBoundingClientRect();
      const lastCardBounds = cards.at(-1)?.getBoundingClientRect();
      setCanScrollPrevious((firstCardBounds?.left ?? snapLine) < snapLine - 2);
      setCanScrollNext((lastCardBounds?.right ?? trackBounds.right) > trackBounds.right + 2);

      const closest = cards.reduce((best, card, index) => {
        const distance = Math.abs(card.getBoundingClientRect().left - snapLine);
        return distance < best.distance ? { index, distance } : best;
      }, { index: 0, distance: Number.POSITIVE_INFINITY });
      setActive(closest.index);
    };

    const handleScroll = () => {
      if (!activeFrame) {
        activeFrame = requestAnimationFrame(updateRailState);
      }
    };

    track.addEventListener("scroll", handleScroll, { passive: true });
    const resizeObserver = new ResizeObserver(updateRailState);
    resizeObserver.observe(track);
    updateRailState();

    return () => {
      track.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
      cancelAnimationFrame(activeFrame);
    };
  }, [items.length]);

  const scrollByCard = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll<HTMLElement>("[data-testimonial-card]");
    const nextIndex = Math.min(items.length - 1, Math.max(0, active + direction));
    const target = cards[nextIndex];
    if (!target) return;
    const paddingStart = Number.parseFloat(getComputedStyle(track).paddingLeft);
    track.scrollTo({
      left: target.offsetLeft - paddingStart,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  return (
    <div>
      <div className="relative left-1/2 w-screen -translate-x-1/2">
        <div
          ref={trackRef}
          role="region"
          aria-roledescription="carousel"
          aria-label={label}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
            event.preventDefault();
            scrollByCard(event.key === "ArrowLeft" ? -1 : 1);
          }}
          className="flex items-start snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-(--gutter) pb-2 [scroll-padding-inline:var(--gutter)] [scrollbar-width:none] [-webkit-overflow-scrolling:touch] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-umber lg:gap-5 [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => (
            <figure
              key={item.id}
              data-testimonial-card=""
              className="flex min-h-[300px] w-[84vw] max-w-[350px] shrink-0 snap-start flex-col justify-between border border-petal-line bg-paper p-7 md:min-h-[320px] md:w-[64vw] md:max-w-[520px] md:p-8 lg:min-h-[340px] lg:w-[calc((100vw-var(--gutter)-40px)/2)] lg:max-w-none lg:p-10 min-[1800px]:!w-[calc((100vw-var(--gutter)-60px)/3)]"
            >
              <blockquote className="text-quote-md max-w-[62ch] font-display font-normal text-ink">
                “{item.text}”
              </blockquote>
              <figcaption className="text-label-xs mt-8 font-medium tracking-[0.3em] text-rose-umber uppercase md:text-label-sm">
                {item.who}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center pt-6 lg:justify-between lg:pt-8">
        <p
          aria-live="polite"
          className="text-label-xs font-medium tracking-[0.24em] text-rose-umber uppercase"
        >
          <span className="sr-only">Testimonial </span>
          {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </p>
        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canScrollPrevious}
            aria-label="Previous testimonial"
            className="grid size-11 cursor-pointer place-items-center border border-petal-line bg-paper text-rose-umber transition-colors hover:bg-petal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-umber disabled:cursor-default disabled:opacity-35"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 fill-none stroke-current" strokeWidth="1.5">
              <path d="m12.5 4.5-5 5.5 5 5.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canScrollNext}
            aria-label="Next testimonial"
            className="grid size-11 cursor-pointer place-items-center border border-petal-line bg-paper text-rose-umber transition-colors hover:bg-petal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-umber disabled:cursor-default disabled:opacity-35"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 fill-none stroke-current" strokeWidth="1.5">
              <path d="m7.5 4.5 5 5.5-5 5.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
