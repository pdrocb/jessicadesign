"use client";

import { useEffect, useId, useRef, useState } from "react";
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
      aria-busy={pending || undefined}
      aria-live="polite"
      className={className}
      disabled={disabled || pending || !dirty}
      form={form}
      type="submit"
    >
      {saveLabel({ dirty, pending, idleLabel })}
    </CmsButton>
  );
}

export function cmsNativeValidationMessage(
  control: HTMLInputElement | HTMLTextAreaElement,
) {
  if (control.validity.valueMissing) return "Complete this required field.";
  if (control.validity.typeMismatch && control.type === "email") return "Enter a valid email address.";
  if (control.validity.typeMismatch && control.type === "url") return "Enter a complete http or https address.";
  if (control.validity.tooLong) return `Keep this field under ${control.maxLength} characters.`;
  return control.validationMessage || "Check this field and try again.";
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

export function CmsFormAlert({
  message,
  id,
  heading,
  focusOnMount = false,
}: {
  message: string;
  id?: string;
  heading?: string;
  focusOnMount?: boolean;
}) {
  const generatedId = useId();
  const headingId = heading ? `${id ?? generatedId}-heading` : undefined;
  const alertRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusOnMount) alertRef.current?.focus();
  }, [focusOnMount, message]);

  if (heading) {
    return (
      <div
        aria-labelledby={headingId}
        className="cms-form-alert"
        id={id}
        ref={alertRef}
        role="alert"
        tabIndex={-1}
      >
        <strong id={headingId}>{heading}</strong>
        <p>{message}</p>
      </div>
    );
  }

  return (
    <div className="cms-form-alert" id={id} ref={alertRef} role="alert" tabIndex={-1}>
      {message}
    </div>
  );
}
