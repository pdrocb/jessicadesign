"use client";

import { useEffect, useId, useRef } from "react";
import { CmsIcon, type CmsIconName } from "@/cms/components/CmsIcon";

type CmsConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  pending?: boolean;
  pendingLabel?: string;
  tone?: "danger" | "neutral";
  icon?: CmsIconName;
  onCancel: () => void;
  onConfirm: () => void;
};

export function CmsConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  pending = false,
  pendingLabel = "Working…",
  tone = "danger",
  icon = "trash",
  onCancel,
  onConfirm,
}: CmsConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      cancelRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }

    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="cms-confirm-dialog"
      data-tone={tone}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        if (!pending) onCancel();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !pending) onCancel();
      }}
    >
      <div className="cms-confirm-dialog-icon"><CmsIcon name={icon} /></div>
      <div className="cms-confirm-dialog-copy">
        <h2 id={titleId}>{title}</h2>
        <p id={descriptionId}>{description}</p>
      </div>
      <div className="cms-confirm-dialog-actions">
        <button ref={cancelRef} className="cms-confirm-cancel" type="button" disabled={pending} onClick={onCancel}>Cancel</button>
        <button className="cms-confirm-delete" type="button" disabled={pending} onClick={onConfirm}>{pending ? pendingLabel : confirmLabel}</button>
      </div>
    </dialog>
  );
}
