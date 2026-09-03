"use client";

import { useActionState, useCallback, useEffect, useState, type ReactNode } from "react";
import { CmsIcon } from "@/cms/components/CmsIcon";
import { CmsField } from "@/cms/components/ui/CmsField";
import { CmsImageField } from "@/cms/components/ui/CmsImageField";
import {
  CmsFormAlert,
  CmsMobileSaveBar,
  CmsSaveButton,
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

export function SiteSettingsEditor({ settings }: { settings: SiteSettingsDocument }) {
  const [state, action, pending] = useActionState(saveSiteSettings, initialState);
  const [openSection, setOpenSection] = useState<
    (typeof siteSettingsSections)[number]["id"] | ""
  >(siteSettingsSections[0].id);
  const [processingImages, setProcessingImages] = useState(0);
  const { dirty, setDirty } = useCmsEditorState(state.status);
  const hasChanges = dirty || state.status === "error";
  const onImageProcessingChange = useCallback((processing: boolean) => {
    setProcessingImages((current) => Math.max(0, current + (processing ? 1 : -1)));
  }, []);
  const imagesBusy = processingImages > 0;

  useEffect(() => {
    if (state.status !== "error" || !state.field) return;
    const section = settingsFieldSections[state.field as keyof typeof settingsFieldSections];
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

  const sectionFields = {
    identity: (
      <>
        <CmsField id="cms-siteName" name="siteName" label="Site name" defaultValue={settings.siteName} required maxLength={80} />
        <CmsField id="cms-siteUrl" name="siteUrl" label="Primary website address" defaultValue={settings.siteUrl} type="url" required maxLength={500} />
      </>
    ),
    sharing: (
      <>
        <CmsField id="cms-ogTitle" name="ogTitle" label="Sharing title" defaultValue={settings.ogTitle} required maxLength={100} wide hint="Used for every page when its link is shared." />
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
          alt={{ name: "ogImageAlt", value: settings.ogImageAlt, required: Boolean(settings.ogImageUrl) }}
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
      />
    ),
    contact: (
      <>
        <CmsField id="cms-phone" name="phone" label="Contact phone" defaultValue={settings.phone} maxLength={40} />
        <CmsField id="cms-publicEmail" name="publicEmail" label="Public email" defaultValue={settings.publicEmail} type="email" maxLength={160} hint="Optional. Leave blank until a public inbox is confirmed." />
        <CmsField id="cms-instagram" name="instagram" label="Instagram URL" defaultValue={settings.instagram} type="url" maxLength={500} />
        <CmsField id="cms-facebook" name="facebook" label="Facebook URL" defaultValue={settings.facebook} type="url" maxLength={500} />
      </>
    ),
  } satisfies Record<(typeof siteSettingsSections)[number]["id"], ReactNode>;

  return (
    <form
      action={action}
      onChange={() => setDirty(true)}
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

      {state.status === "error" ? <CmsFormAlert message={state.message} /> : null}

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
      <CmsUnsavedChangesGuard when={dirty && !pending} />
    </form>
  );
}
