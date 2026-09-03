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
      {state.status === "error" ? <CmsFormAlert message={state.message} /> : null}

      <section className="cms-new-project-panel" aria-labelledby="cms-new-project-details">
        <div className="cms-new-project-copy">
          <h2 id="cms-new-project-details">Project foundation</h2>
          <p>You can add venue, location, photography credit and the rest of the gallery after creation.</p>
        </div>
        <div className="cms-new-project-fields">
          <CmsField id="cms-new-project-title" name="title" label="Project title" required maxLength={160} disabled={!connected} />
          <div className="cms-new-project-cover">
            <div className="cms-new-project-preview">
              {preview ? <Image src={preview} alt="Selected cover preview" fill sizes="(max-width: 760px) 100vw, 420px" unoptimized /> : <span>Choose the first photograph</span>}
            </div>
            <div>
              <strong>Cover photograph</strong>
              <p>JPG or WebP · optimized before upload · up to 10 MB after processing.</p>
              <label className="cms-file-button">
                {preview ? "Choose another" : "Choose photograph"}
                <input className="cms-file-input" type="file" accept="image/jpeg,image/webp" disabled={!connected || optimizing || pending} onChange={chooseCover} />
              </label>
              {fileMessage ? <small data-error={!file || undefined}>{fileMessage}</small> : null}
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
      <CmsUnsavedChangesGuard when={dirty && !pending} />
    </form>
  );
}
