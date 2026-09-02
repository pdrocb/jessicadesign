"use client";

import { useState, useTransition } from "react";
import { CmsConfirmDialog } from "@/cms/components/ui/CmsConfirmDialog";
import { CmsIcon } from "@/cms/components/CmsIcon";
import { deleteProject } from "@/cms/projects/actions";

export function ProjectDeleteControl({
  projectId,
  projectTitle,
  imageCount,
  disabled,
}: {
  projectId: string;
  projectTitle: string;
  imageCount: number;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  function confirmDelete() {
    setError(undefined);
    startTransition(async () => {
      try {
        await deleteProject(projectId);
        setOpen(false);
      } catch {
        setError("The project could not be deleted. Please try again.");
        setOpen(false);
      }
    });
  }

  return (
    <>
      <button
        className="cms-project-delete"
        type="button"
        disabled={disabled || pending}
        onClick={() => {
          setError(undefined);
          setOpen(true);
        }}
      >
        <CmsIcon name="trash" />
        <span>Delete project</span>
      </button>
      {error ? <span className="cms-project-delete-error" role="alert">{error}</span> : null}
      <CmsConfirmDialog
        open={open}
        title={`Delete “${projectTitle}”?`}
        description={`This permanently removes the project, its ${imageCount} ${imageCount === 1 ? "photograph" : "photographs"}, their database records, and their files from image storage. This action cannot be undone.`}
        confirmLabel="Delete project"
        pending={pending}
        onCancel={() => setOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
