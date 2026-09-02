"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition, type ChangeEvent, type MouseEvent } from "react";
import { CmsIcon } from "@/cms/components/CmsIcon";
import { CmsConfirmDialog } from "@/cms/components/ui/CmsConfirmDialog";
import { CmsField } from "@/cms/components/ui/CmsField";
import {
  uploadProjectImage,
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
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => () => {
    if (uploadPreview) URL.revokeObjectURL(uploadPreview);
  }, [uploadPreview]);

  function resetUpload() {
    setUploadPreview(null);
  }

  function chooseUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    event.currentTarget.value = "";

    setError("");
    if (file.type !== "image/jpeg" && file.type !== "image/webp") {
      resetUpload();
      setError("Choose a JPG or WebP image.");
      return;
    }
    if (file.size > 4_000_000) {
      resetUpload();
      setError("The image must be under 4 MB.");
      return;
    }

    setUploadPreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.set("file", file);

    startTransition(async () => {
      try {
        const image = await uploadProjectImage(projectId, formData);
        setImages((currentImages) => [...currentImages, image]);
        resetUpload();
        router.refresh();
      } catch (uploadError) {
        setError(uploadError instanceof Error ? uploadError.message : "The photograph could not be uploaded.");
        resetUpload();
      }
    });
  }

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
        <div><h2>Project photographs</h2><p>The principal image is the cover and always stays first. Choose another principal to move it to the beginning of the gallery.</p></div>
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
        <article className="cms-project-photo-editor cms-project-photo-upload">
          <label className="cms-project-photo-upload-trigger" htmlFor={`${projectId}-new-image`}>
            <div className="cms-project-photo-preview">
              {uploadPreview ? (
                // The local preview is a browser Blob URL, so it cannot use Next's image optimizer.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={uploadPreview} alt="" />
              ) : (
                <span aria-hidden><CmsIcon name="plus" /></span>
              )}
            </div>
            <div className="cms-project-photo-upload-copy">
              <strong>{uploadPreview ? "Uploading photograph…" : "Add photograph"}</strong>
              <small>JPG or WebP, up to 4 MB. It will be placed last in the gallery.</small>
            </div>
            <input
              className="cms-file-input"
              id={`${projectId}-new-image`}
              type="file"
              accept="image/jpeg,image/webp"
              disabled={!connected || pending}
              onChange={chooseUpload}
            />
          </label>
        </article>
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
