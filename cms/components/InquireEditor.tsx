"use client";

import { useActionState, useEffect } from "react";
import { CmsField } from "@/cms/components/ui/CmsField";
import {
  CmsFormAlert,
  CmsMobileSaveBar,
  CmsSaveButton,
  useCmsEditorState,
} from "@/cms/components/ui/CmsEditorChrome";
import { CmsPageHeader } from "@/cms/components/ui/CmsPageHeader";
import { CmsUnsavedChangesGuard } from "@/cms/components/ui/CmsUnsavedChangesGuard";
import {
  saveInquire,
  type InquireSaveState,
} from "@/cms/content/inquire-actions";
import type { InquireDocument } from "@/cms/content/inquire";

const initialState: InquireSaveState = { status: "idle", message: "" };

export function InquireEditor({ document }: { document: InquireDocument }) {
  const [state, action, pending] = useActionState(saveInquire, initialState);
  const { dirty, setDirty } = useCmsEditorState(state.status);
  const hasChanges = dirty || state.status === "error";

  useEffect(() => {
    if (state.status !== "error" || !state.field) return;
    const frame = window.requestAnimationFrame(() => {
      window.document.querySelector<HTMLElement>(
        `[name="${CSS.escape(state.field ?? "")}"]`,
      )?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [state]);

  return (
    <form action={action} onChange={() => setDirty(true)} className="cms-editor-form">
      <CmsPageHeader
        title="Inquire"
        description="Edit the page introduction and its search result information."
        actions={
          <>
            <a className="cms-secondary-link" href="/inquire" target="_blank" rel="noreferrer">
              View live page
            </a>
            <CmsSaveButton
              className="cms-desktop-save"
              dirty={hasChanges}
              pending={pending}
            />
          </>
        }
      />

      {state.status === "error" ? <CmsFormAlert message={state.message} /> : null}

      <div className="cms-section-list">
        <section className="cms-editor-card" data-open>
          <div className="cms-card-heading cms-card-heading-static">
            <span>
              <strong>Page introduction</strong>
              <small>These two lines appear before the form.</small>
            </span>
          </div>
          <div className="cms-card-fields">
            <CmsField
              id="cms-inquire-heading"
              name="heading"
              label="Heading"
              defaultValue={document.heading}
              required
              maxLength={160}
              wide
            />
            <CmsField
              id="cms-inquire-introduction"
              name="introduction"
              label="Introduction"
              defaultValue={document.introduction}
              type="textarea"
              rows={3}
              required
              maxLength={500}
              wide
            />
          </div>
        </section>

        <section className="cms-editor-card" data-open>
          <div className="cms-card-heading cms-card-heading-static">
            <span>
              <strong>SEO</strong>
              <small>Title and description shown in search results.</small>
            </span>
          </div>
          <div className="cms-card-fields">
            <CmsField
              id="cms-inquire-meta-title"
              name="metaTitle"
              label="Meta title"
              defaultValue={document.metaTitle}
              required
              maxLength={80}
              wide
              hint="Aim for 50–60 characters."
            />
            <CmsField
              id="cms-inquire-meta-description"
              name="metaDescription"
              label="Meta description"
              defaultValue={document.metaDescription}
              type="textarea"
              rows={3}
              required
              maxLength={320}
              wide
              hint="Aim for 140–160 characters."
            />
          </div>
        </section>
      </div>

      <CmsMobileSaveBar
        dirty={hasChanges}
        pending={pending}
        status={state.status}
        message={state.message}
      />
      <CmsUnsavedChangesGuard when={dirty && !pending} />
    </form>
  );
}
