"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useState, type ChangeEvent } from "react";
import { CmsButton } from "@/cms/components/ui/CmsButton";
import { CmsFormAlert } from "@/cms/components/ui/CmsEditorChrome";
import { CmsField } from "@/cms/components/ui/CmsField";
import { CmsPageHeader } from "@/cms/components/ui/CmsPageHeader";
import { CmsUnsavedChangesGuard } from "@/cms/components/ui/CmsUnsavedChangesGuard";
import {
  createProject,
  type ProjectCreateState,
} from "@/cms/projects/actions";
import {
  largeCmsImageBytes,
  maximumCmsImageBytes,
} from "@/cms/media/image-policy";
import { optimizeCmsImage } from "@/cms/media/optimize-image";

const initialState: ProjectCreateState = { status: "idle", message: "" };

export function NewProjectEditor({ connected }: { connected: boolean }) {
  const [state, action, pending] = useActionState(createProject, initialState);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [optimizing, setOptimizing] = useState(false);
  const [fileMessage, setFileMessage] = useState("");
  const [dirty, setDirty] = useState(false);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  useEffect(() => {
    if (state.status !== "error" || !state.field) return;
    const id = state.field === "file" ? "cms-new-project-cover-file" : "cms-new-project-title";
    const frame = window.requestAnimationFrame(() => window.document.getElementById(id)?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [state]);

  async function chooseCover(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!selected) return;

    setOptimizing(true);
    setDirty(true);
    setFile(null);
    setFileMessage("");
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(selected));

    try {
      if (selected.type !== "image/jpeg" && selected.type !== "image/webp") {
        throw new Error("Choose a JPG or WebP image.");
      }
      const optimized = await optimizeCmsImage(selected);
      if (optimized.size > maximumCmsImageBytes) {
        throw new Error("The optimized image must be 10 MB or smaller.");
      }
      setFile(optimized);
      setFileMessage(
        optimized.size > largeCmsImageBytes
          ? "This image is still quite large. Consider using a smaller version."
          : "Cover photograph ready.",
      );
    } catch (error) {
      setFileMessage(error instanceof Error ? error.message : "The photograph could not be optimized.");
    } finally {
      setOptimizing(false);
    }
  }

  const titleError = state.status === "error" && state.field === "title" ? state.message : undefined;
  const coverError = state.status === "error" && state.field === "file"
    ? state.message
    : !file && fileMessage
      ? fileMessage
      : undefined;
  const coverStatus = file ? fileMessage : "";
  const coverDisabled = !connected || optimizing || pending;
  const coverDescription = ["cms-new-project-cover-help", coverStatus ? "cms-new-project-cover-status" : "", coverError ? "cms-new-project-cover-error" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <form
      className="cms-new-project-form"
      onChange={() => setDirty(true)}
      action={(formData) => {
        if (!file) return;
        formData.set("file", file);
        action(formData);
      }}
    >
      <CmsPageHeader
        title="New project"
        description="Start with a title and cover photograph. The project remains a draft until you publish it."
        actions={
          <>
            <Link className="cms-secondary-link" href="/admin/projects">Cancel</Link>
            <CmsButton disabled={!connected || !file || optimizing || pending} type="submit">
              {optimizing ? "Optimizing…" : pending ? "Creating…" : "Create project"}
            </CmsButton>
          </>
        }
      />

      {!connected ? (
        <p className="cms-connection-note">Connect Neon and Vercel Blob to create projects.</p>
      ) : null}
      {state.status === "error" ? <CmsFormAlert focusOnMount={!state.field} heading={state.field ? "Check the highlighted field" : "Couldn’t create project"} message={state.message} /> : null}

      <section className="cms-new-project-panel" aria-labelledby="cms-new-project-details">
        <div className="cms-new-project-copy">
          <h2 id="cms-new-project-details">Project foundation</h2>
          <p>You can add venue, location, photography credit and the rest of the gallery after creation.</p>
        </div>
        <div className="cms-new-project-fields">
          <CmsField id="cms-new-project-title" name="title" label="Project title" required maxLength={160} disabled={!connected} error={titleError} />
          <div className="cms-new-project-cover">
            <div className="cms-new-project-preview">
              {preview ? <Image src={preview} alt="Selected cover preview" fill sizes="(max-width: 760px) 100vw, 420px" unoptimized /> : <span>Choose the first photograph</span>}
            </div>
            <div>
              <strong>Cover photograph</strong>
              <p id="cms-new-project-cover-help">JPG or WebP · optimized before upload · up to 10 MB after processing.</p>
              <label
                aria-disabled={coverDisabled || undefined}
                className="cms-file-button"
                data-disabled={coverDisabled || undefined}
              >
                {preview ? "Choose another" : "Choose photograph"}
                <input
                  aria-busy={optimizing || undefined}
                  aria-describedby={coverDescription || undefined}
                  aria-errormessage={coverError ? "cms-new-project-cover-error" : undefined}
                  aria-invalid={coverError ? true : undefined}
                  className="cms-file-input"
                  id="cms-new-project-cover-file"
                  type="file"
                  accept="image/jpeg,image/webp"
                  disabled={coverDisabled}
                  onChange={chooseCover}
                />
              </label>
              {coverStatus ? <small id="cms-new-project-cover-status" role="status">{coverStatus}</small> : null}
              {coverError ? <small id="cms-new-project-cover-error" data-error role="alert">{coverError}</small> : null}
            </div>
          </div>
        </div>
      </section>

      <div className="cms-new-project-mobile-actions">
        <Link className="cms-secondary-link" href="/admin/projects">Cancel</Link>
        <CmsButton disabled={!connected || !file || optimizing || pending} type="submit">
          {optimizing ? "Optimizing…" : pending ? "Creating…" : "Create project"}
        </CmsButton>
      </div>
      <CmsUnsavedChangesGuard when={dirty || state.status === "error"} />
    </form>
  );
}
