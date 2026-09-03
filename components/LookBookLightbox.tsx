"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { LookbookProject } from "@/lib/lookbook";

type LookBookLightboxProps = {
  project: LookbookProject | null;
  activeIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

export function LookBookLightbox({
  project,
  activeIndex,
  onClose,
  onPrevious,
  onNext,
}: LookBookLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (project && !dialog.open) dialog.showModal();
    if (!project && dialog.open) dialog.close();
  }, [project]);

  useEffect(() => {
    if (!project) return;

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dialogRef.current?.close();
      if (event.key === "ArrowLeft") onPrevious();
      if (event.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [onNext, onPrevious, project]);

  const image = project?.images[activeIndex];

  return (
    <dialog
      ref={dialogRef}
      aria-label={project ? `${project.title} gallery` : "Project gallery"}
      onCancel={(event) => {
        event.preventDefault();
        dialogRef.current?.close();
      }}
      onClose={onClose}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-paper p-0 text-ink backdrop:bg-paper"
    >
      {project && image ? (
        <div
          className="relative grid h-dvh grid-rows-[72px_1fr_72px] overflow-hidden md:grid-rows-[80px_1fr_80px]"
          onTouchStart={(event) => {
            const touch = event.touches[0];
            touchStart.current = { x: touch.clientX, y: touch.clientY };
          }}
          onTouchEnd={(event) => {
            const start = touchStart.current;
            const touch = event.changedTouches[0];
            touchStart.current = null;
            if (!start || !touch) return;

            const deltaX = touch.clientX - start.x;
            const deltaY = touch.clientY - start.y;
            if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY)) {
              return;
            }
            if (deltaX > 0) onPrevious();
            else onNext();
          }}
        >
          <header className="gutter flex items-center justify-between border-b border-line">
            <div className="min-w-0 pr-4">
              <div className="text-label-sm truncate font-medium tracking-[0.24em] uppercase">
                {project.title}
              </div>
            </div>
            <button
              type="button"
              autoFocus
              onClick={() => dialogRef.current?.close()}
              aria-label="Close gallery"
              className="grid h-11 w-11 shrink-0 place-items-center"
            >
              <span aria-hidden className="relative block h-5 w-5">
                <span className="absolute top-1/2 left-0 h-px w-full rotate-45 bg-ink" />
                <span className="absolute top-1/2 left-0 h-px w-full -rotate-45 bg-ink" />
              </span>
            </button>
          </header>

          <div className="relative min-h-0 bg-bone px-4 py-4 md:px-20 md:py-6 lg:px-28">
            <Image
              key={image.id}
              src={image.src}
              alt={image.alt}
              fill
              loading="eager"
              sizes="(min-width: 1024px) calc(100vw - 224px), (min-width: 768px) calc(100vw - 160px), calc(100vw - 32px)"
              className="object-contain"
            />

            {project.images.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={onPrevious}
                  aria-label="Previous photograph"
                  className="absolute top-1/2 left-3 grid h-11 w-11 -translate-y-1/2 place-items-center border border-line-warm bg-paper transition-colors hover:bg-cream md:left-4 md:h-12 md:w-12"
                >
                  <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.25">
                    <path d="m15 5-7 7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={onNext}
                  aria-label="Next photograph"
                  className="absolute top-1/2 right-3 grid h-11 w-11 -translate-y-1/2 place-items-center border border-line-warm bg-paper transition-colors hover:bg-cream md:right-4 md:h-12 md:w-12"
                >
                  <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.25">
                    <path d="m9 5 7 7-7 7" />
                  </svg>
                </button>
              </>
            ) : null}
          </div>

          <footer className="gutter flex items-center justify-between gap-5 border-t border-line text-ink-subtle">
            <div className="text-label-xs truncate font-medium tracking-[0.22em] uppercase md:text-label-sm">
              {[project.venue, project.location].filter(Boolean).join(" · ")}
            </div>
            <div className="text-label-sm shrink-0 font-medium tracking-[0.22em] tabular-nums uppercase">
              {String(activeIndex + 1).padStart(2, "0")} / {String(project.images.length).padStart(2, "0")}
            </div>
          </footer>
        </div>
      ) : null}
    </dialog>
  );
}
