"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type ChangeEvent, type MouseEvent } from "react";
import { CmsIcon } from "@/cms/components/CmsIcon";
import { CmsConfirmDialog } from "@/cms/components/ui/CmsConfirmDialog";
import { CmsField } from "@/cms/components/ui/CmsField";
import {
  uploadProjectImage,
  updateProjectImage,
  type ProjectImageAction,
} from "@/cms/projects/actions";
import { largeCmsImageBytes, maximumCmsImageBytes } from "@/cms/media/image-policy";
import { optimizeCmsImage } from "@/cms/media/optimize-image";
import type { LookbookImage } from "@/lib/lookbook";

type ProjectImageManagerProps = {
  projectId: string;
  coverImageId: string;
  images: readonly LookbookImage[];
  connected: boolean;
};

type UploadStage = "queued" | "optimizing" | "uploading" | "error";

type UploadItem = {
  id: string;
  file: File;
  preview: string;
  stage: UploadStage;
  error?: string;
  warning?: string;
};

const optimizationConcurrency = 3;

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
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
  const [actionError, setActionError] = useState("");
  const previewUrls = useRef(new Set<string>());
  const [pending, startTransition] = useTransition();
  const uploading = uploadItems.some((item) => item.stage !== "error");
  const busy = pending || uploading;

  useEffect(() => () => {
    previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
    previewUrls.current.clear();
  }, []);

  function releasePreview(url: string) {
    URL.revokeObjectURL(url);
    previewUrls.current.delete(url);
  }

  function clearUploadItems() {
    uploadItems.forEach((item) => releasePreview(item.preview));
    setUploadItems([]);
  }

  function updateUploadItem(id: string, update: Partial<UploadItem>) {
    setUploadItems((currentItems) => currentItems.map((item) => (
      item.id === id ? { ...item, ...update } : item
    )));
  }

  async function chooseUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? []);
    if (files.length === 0) return;
    event.currentTarget.value = "";

    setActionError("");
    clearUploadItems();

    const nextItems = files.map((file, index): UploadItem => {
      const preview = URL.createObjectURL(file);
      previewUrls.current.add(preview);
      const id = `${Date.now()}-${index}-${file.name}`;

      if (file.type !== "image/jpeg" && file.type !== "image/webp") {
        return { id, file, preview, stage: "error", error: "Choose a JPG or WebP image." };
      }
      return { id, file, preview, stage: "queued" };
    });
    setUploadItems(nextItems);

    // Give React a frame to paint every queued card before image decoding begins.
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    const uploadableItems = nextItems.filter((item) => item.stage === "queued");
    const optimizedFiles = new Map<string, File>();
    let optimizationIndex = 0;
    async function optimizeNext() {
      while (optimizationIndex < uploadableItems.length) {
        const item = uploadableItems[optimizationIndex];
        optimizationIndex += 1;
        updateUploadItem(item.id, { stage: "optimizing" });
        try {
          const optimizedFile = await optimizeCmsImage(item.file);
          if (optimizedFile.size > maximumCmsImageBytes) {
            throw new Error("The optimized image must be 10 MB or smaller.");
          }
          optimizedFiles.set(item.id, optimizedFile);
          updateUploadItem(item.id, {
            stage: "queued",
            warning: optimizedFile.size > largeCmsImageBytes
              ? "This image is still quite large. Consider replacing it with a smaller version."
              : undefined,
          });
        } catch (optimizationFailure) {
          updateUploadItem(item.id, {
            stage: "error",
            error: optimizationFailure instanceof Error
              ? optimizationFailure.message
              : "The photograph could not be optimized.",
          });
        }
      }
    }

    await Promise.all(Array.from(
      { length: Math.min(optimizationConcurrency, uploadableItems.length) },
      () => optimizeNext(),
    ));

    let uploadedAny = false;
    for (const item of uploadableItems) {
      const optimizedFile = optimizedFiles.get(item.id);
      if (!optimizedFile) continue;
      updateUploadItem(item.id, { stage: "uploading" });
      try {
        const formData = new FormData();
        formData.set("file", optimizedFile);
        const image = await uploadProjectImage(projectId, formData);
        setImages((currentImages) => [...currentImages, image]);
        setUploadItems((currentItems) => currentItems.filter((currentItem) => currentItem.id !== item.id));
        releasePreview(item.preview);
        uploadedAny = true;
      } catch (uploadFailure) {
        updateUploadItem(item.id, {
          stage: "error",
          error: uploadFailure instanceof Error
            ? uploadFailure.message
            : "The photograph could not be uploaded.",
        });
      }
    }

    if (uploadedAny) router.refresh();
  }

  function runAction(imageId: string, action: ProjectImageAction) {
    if (!connected || busy) return;

    const previousImages = images;
    const previousPrimaryId = primaryId;
    const nextImages = applyImageAction(images, imageId, action);
    const nextPrimaryId = nextImages[0]?.id ?? primaryId;
    setImages(nextImages);
    setPrimaryId(nextPrimaryId);
    setActionError("");

    startTransition(async () => {
      try {
        await updateProjectImage(projectId, imageId, action);
        router.refresh();
      } catch (actionError) {
        setImages(previousImages);
        setPrimaryId(previousPrimaryId);
        setActionError(actionError instanceof Error ? actionError.message : "The photograph could not be updated.");
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
    <section className="cms-project-photo-editors" aria-busy={busy}>
      <div className="cms-project-photo-heading">
        <div><h2>Project photographs</h2><p>The cover image always stays first. Choose another cover to move it to the beginning of the gallery.</p></div>
        <span>{String(images.length).padStart(2, "0")} photographs</span>
      </div>
      {actionError ? <p className="cms-project-photo-error" role="alert">{actionError}</p> : null}
      <div className="cms-project-photo-grid">
        {images.map((image, index) => {
          const isPrimary = image.id === primaryId;
          return (
            <article className="cms-project-photo-editor" data-primary={isPrimary || undefined} key={image.id}>
              <div className="cms-project-photo-visual">
                <div className="cms-project-photo-preview">
                  <Image src={image.src} alt="" fill sizes="(min-width: 1180px) 24vw, (min-width: 760px) 38vw, calc(100vw - 48px)" />
                  <div className="cms-project-photo-toolbar">
                    <div className="cms-project-photo-labels">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {isPrimary ? <strong>Cover</strong> : null}
                    </div>
                    <div className="cms-project-photo-toolbar-actions">
                      {!isPrimary ? (
                        <div className="cms-project-photo-order" aria-label={`Reorder photograph ${index + 1}`}>
                          <button
                            type="button"
                            aria-label={`Move photograph ${index + 1} up`}
                            title="Move up"
                            disabled={!connected || busy || index === 1}
                            onClick={() => runAction(image.id, "move-up")}
                          >
                            <CmsIcon name="up" />
                          </button>
                          <button
                            type="button"
                            aria-label={`Move photograph ${index + 1} down`}
                            title="Move down"
                            disabled={!connected || busy || index === images.length - 1}
                            onClick={() => runAction(image.id, "move-down")}
                          >
                            <CmsIcon name="down" />
                          </button>
                        </div>
                      ) : null}
                      <details className="cms-project-photo-menu">
                        <summary aria-label={`Actions for photograph ${index + 1}`}><CmsIcon name="more" /></summary>
                        <div role="menu">
                          <button type="button" role="menuitem" disabled={!connected || busy || isPrimary} onClick={(event) => chooseAction(event, image.id, "make-primary")}>Make cover image</button>
                          <button className="cms-project-photo-delete" type="button" role="menuitem" disabled={!connected || busy || images.length === 1} onClick={(event) => chooseAction(event, image.id, "delete")}>Delete</button>
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
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
        {uploadItems.map((item) => (
          <article className="cms-project-photo-editor cms-project-photo-upload cms-project-photo-upload-item" key={item.id}>
            <div className="cms-project-photo-upload-trigger">
              <div className="cms-project-photo-preview">
                {/* Local browser Blob URLs cannot use Next's image optimizer. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.preview} alt="" />
              </div>
              <div className="cms-project-photo-upload-copy">
                <strong>
                  {item.stage === "optimizing"
                    ? "Optimizing photograph…"
                    : item.stage === "uploading"
                      ? "Uploading photograph…"
                      : item.stage === "error"
                        ? "Photograph not uploaded"
                        : "Waiting to upload…"}
                </strong>
                <small title={item.file.name}>{item.file.name}</small>
                {item.error ? <span className="cms-project-photo-upload-error" role="alert">{item.error}</span> : null}
                {item.warning ? <span className="cms-project-photo-upload-warning" role="status">{item.warning}</span> : null}
              </div>
            </div>
          </article>
        ))}
        <article className="cms-project-photo-editor cms-project-photo-upload">
          <label className="cms-project-photo-upload-trigger" htmlFor={`${projectId}-new-image`}>
            <div className="cms-project-photo-preview">
              <span aria-hidden><CmsIcon name="plus" /></span>
            </div>
            <div className="cms-project-photo-upload-copy">
              <strong>Add photographs</strong>
              <small>Select one or more JPG or WebP files. Images are optimized before upload; each optimized file may be up to 10 MB.</small>
            </div>
            <input
              className="cms-file-input"
              id={`${projectId}-new-image`}
              type="file"
              accept="image/jpeg,image/webp"
              multiple
              disabled={!connected || busy}
              onChange={chooseUpload}
            />
          </label>
        </article>
      </div>
      <CmsConfirmDialog
        open={deleteTargetId !== null}
        title="Delete this photograph?"
        description="This permanently removes it from the project, the CMS database, and image storage. This action cannot be undone."
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
