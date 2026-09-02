/**
 * Adaptador local del Look Book.
 *
 * La UI solo consume los selectores al final del archivo. Cuando llegue el
 * CMS, este módulo se sustituye por un adaptador remoto que devuelva la misma
 * forma: proyecto publicado, portada, posición y fotografías ordenadas.
 */

export type HomeLookbookShape =
  | "wide"
  | "tall"
  | "portraitPair"
  | "square";

export type LookbookImage = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  position: number;
  focalPoint?: { x: number; y: number };
  cropTolerance?: "none" | "soft";
};

export type LookbookProject = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  venue?: string;
  location?: string;
  photographer?: string;
  position: number;
  published: boolean;
  featured: boolean;
  featuredPosition?: number;
  homeShape: HomeLookbookShape;
  homeCoverImageId?: string;
  /** La portada del proyecto debe ser horizontal. */
  coverImageId: string;
  previewImageCount: number;
  images: readonly LookbookImage[];
};

function images(
  slug: string,
  title: string,
  dimensions: readonly (readonly [width: number, height: number])[],
): LookbookImage[] {
  return dimensions.map(([width, height], index) => {
    const position = index + 1;
    const paddedPosition = String(position).padStart(2, "0");

    return {
      id: `${slug}-${paddedPosition}`,
      src: `/lookbook/${slug}/${paddedPosition}.webp`,
      alt: `Design details from ${title}, photograph ${position}`,
      width,
      height,
      position,
    };
  });
}

