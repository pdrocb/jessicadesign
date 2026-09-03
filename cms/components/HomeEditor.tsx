"use client";

import { useActionState, useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { CmsIcon } from "@/cms/components/CmsIcon";
import { CmsField } from "@/cms/components/ui/CmsField";
import { CmsImageField } from "@/cms/components/ui/CmsImageField";
import { CmsCollectionEditor } from "@/cms/components/ui/CmsCollectionEditor";
import {
  CmsFormAlert,
  CmsMobileSaveBar,
  CmsSaveButton,
  cmsNativeValidationMessage,
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
  if (fieldName.startsWith(`${HOME_TESTIMONIALS_KEY}-`)) {
    return homeSections.find((section) => section.collection === "testimonials")?.id ?? "";
  }
  if (fieldName.startsWith(`${HOME_FAQS_KEY}-`)) {
    return homeSections.find((section) => section.collection === "faqs")?.id ?? "";
  }
  return homeSections.find((section) => (
    section.fields.some((field) => field.key === fieldName || (field.type === "image" && (`${field.key}File` === fieldName || field.altKey === fieldName)))
    || section.groups?.some((group) => group.fields.some((field) => field.key === fieldName || (field.type === "image" && (`${field.key}File` === fieldName || field.altKey === fieldName))))
  ))?.id ?? "";
}

function homeFocusableField(fieldName?: string) {
  if (!fieldName) return "";
  const imageField = homeSections
    .flatMap((section) => [
      ...section.fields,
      ...(section.groups?.flatMap((group) => group.fields) ?? []),
    ])
    .find((field) => field.type === "image" && field.key === fieldName);
  return imageField ? `${imageField.key}File` : fieldName;
}

function EditorField({
  field,
  document,
  onProcessingChange,
  errorField,
  errorMessage,
}: {
  field: CmsFieldDefinition;
  document: HomeDocument;
  onProcessingChange: (processing: boolean) => void;
  errorField?: string;
  errorMessage?: string;
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
        error={errorField === field.key || errorField === `${field.key}File` ? errorMessage : undefined}
        onProcessingChange={onProcessingChange}
        alt={{
          name: field.altKey,
          value: homeText(document, field.altKey),
          required: true,
          error: errorField === field.altKey ? errorMessage : undefined,
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
      error={errorField === field.key ? errorMessage : undefined}
      wide={field.wide}
      required={field.required}
      maxLength={field.maxLength}
    />
  );
}

export function HomeEditor({ document }: { document: HomeDocument }) {
  const [state, action, pending] = useActionState(saveHome, initialState);
  const [openSection, setOpenSection] = useState(homeSections[0].id);
  const [processingImages, setProcessingImages] = useState(0);
  const [clientError, setClientError] = useState<{ field: string; message: string } | null>(null);
  const { dirty, setDirty } = useCmsEditorState(state.status);
  const previousSection = useRef(openSection);
  const invalidHandled = useRef(false);
  const onImageProcessingChange = useCallback((processing: boolean) => {
    setProcessingImages((current) => Math.max(0, current + (processing ? 1 : -1)));
  }, []);
  const imagesBusy = processingImages > 0;
  const errorField = clientError?.field ?? (state.status === "error" ? state.field : undefined);
  const errorMessage = clientError?.message ?? (state.status === "error" ? state.message : undefined);

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
    const section = state.status === "error" && state.section
      ? state.section
      : homeSectionForField(errorField);
    if (!section) return;
    const frame = window.requestAnimationFrame(() => setOpenSection(section));
    return () => window.cancelAnimationFrame(frame);
  }, [errorField, state]);

  useEffect(() => {
    if (!errorField) return;
    const frame = window.requestAnimationFrame(() => {
      const field = window.document.querySelector<HTMLElement>(`[name="${CSS.escape(homeFocusableField(errorField))}"]`);
      field?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [errorField, openSection]);

  function handleInvalid(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const control = event.target;
    if (invalidHandled.current || (!(control instanceof HTMLInputElement) && !(control instanceof HTMLTextAreaElement))) return;
    invalidHandled.current = true;
    setClientError({ field: control.name, message: cmsNativeValidationMessage(control) });
    const section = homeSectionForField(control.name);
    if (section) setOpenSection(section);
    window.requestAnimationFrame(() => {
      invalidHandled.current = false;
    });
  }

  return (
    <form
      action={action}
      onChange={(event) => {
        setDirty(true);
        const control = event.target;
        if (clientError && control instanceof HTMLElement && control.getAttribute("name") === clientError.field) {
          setClientError(null);
        }
      }}
      onInvalidCapture={handleInvalid}
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

      {errorMessage ? <CmsFormAlert focusOnMount={!errorField} heading={errorField ? "Check the highlighted field" : "Couldn’t save"} message={errorMessage} /> : null}

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
                    <EditorField field={field} document={document} key={field.key} onProcessingChange={onImageProcessingChange} errorField={errorField} errorMessage={errorMessage} />
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
                          <EditorField field={field} document={document} key={field.key} onProcessingChange={onImageProcessingChange} errorField={errorField} errorMessage={errorMessage} />
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
                      errorField={errorField}
                      errorMessage={errorMessage}
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
                      errorField={errorField}
                      errorMessage={errorMessage}
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
      <CmsUnsavedChangesGuard when={dirty || state.status === "error"} />
    </form>
  );
}
