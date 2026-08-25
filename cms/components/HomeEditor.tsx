"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CmsIcon } from "@/cms/components/CmsIcon";
import { CmsButton } from "@/cms/components/ui/CmsButton";
import { CmsField } from "@/cms/components/ui/CmsField";
import { CmsImageField } from "@/cms/components/ui/CmsImageField";
import { CmsCollectionEditor } from "@/cms/components/ui/CmsCollectionEditor";
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

function EditorField({
  field,
  document,
}: {
  field: CmsFieldDefinition;
  document: HomeDocument;
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
  const [dirty, setDirty] = useState(false);
  const initialSection = useRef(true);

  const saved = state.status === "saved" && !dirty;
  const testimonials = homeTestimonials(document, []);
  const faqs = homeFaqs(document, []);

  useEffect(() => {
    if (initialSection.current) {
      initialSection.current = false;
      return;
    }
    if (!openSection) return;

    const section = window.document.getElementById(`cms-section-${openSection}`);
    if (!section) return;

    section.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  }, [openSection]);

  return (
    <form
      action={async (formData) => {
        await action(formData);
        setDirty(false);
      }}
      onChange={() => setDirty(true)}
      className="cms-editor-form"
    >
      <div className="cms-page-heading">
        <div>
          <h1>Home</h1>
          <p>Edit the copy and imagery on the public home page.</p>
        </div>
        <CmsButton className="cms-desktop-save" disabled={pending || !dirty} type="submit">
          {pending ? "Saving…" : dirty ? "Save changes" : "Saved"}
        </CmsButton>
      </div>

      {state.status === "error" ? <p className="cms-form-alert" role="alert">{state.message}</p> : null}

      <div className="cms-section-list">
        {homeSections.map((section) => {
          const isOpen = openSection === section.id;
          return (
            <section
              className="cms-editor-card"
              data-open={isOpen || undefined}
              id={`cms-section-${section.id}`}
              key={section.id}
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
                  <EditorField field={field} document={document} key={field.key} />
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
                        <EditorField field={field} document={document} key={field.key} />
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
          );
        })}
      </div>

      <div className="cms-save-bar">
        <span data-dirty={dirty || undefined}>{dirty ? "Unsaved changes" : saved ? state.message : "Up to date"}</span>
        <CmsButton disabled={pending || !dirty} type="submit">
          {pending ? "Saving…" : dirty ? "Save changes" : "Saved"}
        </CmsButton>
      </div>
    </form>
  );
}
