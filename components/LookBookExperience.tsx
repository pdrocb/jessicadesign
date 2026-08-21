"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";
import { LookBookLightbox } from "@/components/LookBookLightbox";
import {
  getProjectCover,
  getProjectPreview,
  type LookbookImage,
  type LookbookProject,
} from "@/lib/lookbook";

type ActiveGallery = {
  projectIndex: number;
  imageIndex: number;
} | null;

function groupSequentially(
  images: LookbookImage[],
  maximumPerRow: 2 | 3,
): LookbookImage[][] {
  const rows: LookbookImage[][] = [];
  let cursor = 0;

  while (cursor < images.length) {
    const remaining = images.length - cursor;
    const rowSize =
      maximumPerRow === 3 && remaining === 4
        ? 2
        : Math.min(maximumPerRow, remaining);

    rows.push(images.slice(cursor, cursor + rowSize));
    cursor += rowSize;
  }

  return rows;
}

function breakAfterIndices(images: LookbookImage[], maximumPerRow: 2 | 3) {
  const rows = groupSequentially(images, maximumPerRow);
  const breaks = new Set<number>();
  let lastIndex = -1;

  rows.slice(0, -1).forEach((row) => {
    lastIndex += row.length;
    breaks.add(lastIndex);
  });

  return breaks;
}

function rowSpacerWeights(
  images: LookbookImage[],
  maximumPerRow: 2 | 3,
  minimumRowRatio: (imageCount: number) => number,
  ratioForImage: (image: LookbookImage) => number,
) {
  const starts = new Map<number, number>();
  const ends = new Map<number, number>();
  let firstIndex = 0;

  groupSequentially(images, maximumPerRow).forEach((row) => {
    const ratioSum = row.reduce(
      (sum, image) => sum + ratioForImage(image),
      0,
    );
    const spacerWeight =
      Math.max(0, minimumRowRatio(row.length) - ratioSum) / 2;
    const lastIndex = firstIndex + row.length - 1;

    if (spacerWeight > 0) {
      starts.set(firstIndex, spacerWeight);
      ends.set(lastIndex, spacerWeight);
    }

    firstIndex = lastIndex + 1;
  });

  return { starts, ends };
}

function editorialAspectRatio(
  image: LookbookImage,
  context: "compact" | "desktop",
) {
  const naturalRatio = image.width / image.height;

  if (image.cropTolerance === "none") return naturalRatio;

  if (naturalRatio < 1) {
    const strength = context === "desktop" ? 0.38 : 0.3;
    const minimum = context === "desktop" ? 0.78 : 0.74;

    return Math.max(
      minimum,
      naturalRatio + (1 - naturalRatio) * strength,
    );
  }

  return Math.min(naturalRatio, context === "desktop" ? 1.7 : 1.65);
}

function compactMinimumRowRatio(imageCount: number) {
  return imageCount === 1 ? 1.2 : 1.5;
}

function desktopMinimumRowRatio(imageCount: number) {
  if (imageCount === 1) return 1.45;
  if (imageCount === 2) return 1.8;
  return 2.4;
}

