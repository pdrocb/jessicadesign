import {
  faqs,
  founderStory,
  images,
  process,
  quotes,
  services,
  silkFlorals,
  site,
} from "@/lib/content";
import {
  HOME_FAQS_KEY,
  HOME_TESTIMONIALS_KEY,
  type HomeDocument,
} from "@/cms/content/model";

type CmsTextFieldDefinition = {
  key: string;
  label: string;
  type: "text" | "textarea";
  hint?: string;
  wide?: boolean;
};

type CmsImageFieldDefinition = {
  key: string;
  altKey: string;
  label: string;
  type: "image";
  hint: string;
  accept: string;
  wide?: boolean;
};

export type CmsFieldDefinition = CmsTextFieldDefinition | CmsImageFieldDefinition;

export type CmsFieldGroupDefinition = {
  id: string;
  label: string;
  description?: string;
  fields: readonly CmsFieldDefinition[];
};

export type CmsSectionDefinition = {
  id: string;
  title: string;
  description: string;
  fields: readonly CmsFieldDefinition[];
  groups?: readonly CmsFieldGroupDefinition[];
  collection?: "testimonials" | "faqs";
};

const imageField = (
  key: string,
  label: string,
  hint: string,
): CmsImageFieldDefinition => ({
  key,
  altKey: `${key}Alt`,
  label,
  type: "image",
  hint,
  accept: "image/jpeg,image/webp",
  wide: true,
});

export const cmsSite = {
  name: "Jessica S. Designs",
  shortName: "JSD",
  adminTitle: "Studio CMS",
} as const;

