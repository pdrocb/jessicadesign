"use client";

import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import { CmsIcon } from "@/cms/components/CmsIcon";
import { CmsField } from "@/cms/components/ui/CmsField";
import { CmsImageField } from "@/cms/components/ui/CmsImageField";
import { CmsCollectionEditor } from "@/cms/components/ui/CmsCollectionEditor";
import {
  CmsFormAlert,
  CmsMobileSaveBar,
  CmsSaveButton,
  useCmsEditorState,
} from "@/cms/components/ui/CmsEditorChrome";
import { CmsPageHeader } from "@/cms/components/ui/CmsPageHeader";
import { CmsUnsavedChangesGuard } from "@/cms/components/ui/CmsUnsavedChangesGuard";
import { homeSections, type CmsFieldDefinition } from "@/cms/config/site";
import { saveHome, type SaveState } from "@/cms/content/actions";
import type { HomeDocument } from "@/cms/content/home";
import {
  HOME_FAQS_KEY,
  HOME_TESTIMONIALS_KEY,
  homeFaqs,
  homeTestimonials,
  homeText,
} from "@/cms/content/model";

const initialState: SaveState = { status: "idle", message: "" };

const homeChapters = new Map([
  ["hero", "Opening"],
  ["expertise", "Services"],
  ["founder", "Story & proof"],
  ["closing-cta", "Closing"],
]);

function homeSectionForField(fieldName?: string) {
  if (!fieldName) return "";
  return homeSections.find((section) => (
    section.fields.some((field) => field.key === fieldName || (field.type === "image" && (`${field.key}File` === fieldName || field.altKey === fieldName)))
    || section.groups?.some((group) => group.fields.some((field) => field.key === fieldName || (field.type === "image" && (`${field.key}File` === fieldName || field.altKey === fieldName))))
  ))?.id ?? "";
}

function EditorField({
  field,
  document,
  onProcessingChange,
}: {
  field: CmsFieldDefinition;
  document: HomeDocument;
  onProcessingChange: (processing: boolean) => void;
}) {
  if (field.type === "image") {
    return (
      <CmsImageField
        id={`cms-${field.key}`}
        label={field.label}
        currentUrl={homeText(document, field.key)}
        urlName={field.key}
        fileName={`${field.key}File`}
        accept={field.accept}
        hint={field.hint}
        onProcessingChange={onProcessingChange}
        alt={{
          name: field.altKey,
          value: homeText(document, field.altKey),
          required: true,
        }}
      />
    );
  }

  return (
    <CmsField
      id={`cms-${field.key}`}
      name={field.key}
      label={field.label}
      defaultValue={homeText(document, field.key)}
      type={field.type}
      hint={field.hint}
      wide={field.wide}
    />
  );
}

