export type HomeTestimonial = {
  id: string;
  text: string;
  who: string;
};

export type HomeFaq = {
  id: string;
  q: string;
  a: string;
};

export type HomeDocumentValue = string | HomeTestimonial[] | HomeFaq[];
export type HomeDocument = Record<string, HomeDocumentValue>;

export const HOME_TESTIMONIALS_KEY = "testimonials.items";
export const HOME_FAQS_KEY = "faqs.items";

export function homeText(
  document: HomeDocument | undefined,
  key: string,
  fallback = "",
) {
  const value = document?.[key];
  return typeof value === "string" && value ? value : fallback;
}

export function homeTestimonials(
  document: HomeDocument | undefined,
  fallback: readonly HomeTestimonial[],
) {
  const value = document?.[HOME_TESTIMONIALS_KEY];
  return Array.isArray(value) && value.length > 0 ? value as HomeTestimonial[] : [...fallback];
}

export function homeFaqs(
  document: HomeDocument | undefined,
  fallback: readonly HomeFaq[],
) {
  const value = document?.[HOME_FAQS_KEY];
  return Array.isArray(value) && value.length > 0 ? value as HomeFaq[] : [...fallback];
}
