"use client";

import { useActionState, useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { CmsIcon } from "@/cms/components/CmsIcon";
import { CmsField } from "@/cms/components/ui/CmsField";
import { CmsImageField } from "@/cms/components/ui/CmsImageField";
import {
  CmsFormAlert,
  CmsMobileSaveBar,
  CmsSaveButton,
  cmsNativeValidationMessage,
  useCmsEditorState,
} from "@/cms/components/ui/CmsEditorChrome";
import { CmsPageHeader } from "@/cms/components/ui/CmsPageHeader";
import { CmsUnsavedChangesGuard } from "@/cms/components/ui/CmsUnsavedChangesGuard";
import { saveSiteSettings, type SiteSettingsSaveState } from "@/cms/settings/actions";
import { siteSettingsSections, type SiteSettingsDocument } from "@/cms/settings/config";

const initialState: SiteSettingsSaveState = { status: "idle", message: "" };

const settingsFieldSections = {
  siteName: "identity",
  siteUrl: "identity",
  ogTitle: "sharing",
  ogImageUrl: "sharing",
  ogImageFile: "sharing",
  ogImageAlt: "sharing",
  faviconUrl: "browser",
  faviconFile: "browser",
  phone: "contact",
  publicEmail: "contact",
  instagram: "contact",
  facebook: "contact",
} as const;

const settingsFocusableFields: Record<string, string> = {
  ogImageUrl: "ogImageFile",
  faviconUrl: "faviconFile",
};

export function SiteSettingsEditor({ settings }: { settings: SiteSettingsDocument }) {
  const [state, action, pending] = useActionState(saveSiteSettings, initialState);
  const [openSection, setOpenSection] = useState<
    (typeof siteSettingsSections)[number]["id"] | ""
  >(siteSettingsSections[0].id);
  const [processingImages, setProcessingImages] = useState(0);
  const [clientError, setClientError] = useState<{ field: string; message: string } | null>(null);
  const { dirty, setDirty } = useCmsEditorState(state.status);
  const invalidHandled = useRef(false);
  const hasChanges = dirty || state.status === "error";
  const onImageProcessingChange = useCallback((processing: boolean) => {
    setProcessingImages((current) => Math.max(0, current + (processing ? 1 : -1)));
  }, []);
  const imagesBusy = processingImages > 0;
  const errorField = clientError?.field ?? (state.status === "error" ? state.field : undefined);
  const errorMessage = clientError?.message ?? (state.status === "error" ? state.message : undefined);

  useEffect(() => {
    if (!errorField) return;
    const section = settingsFieldSections[errorField as keyof typeof settingsFieldSections];
    if (!section) return;
    const frame = window.requestAnimationFrame(() => setOpenSection(section));
    return () => window.cancelAnimationFrame(frame);
  }, [errorField]);

  useEffect(() => {
    if (!errorField) return;
    const frame = window.requestAnimationFrame(() => {
      const focusName = settingsFocusableFields[errorField] ?? errorField;
      const field = window.document.querySelector<HTMLElement>(`[name="${CSS.escape(focusName)}"]`);
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
    const section = settingsFieldSections[control.name as keyof typeof settingsFieldSections];
    if (section) setOpenSection(section);
    window.requestAnimationFrame(() => {
      invalidHandled.current = false;
    });
  }

  const sectionFields = {
    identity: (
      <>
        <CmsField id="cms-siteName" name="siteName" label="Site name" defaultValue={settings.siteName} required maxLength={80} error={errorField === "siteName" ? errorMessage : undefined} />
        <CmsField id="cms-siteUrl" name="siteUrl" label="Primary website address" defaultValue={settings.siteUrl} type="url" required maxLength={500} error={errorField === "siteUrl" ? errorMessage : undefined} />
      </>
    ),
    sharing: (
      <>
        <CmsField id="cms-ogTitle" name="ogTitle" label="Sharing title" defaultValue={settings.ogTitle} required maxLength={100} wide hint="Used for every page when its link is shared." error={errorField === "ogTitle" ? errorMessage : undefined} />
        <CmsImageField
          id="cms-ogImage"
          label="Social sharing image"
          currentUrl={settings.ogImageUrl}
          urlName="ogImageUrl"
          fileName="ogImageFile"
          accept="image/jpeg,image/png,image/webp"
          maximumEdge={1200}
          onProcessingChange={onImageProcessingChange}
          hint="Current image is the site default · 1200 × 630 px recommended · input up to 10 MB · converted to WebP before upload"
          error={errorField === "ogImageUrl" || errorField === "ogImageFile" ? errorMessage : undefined}
          alt={{ name: "ogImageAlt", value: settings.ogImageAlt, required: Boolean(settings.ogImageUrl), error: errorField === "ogImageAlt" ? errorMessage : undefined }}
        />
      </>
    ),
    browser: (
      <CmsImageField
        id="cms-favicon"
        label="Favicon"
        currentUrl={settings.faviconUrl}
        urlName="faviconUrl"
        fileName="faviconFile"
        accept="image/jpeg,image/png,image/webp"
        maximumEdge={512}
        onProcessingChange={onImageProcessingChange}
        hint="Recommended · square · 512 × 512 px · input up to 10 MB · converted to WebP before upload"
        error={errorField === "faviconUrl" || errorField === "faviconFile" ? errorMessage : undefined}
      />
    ),
    contact: (
      <>
        <CmsField id="cms-phone" name="phone" label="Contact phone" defaultValue={settings.phone} maxLength={40} error={errorField === "phone" ? errorMessage : undefined} />
        <CmsField id="cms-publicEmail" name="publicEmail" label="Public email" defaultValue={settings.publicEmail} type="email" maxLength={160} hint="Optional. Leave blank until a public inbox is confirmed." error={errorField === "publicEmail" ? errorMessage : undefined} />
        <CmsField id="cms-instagram" name="instagram" label="Instagram URL" defaultValue={settings.instagram} type="url" maxLength={500} error={errorField === "instagram" ? errorMessage : undefined} />
        <CmsField id="cms-facebook" name="facebook" label="Facebook URL" defaultValue={settings.facebook} type="url" maxLength={500} error={errorField === "facebook" ? errorMessage : undefined} />
      </>
    ),
  } satisfies Record<(typeof siteSettingsSections)[number]["id"], ReactNode>;

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
        title="Site settings"
        description="Manage site identity, global sharing media and contact information."
        actions={
          <>
            <a className="cms-secondary-link" href="/" target="_blank" rel="noreferrer">View live site</a>
            <CmsSaveButton className="cms-desktop-save" dirty={hasChanges} pending={pending} disabled={imagesBusy} />
          </>
        }
      />

      {errorMessage ? <CmsFormAlert focusOnMount={!errorField} heading={errorField ? "Check the highlighted field" : "Couldn’t save"} message={errorMessage} /> : null}

      <div className="cms-section-list">
        {siteSettingsSections.map((section) => {
          const isOpen = openSection === section.id;
          return (
            <section className="cms-editor-card" data-open={isOpen || undefined} key={section.id}>
              <button className="cms-card-heading" type="button" aria-expanded={isOpen} onClick={() => setOpenSection(isOpen ? "" : section.id)}>
                <span><strong>{section.title}</strong><small>{section.description}</small></span>
                <span className="cms-disclosure" data-open={isOpen || undefined}><CmsIcon name="toggle" /></span>
              </button>
              <div className="cms-card-fields">{sectionFields[section.id]}</div>
            </section>
          );
        })}
      </div>

      <CmsMobileSaveBar
        dirty={hasChanges}
        pending={pending}
        status={state.status}
        message={state.message}
        disabled={imagesBusy}
      />
      <CmsUnsavedChangesGuard when={hasChanges} />
    </form>
  );
}