export function HomeEditor({ document }: { document: HomeDocument }) {
  const [state, action, pending] = useActionState(saveHome, initialState);
  const [openSection, setOpenSection] = useState(homeSections[0].id);
  const [processingImages, setProcessingImages] = useState(0);
  const { dirty, setDirty } = useCmsEditorState(state.status);
  const previousSection = useRef(openSection);
  const onImageProcessingChange = useCallback((processing: boolean) => {
    setProcessingImages((current) => Math.max(0, current + (processing ? 1 : -1)));
  }, []);
  const imagesBusy = processingImages > 0;

  const testimonials = homeTestimonials(document, []);
  const faqs = homeFaqs(document, []);

  useEffect(() => {
    if (previousSection.current === openSection) return;
    previousSection.current = openSection;
    if (!openSection) return;

    const section = window.document.getElementById(`cms-section-${openSection}`);
    if (!section) return;

    section.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  }, [openSection]);

  useEffect(() => {
    if (state.status !== "error") return;
    const section = state.section || homeSectionForField(state.field);
    if (!section) return;
    const frame = window.requestAnimationFrame(() => setOpenSection(section));
    return () => window.cancelAnimationFrame(frame);
  }, [state]);

  useEffect(() => {
    if (state.status !== "error" || !state.field) return;
    const frame = window.requestAnimationFrame(() => {
      const field = window.document.querySelector<HTMLElement>(`[name="${CSS.escape(state.field ?? "")}"]`);
      field?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [openSection, state]);

  return (
    <form
      action={action}
      onChange={() => setDirty(true)}
      className="cms-editor-form"
    >
      <CmsPageHeader
        title="Home"
        description="Edit the copy and imagery on the public home page."
        actions={
          <>
            <a className="cms-secondary-link" href="/" target="_blank" rel="noreferrer">View live page</a>
            <CmsSaveButton
              className="cms-desktop-save"
              dirty={dirty || state.status === "error"}
              pending={pending}
              disabled={imagesBusy}
            />
          </>
        }
      />

      {state.status === "error" ? <CmsFormAlert message={state.message} /> : null}

      <div className="cms-section-list">
        {homeSections.map((section) => {
          const chapter = homeChapters.get(section.id);
          const isOpen = openSection === section.id;
          return (
            <div className="cms-section-entry" id={`cms-section-${section.id}`} key={section.id}>
              {chapter ? <h2 className="cms-section-chapter">{chapter}</h2> : null}
              <section
                className="cms-editor-card"
                data-open={isOpen || undefined}
              >
                <button
                  className="cms-card-heading"
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenSection(isOpen ? "" : section.id)}
                >
                  <span><strong>{section.title}</strong><small>{section.description}</small></span>
                  <span className="cms-disclosure" data-open={isOpen || undefined}><CmsIcon name="toggle" /></span>
                </button>
                <div className="cms-card-fields">
                  {section.fields.map((field) => (
                    <EditorField field={field} document={document} key={field.key} onProcessingChange={onImageProcessingChange} />
                  ))}
                  {section.groups?.map((group) => (
                    <div
                      className="cms-fixed-group"
                      role="group"
                      aria-labelledby={`cms-group-${group.id}`}
                      key={group.id}
                    >
                      <div className="cms-fixed-group-heading">
                        <h3 id={`cms-group-${group.id}`}>{group.label}</h3>
                        {group.description ? <small>{group.description}</small> : null}
                      </div>
                      <div className="cms-fixed-group-fields">
                        {group.fields.map((field) => (
                          <EditorField field={field} document={document} key={field.key} onProcessingChange={onImageProcessingChange} />
                        ))}
                      </div>
                    </div>
                  ))}
                  {section.collection === "testimonials" ? (
                    <CmsCollectionEditor
                      name={HOME_TESTIMONIALS_KEY}
                      itemLabel="Testimonial"
                      addLabel="Add testimonial"
                      initialItems={testimonials}
                      fields={[
                        { key: "text", label: "Quote", type: "textarea", rows: 5, maxLength: 5000 },
                        { key: "who", label: "Attribution", type: "text", maxLength: 500 },
                      ]}
                      createItem={(id) => ({ id, text: "", who: "" })}
                      onDirty={() => setDirty(true)}
                    />
                  ) : null}
                  {section.collection === "faqs" ? (
                    <CmsCollectionEditor
                      name={HOME_FAQS_KEY}
                      itemLabel="FAQ"
                      addLabel="Add FAQ"
                      initialItems={faqs}
                      fields={[
                        { key: "q", label: "Question", type: "text", maxLength: 500 },
                        { key: "a", label: "Answer", type: "textarea", rows: 5, maxLength: 5000 },
                      ]}
                      createItem={(id) => ({ id, q: "", a: "" })}
                      onDirty={() => setDirty(true)}
                    />
                  ) : null}
                </div>
              </section>
            </div>
          );
        })}
      </div>

      <CmsMobileSaveBar
        dirty={dirty || state.status === "error"}
        pending={pending}
        status={state.status}
        message={state.message}
        disabled={imagesBusy}
      />
      <CmsUnsavedChangesGuard when={dirty && !pending} />
    </form>
  );
}
