"use client";

import { useEffect, useState } from "react";
import { CmsButton } from "@/cms/components/ui/CmsButton";

export type CmsEditorStatus = "idle" | "saved" | "error";

export function useCmsEditorState(status: CmsEditorStatus) {
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (status !== "saved") return;
    const frame = window.requestAnimationFrame(() => setDirty(false));
    return () => window.cancelAnimationFrame(frame);
  }, [status]);

  return { dirty, setDirty };
}

function saveLabel({
  dirty,
  pending,
  idleLabel,
}: {
  dirty: boolean;
  pending: boolean;
  idleLabel: string;
}) {
  if (pending) return "Saving…";
  if (dirty) return idleLabel;
  return "Saved";
}

export function CmsSaveButton({
  dirty,
  pending,
  form,
  idleLabel = "Save changes",
  disabled = false,
  className,
}: {
  dirty: boolean;
  pending: boolean;
  form?: string;
  idleLabel?: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <CmsButton
      className={className}
      disabled={disabled || pending || !dirty}
      form={form}
      type="submit"
    >
      {saveLabel({ dirty, pending, idleLabel })}
    </CmsButton>
  );
}

export function CmsMobileSaveBar({
  dirty,
  pending,
  status,
  message,
  form,
  idleLabel = "Save changes",
  disabled = false,
}: {
  dirty: boolean;
  pending: boolean;
  status: CmsEditorStatus;
  message?: string;
  form?: string;
  idleLabel?: string;
  disabled?: boolean;
}) {
  const label = pending
    ? "Saving changes"
    : status === "error"
      ? "Couldn’t save"
      : dirty
        ? "Unsaved changes"
        : status === "saved"
          ? message || "Changes saved"
          : "Up to date";

  return (
    <div className="cms-save-bar" aria-live="polite">
      <span data-state={status === "error" ? "error" : dirty ? "dirty" : "saved"}>{label}</span>
      <CmsSaveButton
        dirty={dirty || status === "error"}
        pending={pending}
        form={form}
        idleLabel={idleLabel}
        disabled={disabled}
      />
    </div>
  );
}

export function CmsFormAlert({ message }: { message: string }) {
  return <p className="cms-form-alert" role="alert">{message}</p>;
}
