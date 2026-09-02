"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { ProjectDeleteControl } from "@/cms/components/ProjectDeleteControl";
import { ProjectImageManager } from "@/cms/components/ProjectImageManager";
import {
  CmsFormAlert,
  CmsMobileSaveBar,
  CmsSaveButton,
  useCmsEditorState,
} from "@/cms/components/ui/CmsEditorChrome";
import { CmsField } from "@/cms/components/ui/CmsField";
import { CmsUnsavedChangesGuard } from "@/cms/components/ui/CmsUnsavedChangesGuard";
import { saveProject, type ProjectSaveState } from "@/cms/projects/actions";
import type { LookbookProject } from "@/lib/lookbook";

const initialState: ProjectSaveState = { status: "idle", message: "" };

export function ProjectEditor({ project, connected }: { project: LookbookProject; connected: boolean }) {
  const saveAction = saveProject.bind(null, project.id);
  const formId = `${project.id}-form`;
  const [state, action, pending] = useActionState(saveAction, initialState);
  const { dirty, setDirty } = useCmsEditorState(state.status);
  const hasChanges = dirty || state.status === "error";

  useEffect(() => {
    if (state.status !== "error" || !state.field) return;
    const frame = window.requestAnimationFrame(() => {
      const field = window.document.querySelector<HTMLElement>(`[name="${CSS.escape(state.field ?? "")}"]`);
      field?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [state]);

  return (
    <div className="cms-project-editor">
      <header className="cms-project-command-bar">
        <Link className="cms-project-editor-back" href="/admin/projects">All projects</Link>
        <div className="cms-project-command-actions">
          <a className="cms-secondary-link" href={`/look-book#${project.slug}`} target="_blank" rel="noreferrer">View live project</a>
          <Link className="cms-project-cancel" href="/admin/projects">Cancel</Link>
          <CmsSaveButton
            dirty={hasChanges}
            pending={pending}
            form={formId}
            idleLabel="Save project"
            disabled={!connected}
          />
        </div>
      </header>
      {!connected ? (
        <p className="cms-connection-note">Previewing the current project. Connect Neon to enable editing.</p>
      ) : null}
      {state.status === "error" ? <CmsFormAlert message={state.message} /> : null}
      <form
        id={formId}
        action={action}
        className="cms-project-form"
        onChange={() => setDirty(true)}
      >
        <section className="cms-project-metadata" aria-labelledby={`${project.id}-details-heading`}>
          <div className="cms-project-section-heading">
            <div>
              <h1 id={`${project.id}-details-heading`}>Project details</h1>
              <p>These details appear alongside the project in the public Look Book.</p>
            </div>
          </div>
          <div className="cms-project-metadata-fields">
            <CmsField id={`${project.id}-title`} name="title" label="Title" defaultValue={project.title} disabled={!connected} wide />
            <CmsField id={`${project.id}-subtitle`} name="subtitle" label="Subtitle" defaultValue={project.subtitle ?? ""} disabled={!connected} />
            <CmsField id={`${project.id}-venue`} name="venue" label="Venue" defaultValue={project.venue ?? ""} disabled={!connected} />
            <CmsField id={`${project.id}-location`} name="location" label="Location" defaultValue={project.location ?? ""} disabled={!connected} />
            <CmsField id={`${project.id}-photographer`} name="photographer" label="Photography" defaultValue={project.photographer ?? ""} disabled={!connected} />
          </div>
        </section>
        <ProjectImageManager
          projectId={project.id}
          coverImageId={project.coverImageId}
          images={project.images}
          connected={connected}
        />
      </form>
      <CmsMobileSaveBar
        dirty={hasChanges}
        pending={pending}
        status={state.status}
        message={state.message}
        form={formId}
        idleLabel="Save project"
        disabled={!connected}
      />
      <CmsUnsavedChangesGuard when={dirty && !pending} />
      <section className="cms-project-danger-zone" aria-labelledby={`${project.id}-delete-heading`}>
        <div>
          <h2 id={`${project.id}-delete-heading`}>Delete project</h2>
          <p>Permanently remove this project and all of its photographs. This action cannot be undone.</p>
        </div>
        <ProjectDeleteControl
          projectId={project.id}
          projectTitle={project.title}
          imageCount={project.images.length}
          disabled={!connected}
        />
      </section>
    </div>
  );
}