function PreviewRows({
  images,
  project,
  projectIndex,
  onOpen,
  className,
}: {
  images: LookbookImage[];
  project: LookbookProject;
  projectIndex: number;
  onOpen: (projectIndex: number, imageIndex: number) => void;
  className: string;
}) {
  const compactBreaks = breakAfterIndices(images, 2);
  const desktopBreaks = breakAfterIndices(images, 3);
  const compactSpacers = rowSpacerWeights(
    images,
    2,
    compactMinimumRowRatio,
    (image) => editorialAspectRatio(image, "compact"),
  );
  const desktopSpacers = rowSpacerWeights(
    images,
    3,
    desktopMinimumRowRatio,
    (image) => editorialAspectRatio(image, "desktop"),
  );

  return (
    <div
      className={`flex flex-wrap gap-x-3 md:gap-x-6 lg:gap-x-10 ${className}`}
    >
      {images.map((image, imagePosition) => {
        const imageIndex = project.images.findIndex(
          (candidate) => candidate.id === image.id,
        );
        const compactRatio = editorialAspectRatio(image, "compact");
        const desktopRatio = editorialAspectRatio(image, "desktop");
        const objectPosition = image.focalPoint
          ? `${image.focalPoint.x * 100}% ${image.focalPoint.y * 100}%`
          : "50% 50%";

        return (
          <div key={image.id} className="contents">
            {compactSpacers.starts.has(imagePosition) ? (
              <span
                aria-hidden
                className="h-0 basis-0 lg:hidden"
                style={{
                  flexGrow: compactSpacers.starts.get(imagePosition),
                }}
              />
            ) : null}
            {desktopSpacers.starts.has(imagePosition) ? (
              <span
                aria-hidden
                className="hidden h-0 basis-0 lg:block"
                style={{
                  flexGrow: desktopSpacers.starts.get(imagePosition),
                }}
              />
            ) : null}
            <button
              type="button"
              data-reveal
              style={{
                "--reveal-delay": `${(imagePosition % 3) * 80}ms`,
                "--preview-ratio-compact": compactRatio,
                "--preview-ratio-desktop": desktopRatio,
              } as CSSProperties}
              onClick={() => onOpen(projectIndex, imageIndex)}
              aria-label={`Open ${project.title} gallery at photograph ${imageIndex + 1}`}
              className="group relative mb-3 min-w-0 basis-0 overflow-hidden [aspect-ratio:var(--preview-ratio-compact)] [flex-grow:var(--preview-ratio-compact)] md:mb-6 lg:mb-10 lg:[aspect-ratio:var(--preview-ratio-desktop)] lg:[flex-grow:var(--preview-ratio-desktop)]"
            >
              <Image
                src={image.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 31vw, (min-width: 768px) 46vw, 47vw"
                style={{ objectPosition }}
                className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.015]"
              />
            </button>
            {compactSpacers.ends.has(imagePosition) ? (
              <span
                aria-hidden
                className="h-0 basis-0 lg:hidden"
                style={{ flexGrow: compactSpacers.ends.get(imagePosition) }}
              />
            ) : null}
            {desktopSpacers.ends.has(imagePosition) ? (
              <span
                aria-hidden
                className="hidden h-0 basis-0 lg:block"
                style={{ flexGrow: desktopSpacers.ends.get(imagePosition) }}
              />
            ) : null}
            {compactBreaks.has(imagePosition) ? (
              <span aria-hidden className="h-0 basis-full lg:hidden" />
            ) : null}
            {desktopBreaks.has(imagePosition) ? (
              <span aria-hidden className="hidden h-0 basis-full lg:block" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function LookBookExperience({
  projects,
}: {
  projects: LookbookProject[];
}) {
  const [activeGallery, setActiveGallery] = useState<ActiveGallery>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const activeProject = activeGallery
    ? projects[activeGallery.projectIndex]
    : null;

  const openGallery = (
    projectIndex: number,
    imageIndex: number,
  ) => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setActiveGallery({ projectIndex, imageIndex });
  };

  const closeGallery = () => {
    setActiveGallery(null);
    requestAnimationFrame(() => returnFocusRef.current?.focus());
  };

  const previousImage = () => {
    setActiveGallery((current) => {
      if (!current) return current;
      const count = projects[current.projectIndex].images.length;
      return {
        ...current,
        imageIndex: (current.imageIndex - 1 + count) % count,
      };
    });
  };

  const nextImage = () => {
    setActiveGallery((current) => {
      if (!current) return current;
      const count = projects[current.projectIndex].images.length;
      return {
        ...current,
        imageIndex: (current.imageIndex + 1) % count,
      };
    });
  };

  return (
    <>
      <section className="gutter bg-paper pt-16 md:pt-22 lg:pt-28">
        <div className="shell">
          <div className="grid gap-8 border-b border-line pb-12 md:grid-cols-12 md:items-end md:pb-16">
            <h1 className="text-display-hero font-display font-medium md:col-span-7">
              The Look Book
            </h1>
            <p className="text-body-lg max-w-[52ch] text-ink-muted md:col-span-5 md:justify-self-end">
              Weddings, dinner receptions, and thoughtfully styled gatherings across the Hudson Valley, New York City, and beyond.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-bone">
        {projects.map((project, projectIndex) => {
          const cover = getProjectCover(project);
          const coverIndex = Math.max(
            project.images.findIndex((image) => image.id === cover.id),
            0,
          );
          const preview = getProjectPreview(project);
          const reverse = projectIndex % 2 === 1;
          const information = [
            project.subtitle,
            [project.venue, project.location].filter(Boolean).join(" · "),
          ].filter(Boolean);

          return (
            <article
              key={project.id}
              id={project.slug}
              className="gutter shell scroll-mt-20 border-t border-line py-16 first:border-t-0 md:scroll-mt-22 md:py-22 lg:scroll-mt-24 lg:py-28"
            >
              <div className="grid gap-8 md:grid-cols-12 md:gap-6 lg:gap-10">
                <header
                  data-reveal
                  className={`flex flex-col items-start gap-4 md:col-span-4 md:self-start lg:sticky lg:top-32 ${
                    reverse ? "md:col-start-9 md:row-start-1" : ""
                  }`}
                >
                  <div className="text-label-sm font-medium tracking-[0.26em] text-ink-subtle uppercase">
                    {String(project.position).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                  </div>
                  <h2 className="text-display-md font-display font-medium">
                    {project.title}
                  </h2>
                  {information.length ? (
                    <div className="text-body-md flex flex-col gap-1 text-ink-muted">
                      {information.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  ) : null}
                  {project.photographer ? (
                    <p className="text-label-sm font-medium tracking-[0.18em] text-ink-subtle uppercase">
                      Photography · {project.photographer}
                    </p>
                  ) : null}
                </header>

                <button
                  type="button"
                  data-reveal
                  onClick={() => openGallery(projectIndex, coverIndex)}
                  aria-label={`Open ${project.title} gallery at photograph ${coverIndex + 1}`}
                  className={`group relative aspect-[3/2] overflow-hidden md:col-span-8 md:row-start-1 ${
                    reverse ? "md:col-start-1" : "md:col-start-5"
                  }`}
                >
                  <Image
                    src={cover.src}
                    alt=""
                    fill
                    loading={projectIndex === 0 ? "eager" : "lazy"}
                    sizes="(min-width: 1536px) 1008px, (min-width: 768px) 66vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.02]"
                  />
                </button>
              </div>

              {preview.length ? (
                <PreviewRows
                  images={preview}
                  project={project}
                  projectIndex={projectIndex}
                  onOpen={openGallery}
                  className="mt-6 space-y-3 md:mt-10 md:space-y-6 lg:mt-14 lg:space-y-10"
                />
              ) : null}

              <div className="mt-9 flex items-center justify-between gap-6 border-t border-line pt-5 md:mt-12 lg:mt-16">
                <p className="text-label-sm font-medium tracking-[0.2em] text-ink-subtle uppercase">
                  {String(project.images.length).padStart(2, "0")} photographs
                </p>
                <button
                  type="button"
                  onClick={() => openGallery(projectIndex, 0)}
                  className="text-label-sm min-h-11 border-b border-ink py-3 text-right font-medium tracking-[0.24em] uppercase transition-colors hover:text-ink-subtle"
                >
                  View Full Gallery
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <LookBookLightbox
        project={activeProject}
        activeIndex={activeGallery?.imageIndex ?? 0}
        onClose={closeGallery}
        onPrevious={previousImage}
        onNext={nextImage}
      />
    </>
  );
}
