export const PRODUCTION_INQUIRY_HOSTNAME = "www.jessicasalomondesigns.com";
export const DEVELOPMENT_INQUIRY_RECIPIENT = "pedro@productpedro.com";

export function resolveInternalInquiryRecipient(
  requestUrl: string,
  productionRecipient: string,
) {
  try {
    const hostname = new URL(requestUrl).hostname.toLowerCase();
    return hostname === PRODUCTION_INQUIRY_HOSTNAME
      ? productionRecipient
      : DEVELOPMENT_INQUIRY_RECIPIENT;
  } catch {
    return DEVELOPMENT_INQUIRY_RECIPIENT;
  }
}
