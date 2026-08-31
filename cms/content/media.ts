const nextBuildAssetPrefix = "/_next/";
const vercelBlobHostSuffix = ".public.blob.vercel-storage.com";

/**
 * CMS documents may only persist URLs that survive a new deployment.
 * Static imports resolve to build-specific `/_next/` paths and therefore
 * remain fallbacks in code instead of becoming database content.
 */
export function isPersistentCmsImageSource(value: string) {
  if (value.startsWith("/")) return !value.startsWith(nextBuildAssetPrefix);
  if (!URL.canParse(value)) return false;

  const url = new URL(value);
  return url.protocol === "https:" && url.hostname.endsWith(vercelBlobHostSuffix);
}