export const homeSections: readonly CmsSectionDefinition[] = [
  {
    id: "hero",
    title: "Hero",
    description: "Opening message, actions and main photograph",
    fields: [
      { key: "hero.eyebrow", label: "Small label above headline", type: "text" },
      { key: "hero.lead", label: "Headline — first line", type: "text" },
      {
        key: "hero.feeling",
        label: "Headline — emphasized line",
        type: "text",
        hint: "The final word receives the italic treatment automatically.",
      },
      { key: "hero.tail", label: "Headline — final line", type: "text" },
      { key: "hero.intro", label: "Introduction", type: "textarea", wide: true },
      { key: "hero.primaryLabel", label: "Primary button", type: "text" },
      { key: "hero.secondaryLabel", label: "Secondary link", type: "text" },
      { key: "hero.caption", label: "Image caption", type: "text", wide: true },
      imageField(
        "hero.image",
        "Hero image",
        "Recommended · horizontal or square · 2000 px longest side · JPG or WebP input up to 10 MB · converted to WebP before upload",
      ),
    ],
  },
  {
    id: "philosophy",
    title: "Philosophy",
    description: "Positioning statement, supporting copy and photographs",
    fields: [
      { key: "philosophy.eyebrow", label: "Section label", type: "text" },
      { key: "philosophy.heading", label: "Statement — opening", type: "textarea", wide: true },
      { key: "philosophy.emphasis", label: "Statement — emphasized ending", type: "text" },
      { key: "philosophy.paragraphOne", label: "First paragraph", type: "textarea", wide: true },
      { key: "philosophy.paragraphTwo", label: "Second paragraph", type: "textarea", wide: true },
      imageField(
        "philosophy.primaryImage",
        "Primary photograph",
        "Recommended · portrait or vertical crop · 1600 × 2000 px · JPG or WebP input up to 10 MB · converted to WebP before upload",
      ),
      imageField(
        "philosophy.secondaryImage",
        "Secondary photograph",
        "Recommended · portrait or vertical crop · 1600 × 2000 px · JPG or WebP input up to 10 MB · converted to WebP before upload",
      ),
    ],
  },
  {
    id: "expertise",
    title: "Expertise",
    description: "Section introduction and four fixed expertise entries",
    fields: [
      { key: "expertise.heading", label: "Heading", type: "text" },
      { key: "expertise.meta", label: "Meta line", type: "text" },
      { key: "expertise.intro", label: "Introduction", type: "textarea", wide: true },
    ],
    groups: services.map((service, index) => ({
      id: `expertise-${index + 1}`,
      label: `Expertise ${index + 1}`,
      description: `${service.numeral} · Fixed position`,
      fields: [
        { key: `expertise.items.${index + 1}.title`, label: "Title", type: "text" },
        { key: `expertise.items.${index + 1}.paragraph`, label: "Paragraph", type: "textarea", wide: true },
        imageField(
          `expertise.items.${index + 1}.image`,
          "Photograph",
          "Recommended · portrait · 1600 × 2000 px · JPG or WebP input up to 10 MB · converted to WebP before upload",
        ),
      ],
    })),
  },
  {
    id: "process",
    title: "Process",
    description: "Introduction and six fixed design steps",
    fields: [
      { key: "process.eyebrow", label: "Section label", type: "text" },
      { key: "process.heading", label: "Heading", type: "text" },
      { key: "process.intro", label: "Introduction", type: "textarea", wide: true },
    ],
    groups: process.steps.map((step, index) => ({
      id: `process-${index + 1}`,
      label: `Step ${index + 1}`,
      description: `${step.numeral} · Fixed position`,
      fields: [
        { key: `process.steps.${index + 1}.title`, label: "Title", type: "text" },
        { key: `process.steps.${index + 1}.paragraph`, label: "Paragraph", type: "textarea", wide: true },
      ],
    })),
  },
  {
    id: "silk-florals",
    title: "Silk Florals",
    description: "Service statement, call to action and photographs",
    fields: [
      { key: "silk.eyebrow", label: "Section label", type: "text" },
      { key: "silk.statement", label: "Statement", type: "text" },
      { key: "silk.copy", label: "Paragraph", type: "textarea", wide: true },
      { key: "silk.ctaLabel", label: "Button label", type: "text" },
      imageField(
        "silk.primaryImage",
        "Primary photograph",
        "Recommended · portrait · 1600 × 2000 px · JPG or WebP input up to 10 MB · converted to WebP before upload",
      ),
      imageField(
        "silk.secondaryImage",
        "Secondary photograph",
        "Recommended · portrait · 1600 × 2000 px · JPG or WebP input up to 10 MB · converted to WebP before upload",
      ),
    ],
  },
  {
    id: "founder",
    title: "Founder",
    description: "Home introduction and the complete Meet Jessica story",
    fields: [
      { key: "founder.eyebrow", label: "Role", type: "text" },
      { key: "founder.name", label: "Name", type: "text" },
      { key: "founder.bio", label: "Biography", type: "textarea", wide: true },
      { key: "founder.triggerLabel", label: "Story link", type: "text" },
      imageField(
        "founder.primaryImage",
        "Founder photograph",
        "Recommended · portrait · 1600 × 2000 px · JPG or WebP input up to 10 MB · converted to WebP before upload",
      ),
    ],
    groups: [
      {
        id: "founder-story",
        label: "Meet Jessica modal",
        description: "Full story shown after opening the founder profile",
        fields: [
          { key: "founder.story.heading", label: "Heading", type: "textarea", wide: true },
          { key: "founder.story.introduction", label: "Introduction", type: "textarea", wide: true },
          { key: "founder.story.paragraphOne", label: "First paragraph", type: "textarea", wide: true },
          { key: "founder.story.paragraphTwo", label: "Second paragraph", type: "textarea", wide: true },
          { key: "founder.story.ctaLabel", label: "Button label", type: "text" },
          imageField(
            "founder.story.image",
            "Modal photograph",
            "Recommended · portrait · 1600 × 2000 px · JPG or WebP input up to 10 MB · converted to WebP before upload",
          ),
        ],
      },
    ],
  },
  {
    id: "testimonials",
    title: "Testimonials",
    description: "Section title and ordered client testimonials",
    collection: "testimonials",
    fields: [
      { key: "testimonials.eyebrow", label: "Section label", type: "text" },
      { key: "testimonials.lead", label: "Heading — opening", type: "text" },
      { key: "testimonials.emphasis", label: "Heading — emphasized word", type: "text" },
      { key: "testimonials.tail", label: "Heading — closing", type: "text" },
    ],
  },
  {
    id: "faqs",
    title: "FAQs",
    description: "Introduction and ordered questions",
    collection: "faqs",
    fields: [
      { key: "faqs.eyebrow", label: "Section label", type: "text" },
      { key: "faqs.heading", label: "Heading", type: "text" },
      { key: "faqs.intro", label: "Introduction", type: "text" },
    ],
  },
  {
    id: "closing-cta",
    title: "Closing CTA",
    description: "Final invitation before the footer",
    fields: [
      { key: "cta.eyebrow", label: "Section label", type: "text" },
      { key: "cta.heading", label: "Heading", type: "text" },
      { key: "cta.copy", label: "Supporting copy", type: "textarea", wide: true },
      { key: "cta.label", label: "Button label", type: "text" },
    ],
  },
];

export const homeFieldDefinitions = homeSections.flatMap((section) => [
  ...section.fields,
  ...(section.groups?.flatMap((group) => group.fields) ?? []),
]);

