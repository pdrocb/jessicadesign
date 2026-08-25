"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition, type MouseEvent } from "react";
import { CmsIcon } from "@/cms/components/CmsIcon";
import { CmsConfirmDialog } from "@/cms/components/ui/CmsConfirmDialog";
import { CmsField } from "@/cms/components/ui/CmsField";
import {
  updateProjectImage,
  type ProjectImageAction,
} from "@/cms/projects/actions";
import type { LookbookImage } from "@/lib/lookbook";

type ProjectImageManagerProps = {
  projectId: string;
  coverImageId: string;
  images: readonly LookbookImage[];
  connected: boolean;
};

function orderedImages(images: readonly LookbookImage[], coverImageId: string) {
  return [...images]
    .sort((left, right) => {
      if (left.id === coverImageId) return -1;
      if (right.id === coverImageId) return 1;
      return left.position - right.position;
    })
    .map((image, index) => ({ ...image, position: index + 1 }));
}

function applyImageAction(
  images: LookbookImage[],
  imageId: string,
  action: ProjectImageAction,
) {
  const nextImages = [...images];
  const index = nextImages.findIndex((image) => image.id === imageId);
  if (index === -1) return nextImages;

  if (action === "make-primary") {
    const [image] = nextImages.splice(index, 1);
    nextImages.unshift(image);
  } else if (action === "move-up" && index > 1) {
    [nextImages[index - 1], nextImages[index]] = [nextImages[index], nextImages[index - 1]];
  } else if (action === "move-down" && index > 0 && index < nextImages.length - 1) {
    [nextImages[index], nextImages[index + 1]] = [nextImages[index + 1], nextImages[index]];
  } else if (action === "delete") {
    nextImages.splice(index, 1);
  }

  return nextImages.map((image, position) => ({ ...image, position: position + 1 }));
}

export function ProjectImageManager({
  projectId,
  coverImageId,
  images: projectImages,
  connected,
}: ProjectImageManagerProps) {
  const router = useRouter();
  const [images, setImages] = useState(() => orderedImages(projectImages, coverImageId));
  const [primaryId, setPrimaryId] = useState(coverImageId);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function runAction(imageId: string, action: ProjectImageAction) {
    if (!connected || pending) return;

    const previousImages = images;
    const previousPrimaryId = primaryId;
    const nextImages = applyImageAction(images, imageId, action);
    const nextPrimaryId = nextImages[0]?.id ?? primaryId;
    setImages(nextImages);
    setPrimaryId(nextPrimaryId);
    setError("");

    startTransition(async () => {
      try {
        await updateProjectImage(projectId, imageId, action);
        router.refresh();
      } catch (actionError) {
        setImages(previousImages);
        setPrimaryId(previousPrimaryId);
        setError(actionError instanceof Error ? actionError.message : "The photograph could not be updated.");
      } finally {
        if (action === "delete") setDeleteTargetId(null);
      }
    });
  }

  function chooseAction(
    event: MouseEvent<HTMLButtonElement>,
    imageId: string,
    action: ProjectImageAction,
  ) {
    event.currentTarget.closest("details")?.removeAttribute("open");
    if (action === "delete") {
      setDeleteTargetId(imageId);
      return;
    }
    runAction(imageId, action);
  }

  return (
    <section className="cms-project-photo-editors" aria-busy={pending}>
      <div className="cms-project-photo-heading">
        <div><h2>Project photographs</h2><p>Choose the principal image and arrange the gallery in its published order.</p></div>
        <span>{String(images.length).padStart(2, "0")} photographs</span>
      </div>
      {error ? <p className="cms-project-photo-error" role="alert">{error}</p> : null}
      <div className="cms-project-photo-grid">
        {images.map((image, index) => {
          const isPrimary = image.id === primaryId;
          return (
            <article className="cms-project-photo-editor" data-primary={isPrimary || undefined} key={image.id}>
              <div className="cms-project-photo-visual">
                <div className="cms-project-photo-preview">
                  <Image src={image.src} alt="" fill sizes="(min-width: 1180px) 24vw, (min-width: 760px) 38vw, 104px" />
                  <details className="cms-project-photo-menu">
                    <summary aria-label={`Actions for photograph ${index + 1}`}><CmsIcon name="more" /></summary>
                    <div role="menu">
                      <button type="button" role="menuitem" disabled={!connected || pending || isPrimary} onClick={(event) => chooseAction(event, image.id, "make-primary")}>Make principal</button>
                      <button type="button" role="menuitem" disabled={!connected || pending || isPrimary || index === 1} onClick={(event) => chooseAction(event, image.id, "move-up")}>Move up</button>
                      <button type="button" role="menuitem" disabled={!connected || pending || isPrimary || index === images.length - 1} onClick={(event) => chooseAction(event, image.id, "move-down")}>Move down</button>
                      <button className="cms-project-photo-delete" type="button" role="menuitem" disabled={!connected || pending || images.length === 1} onClick={(event) => chooseAction(event, image.id, "delete")}>Delete</button>
                    </div>
                  </details>
                </div>
                <div className="cms-project-photo-meta"><span>{String(index + 1).padStart(2, "0")}</span>{isPrimary ? <strong>Principal</strong> : null}</div>
              </div>
              <CmsField
                id={`${projectId}-${image.id}-alt`}
                name={`imageAlt:${image.id}`}
                label="Alternative text"
                type="textarea"
                rows={2}
                defaultValue={image.alt}
                maxLength={500}
                required
                disabled={!connected}
              />
            </article>
          );
        })}
      </div>
      <CmsConfirmDialog
        open={deleteTargetId !== null}
        title="Delete this photograph?"
        description="This permanently removes it from the project and from the CMS database. This action cannot be undone."
        confirmLabel="Delete photograph"
        pending={pending}
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (!deleteTargetId) return;
          runAction(deleteTargetId, "delete");
        }}
      />
    </section>
  );
}
