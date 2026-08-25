"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef } from "react";
import { ButtonPrimary } from "@/components/ui";

type FounderStoryDialogProps = {
  image: StaticImageData | string;
  imageAlt: string;
  triggerLabel: string;
  ctaLabel: string;
  story: {
    heading: string;
    introduction: string;
    paragraphs: readonly string[];
  };
};

export function FounderStoryDialog({
  image,
  imageAlt,
  triggerLabel,
  ctaLabel,
  story,
}: FounderStoryDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const previousOverflowRef = useRef("");

  useEffect(() => {
    return () => {
      document.documentElement.style.overflow = previousOverflowRef.current;
    };
  }, []);

  const openDialog = () => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    previousOverflowRef.current = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    dialog.showModal();
  };

  const closeDialog = () => dialogRef.current?.close();

  const handleClose = () => {
    document.documentElement.style.overflow = previousOverflowRef.current;
    triggerRef.current?.focus();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openDialog}
        className="group text-label mt-3 inline-flex min-h-11 self-start items-center gap-4 border-b border-ink py-3 font-medium tracking-[0.28em] uppercase transition-colors duration-[180ms] hover:text-ink-subtle"
      >
        {triggerLabel}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 12"
          className="h-3 w-6 transition-transform duration-[180ms] group-hover:translate-x-1"
        >
          <path
            d="M0 6h22M17 1l5 5-5 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="founder-story-title"
        onClose={handleClose}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
        className="founder-dialog fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-paper p-0 text-ink backdrop:bg-ink/70"
      >
        <button
          type="button"
          onClick={closeDialog}
          autoFocus
          aria-label="Close Jessica's story"
          className="fixed top-4 right-4 z-10 grid h-11 w-11 place-items-center bg-paper md:top-6 md:right-6"
        >
          <span aria-hidden className="relative block h-5 w-5">
            <span className="absolute top-1/2 left-0 h-px w-full rotate-45 bg-ink" />
            <span className="absolute top-1/2 left-0 h-px w-full -rotate-45 bg-ink" />
          </span>
        </button>

        <div className="founder-dialog__layout min-h-full md:grid md:grid-cols-12">
          <div className="founder-dialog__image aspect-[4/5] md:sticky md:top-0 md:col-span-5 md:h-dvh md:aspect-auto">
            <div className="relative h-full w-full">
              <Image
                src={image}
                alt={imageAlt}
                fill
                sizes="(min-width: 768px) 42vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="gutter founder-dialog__copy flex py-12 md:col-span-7 md:min-h-dvh md:items-center md:py-10 lg:py-12">
            <div className="flex w-full max-w-[720px] flex-col gap-5 md:gap-4 lg:gap-5">
              <h2
                id="founder-story-title"
                className="text-founder-display max-w-[30ch] font-display font-medium tracking-[-0.015em] uppercase"
              >
                {story.heading}
              </h2>
              <p className="text-founder-intro max-w-[54ch] font-display font-medium">
                {story.introduction}
              </p>
              <div className="text-founder-body flex max-w-[68ch] flex-col gap-4 text-ink-muted">
                {story.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-1">
                <ButtonPrimary
                  href="/inquire"
                  onClick={closeDialog}
                  className="w-full md:w-auto"
                >
                  {ctaLabel}
                </ButtonPrimary>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