const records: readonly LookbookProject[] = [
  {
    id: "project-emily-moses",
    slug: "emily-moses",
    title: "Emily & Moses",
    subtitle: "Fall Wedding",
    venue: "The Thayer Hotel",
    location: "West Point, NY",
    photographer: "Tara Kearsing",
    position: 1,
    published: true,
    featured: true,
    featuredPosition: 1,
    homeShape: "wide",
    coverImageId: "emily-moses-01",
    previewImageCount: 5,
    images: images("emily-moses", "Emily & Moses", [
      [2000, 1333], [2000, 1333], [2000, 1333], [1333, 2000],
      [2000, 1333], [2000, 1333], [2000, 1333], [2000, 1333],
      [1333, 2000],
    ]),
  },
  {
    id: "project-lucas-will",
    slug: "lucas-will",
    title: "Lucas & Will",
    venue: "Private Residence",
    photographer: "M&M Photomemories",
    position: 2,
    published: true,
    featured: true,
    featuredPosition: 2,
    homeShape: "tall",
    homeCoverImageId: "lucas-will-01",
    coverImageId: "lucas-will-01",
    previewImageCount: 5,
    images: images("lucas-will", "Lucas & Will", [
      [1125, 2000], [1125, 2000], [1125, 2000], [2000, 1125],
      [2000, 1125], [2000, 1125], [2000, 1125], [2000, 1125],
      [2000, 1125], [2000, 1125], [1125, 2000],
    ]),
  },
  {
    id: "project-custom-tablescape",
    slug: "custom-tablescape",
    title: "Custom Tablescape",
    venue: "B Social",
    location: "Port Chester, NY",
    photographer: "Hillary C. Photos",
    position: 3,
    published: true,
    featured: true,
    featuredPosition: 3,
    homeShape: "portraitPair",
    homeCoverImageId: "custom-tablescape-04",
    coverImageId: "custom-tablescape-01",
    previewImageCount: 5,
    images: images("custom-tablescape", "Custom Tablescape", [
      [2000, 1333], [2000, 1333], [2000, 1333], [1333, 2000],
      [2000, 1333], [2000, 1333], [2000, 1333], [2000, 1333],
      [2000, 1333],
    ]),
  },
  {
    id: "project-mckenzie-jordan",
    slug: "mckenzie-jordan",
    title: "Mckenzie & Jordan",
    subtitle: "Micro-Wedding",
    venue: "Private Residence",
    location: "Gardiner, NY",
    photographer: "Lauren Nemeroff & Shawn McLaws",
    position: 4,
    published: true,
    featured: true,
    featuredPosition: 4,
    homeShape: "portraitPair",
    homeCoverImageId: "mckenzie-jordan-01",
    coverImageId: "mckenzie-jordan-01",
    previewImageCount: 5,
    images: images("mckenzie-jordan", "Mckenzie & Jordan", [
      [1333, 2000], [1333, 2000], [1333, 2000], [2000, 1333],
      [1333, 2000], [1333, 2000], [1333, 2000], [1333, 2000],
      [1333, 2000], [1333, 2000], [1333, 2000], [1333, 2000],
      [1333, 2000], [2000, 1333], [1333, 2000],
    ]),
  },
  {
    id: "project-morgan-garrett",
    slug: "morgan-garrett",
    title: "Morgan & Garrett",
    venue: "B Social",
    location: "Port Chester, NY",
    photographer: "Sammy Finch Photography",
    position: 5,
    published: true,
    featured: true,
    featuredPosition: 5,
    homeShape: "square",
    homeCoverImageId: "morgan-garrett-07",
    coverImageId: "morgan-garrett-01",
    previewImageCount: 5,
    images: images("morgan-garrett", "Morgan & Garrett", [
      [2000, 1334], [2000, 1600], [2000, 1600], [2000, 1334],
      [2000, 1334], [2000, 1334], [1600, 2000], [1334, 2000],
      [2000, 1600], [2000, 1334], [2000, 1334],
    ]),
  },
  {
    id: "project-isabelle-marshall",
    slug: "isabelle-marshall",
    title: "Isabelle & Marshall",
    subtitle: "Wedding Dinner Reception: Enchanted Forest",
    venue: "Helen Mills Event Space",
    location: "New York, NY",
    photographer: "Shiloh Leath Photography & JSD",
    position: 6,
    published: true,
    featured: true,
    featuredPosition: 6,
    homeShape: "square",
    homeCoverImageId: "isabelle-marshall-01",
    coverImageId: "isabelle-marshall-01",
    previewImageCount: 5,
    images: images("isabelle-marshall", "Isabelle & Marshall", [
      [1333, 2000], [1333, 2000], [2000, 1333], [1333, 2000],
      [2000, 1333], [1333, 2000], [1333, 2000], [1125, 2000],
      [1125, 2000], [1125, 2000], [1125, 2000], [1500, 2000],
    ]),
  },
  {
    id: "project-open-house-summer-tablescape",
    slug: "open-house-summer-tablescape",
    title: "Open House Summer Tablescape",
    photographer: "M.M Photo Memories",
    position: 7,
    published: true,
    featured: true,
    featuredPosition: 7,
    homeShape: "square",
    coverImageId: "open-house-summer-tablescape-01",
    previewImageCount: 3,
    images: images(
      "open-house-summer-tablescape",
      "Open House Summer Tablescape",
      [[2000, 1126], [2000, 1126], [2000, 1126], [2000, 1126]],
    ),
  },
];

function sortImages(project: LookbookProject): LookbookProject {
  return {
    ...project,
    images: [...project.images].sort((a, b) => a.position - b.position),
  };
}

export function getPublishedLookbookProjects(): LookbookProject[] {
  return records
    .filter((project) => project.published)
    .map(sortImages)
    .sort((a, b) => a.position - b.position);
}

export function getFeaturedLookbookProjects(): LookbookProject[] {
  return getPublishedLookbookProjects()
    .filter((project) => project.featured)
    .sort(
      (a, b) =>
        (a.featuredPosition ?? a.position) -
        (b.featuredPosition ?? b.position),
    );
}

export function getProjectCover(project: LookbookProject): LookbookImage {
  return (
    project.images.find((image) => image.id === project.coverImageId) ??
    project.images[0]
  );
}

export function getHomeProjectCover(project: LookbookProject): LookbookImage {
  return (
    project.images.find(
      (image) => image.id === (project.homeCoverImageId ?? project.coverImageId),
    ) ?? getProjectCover(project)
  );
}

export function getProjectPreview(project: LookbookProject): LookbookImage[] {
  return project.images
    .filter((image) => image.id !== project.coverImageId)
    .slice(0, project.previewImageCount);
}