export const defaultHomeDocument: HomeDocument = {
  "hero.eyebrow": site.tagline,
  "hero.lead": "You know how",
  "hero.feeling": "it should feel.",
  "hero.tail": "We design the rest.",
  "hero.intro": "Boutique wedding design & styling for thoughtfully created celebrations in the Hudson Valley, NYC, and CT.",
  "hero.primaryLabel": "Start With a Conversation",
  "hero.secondaryLabel": "See the Work",
  "hero.caption": "Terrace welcome dinner · Hudson Valley, NY",
  "hero.image": images.heroTapers.src,
  "hero.imageAlt": "Long garden table set with white hydrangeas, taper candles and gold vessels at golden hour",
  "philosophy.eyebrow": "Our Philosophy",
  "philosophy.heading": "An unforgettable celebration is designed to be",
  "philosophy.emphasis": "felt.",
  "philosophy.paragraphOne": "We shape how your celebration looks, feels, and comes together. From tablescapes and candlelight to florals, stationery, signage, furniture, and the smallest finishing details, every element is thoughtfully considered.",
  "philosophy.paragraphTwo": "We look at the celebration as a whole, making sure each piece works together to create a space that feels cohesive, intentional, and distinctly yours.",
  "philosophy.primaryImage": images.philosophyOutdoorBarn.src,
  "philosophy.primaryImageAlt": "Outdoor reception table set beside a white barn",
  "philosophy.secondaryImage": images.philosophyOutdoorTablescape.src,
  "philosophy.secondaryImageAlt": "Sunlit outdoor reception table with soft florals and taper candles",
  "expertise.heading": "Expertise",
  "expertise.meta": "Design · Styling · Execution",
  "expertise.intro": "Four ways to bring a clear, cohesive design vision to life.",
  ...Object.fromEntries(
    services.flatMap((service, index) => [
      [`expertise.items.${index + 1}.title`, service.name],
      [`expertise.items.${index + 1}.paragraph`, service.copy],
      [`expertise.items.${index + 1}.image`, service.img.src],
      [`expertise.items.${index + 1}.imageAlt`, service.name],
    ]),
  ),
  "process.eyebrow": process.eyebrow,
  "process.heading": process.heading,
  "process.intro": process.intro,
  ...Object.fromEntries(
    process.steps.flatMap((step, index) => [
      [`process.steps.${index + 1}.title`, step.name],
      [`process.steps.${index + 1}.paragraph`, step.copy],
    ]),
  ),
  "silk.eyebrow": silkFlorals.eyebrow,
  "silk.statement": silkFlorals.statement,
  "silk.copy": silkFlorals.copy,
  "silk.ctaLabel": "Start With a Conversation",
  "silk.primaryImage": images.silkFloralsBlueCentrepiece.src,
  "silk.primaryImageAlt": "Blue and white silk floral centrepiece in a brass compote on a reception table",
  "silk.secondaryImage": images.silkFloralsReceptionCentrepiece.src,
  "silk.secondaryImageAlt": "Tall blue and white silk floral centrepiece above a candlelit reception table",
  "founder.eyebrow": "Founder & Creative Director",
  "founder.name": "Jessica Salomon",
  "founder.bio": "With a background in wedding and event planning, I bring years of experience and a deep understanding of how celebrations come together. Over time, I found myself drawn most to the creative side—the details, the atmosphere, and the way thoughtful design can completely transform a space. That led me to step away from planning and focus exclusively on wedding design and styling, creating celebrations that feel intentional, personal, and beautifully considered.",
  "founder.triggerLabel": "Meet Jessica",
  "founder.primaryImage": images.jessica.src,
  "founder.primaryImageAlt": "Jessica Salomon, founder and creative director",
  "founder.story.heading": founderStory.heading,
  "founder.story.introduction": founderStory.introduction,
  "founder.story.paragraphOne": founderStory.paragraphs[0],
  "founder.story.paragraphTwo": founderStory.paragraphs[1],
  "founder.story.ctaLabel": "Start With a Conversation",
  "founder.story.image": images.jessicaFounderStory.src,
  "founder.story.imageAlt": "Portrait of Jessica Salomon",
  "testimonials.eyebrow": "Kind Words",
  "testimonials.lead": "In their",
  "testimonials.emphasis": "own",
  "testimonials.tail": "words",
  [HOME_TESTIMONIALS_KEY]: quotes.map((quote, index) => ({
    id: `testimonial-${index + 1}`,
    text: quote.text,
    who: quote.who,
  })),
  "faqs.eyebrow": "Good to Know",
  "faqs.heading": "Questions, answered",
  "faqs.intro": "A few details to know before we begin.",
  [HOME_FAQS_KEY]: faqs.map((faq, index) => ({
    id: `faq-${index + 1}`,
    q: faq.q,
    a: faq.a,
  })),
  "cta.eyebrow": "Let’s Begin",
  "cta.heading": "Tell us how you want it to feel.",
  "cta.copy": "A complimentary hour together, and no obligation after it.",
  "cta.label": "Start With a Conversation",
};
