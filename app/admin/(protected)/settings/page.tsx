import { SiteSettingsEditor } from "@/cms/components/SiteSettingsEditor";
import { getSiteSettings } from "@/cms/settings/repository";

export default async function SettingsPage() {
  const settings = await getSiteSettings();
  return <SiteSettingsEditor settings={settings} />;
}
