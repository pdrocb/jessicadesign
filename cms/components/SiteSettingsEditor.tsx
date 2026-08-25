"use client";

import { useActionState, useState, type ReactNode } from "react";
import { CmsIcon } from "@/cms/components/CmsIcon";
import { CmsButton } from "@/cms/components/ui/CmsButton";
import { CmsField } from "@/cms/components/ui/CmsField";
import { CmsImageField } from "@/cms/components/ui/CmsImageField";
import { saveSiteSettings, type SiteSettingsSaveState } from "@/cms/settings/actions";
import { siteSettingsSections, type SiteSettingsDocument } from "@/cms/settings/config";

const initialState: SiteSettingsSaveState = { status: "idle", message: "" };

export function SiteSettingsEditor({ settings }: { settings: SiteSettingsDocument }) {
  const [state, action, pending] = useActionState(saveSiteSettings, initialState);
  const [openSection, setOpenSection] = useState<
    (typeof siteSettingsSections)[number]["id"] | ""
  >(siteSettingsSections[0].id);
  const [dirty, setDirty] = useState(false);
  const hasChanges = dirty || state.status === "error";

  const sectionFields = {
    seo: (
      <>
        <CmsField id="cms-siteName" name="siteName" label="Site name" defaultValue={settings.siteName} required maxLength={80} />
        <CmsField id="cms-siteUrl" name="siteUrl" label="Canonical site URL" defaultValue={settings.siteUrl} type="url" required maxLength={500} />
        <CmsField id="cms-metaTitle" name="metaTitle" label="Default meta title" defaultValue={settings.metaTitle} required maxLength={80} wide hint="Aim for 50–60 characters. Used by the home page and as the site-wide fallback." />
        <CmsField id="cms-metaDescription" name="metaDescription" label="Default meta description" defaultValue={settings.metaDescription} type="textarea" required maxLength={320} wide hint="Aim for 140–160 characters. Describe the service and location clearly." />
      </>
    ),
    sharing: (
      <>
        <CmsField id="cms-ogTitle" name="ogTitle" label="Sharing title" defaultValue={settings.ogTitle} maxLength={100} hint="Leave blank to use the default meta title." />
        <CmsField id="cms-ogDescription" name="ogDescription" label="Sharing description" defaultValue={settings.ogDescription} type="textarea" maxLength={320} wide hint="Leave blank to use the default meta description." />
        <CmsImageField
          id="cms-ogImage"
          label="Open Graph image"
          currentUrl={settings.ogImageUrl}
          urlName="ogImageUrl"
          fileName="ogImageFile"
          accept="image/jpeg,image/png,image/webp"
          hint="Recommended · 1200 × 630 px · JPG, PNG or WebP · under 4 MB"
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
        accept="image/png,image/x-icon,.ico"
        hint="Recommended · square · 512 × 512 px PNG or ICO · under 1 MB"
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
      onSubmit={() => setDirty(false)}
      className="cms-editor-form"
    >
      <div className="cms-page-heading">
        <div><h1>Site settings</h1><p>Manage search, sharing and global contact information.</p></div>
        <CmsButton className="cms-desktop-save" disabled={pending || !hasChanges} type="submit">
          {pending ? "Saving…" : hasChanges ? "Save changes" : "Saved"}
        </CmsButton>
      </div>

      {state.status === "error" ? <p className="cms-form-alert" role="alert">{state.message}</p> : null}

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

      <div className="cms-save-bar">
        <span data-dirty={hasChanges || undefined}>{hasChanges ? "Unsaved changes" : state.status === "saved" ? state.message : "Up to date"}</span>
        <CmsButton disabled={pending || !hasChanges} type="submit">
          {pending ? "Saving…" : hasChanges ? "Save changes" : "Saved"}
        </CmsButton>
      </div>
    </form>
  );
}
