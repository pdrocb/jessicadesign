import blobSources from "@/lib/lookbook-blob-sources.json";

/**
 * Adaptador local del Look Book.
 *
 * La UI solo consume los selectores al final del archivo. Cuando llegue el
 * CMS, este módulo se sustituye por un adaptador remoto que devuelva la misma
 * forma: proyecto publicado, portada, posición y fotografías ordenadas.
 */

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
  /** La portada del proyecto debe ser horizontal. */
  coverImageId: string;
  previewImageCount: number;
  images: readonly LookbookImage[];
};

export type HomeLookbookProject = Pick<
  LookbookProject,
  "id" | "slug" | "title" | "venue" | "location" | "position"
> & {
  cover: LookbookImage;
};

function images(
  slug: string,
  title: string,
  dimensions: readonly (readonly [width: number, height: number])[],
): LookbookImage[] {
  return dimensions.map(([width, height], index) => {
    const position = index + 1;
    const paddedPosition = String(position).padStart(2, "0");
    const localSource = `/lookbook/${slug}/${paddedPosition}.webp`;
    const source = (blobSources as Record<string, string>)[localSource];
    if (!source) throw new Error(`Missing Blob source for ${localSource}.`);

    return {
      id: `${slug}-${paddedPosition}`,
      src: source,
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
    position: 8,
    published: true,
    featured: false,
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
    position: 1,
    published: true,
    featured: true,
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
    position: 5,
    published: true,
    featured: true,
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
    position: 2,
    published: true,
    featured: true,
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
    position: 3,
    published: true,
    featured: true,
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
    position: 4,
    published: true,
    featured: true,
    coverImageId: "isabelle-marshall-01",
    previewImageCount: 5,
    images: images("isabelle-marshall", "Isabelle & Marshall", [
      [1333, 2000], [1333, 2000], [2000, 1333], [1333, 2000],
      [2000, 1333], [1333, 2000], [1333, 2000], [1125, 2000],
      [1125, 2000], [1125, 2000], [1125, 2000], [1500, 2000],
    ]),
  },
  {
    id: "project-2ae6763e-333f-47df-915f-c69c8fc0678e",
    slug: "cori-ezra",
    title: "Cori & Ezra",
    venue: "Blackwalnut Farm",
    location: "Saugerties, NY",
    position: 6,
    published: true,
    featured: true,
    coverImageId: "cori-ezra-01",
    previewImageCount: 5,
    images: images("cori-ezra", "Cori & Ezra", [
      [1333, 2000], [1333, 2000], [2000, 1333], [1333, 2000],
      [2000, 1333], [1333, 2000], [1333, 2000], [1333, 2000],
      [1333, 2000], [1333, 2000], [1333, 2000], [2000, 1333],
      [1333, 2000],
    ]),
  },
  {
    id: "project-41e9740f-abc8-4c73-9474-245b7895236a",
    slug: "garden-chic-styled-shoot-picnic",
    title: "Garden chic styled shoot Picnic",
    location: "Hudson Valley, New York",
    position: 7,
    published: true,
    featured: true,
    coverImageId: "garden-chic-styled-shoot-picnic-01",
    previewImageCount: 5,
    images: images(
      "garden-chic-styled-shoot-picnic",
      "Garden chic styled shoot Picnic",
      [
        [2000, 1334], [2000, 1334], [1334, 2000],
        [1334, 2000], [1334, 2000], [1334, 2000],
      ],
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
    .sort((a, b) => a.position - b.position)
    .slice(0, 7);
}

export function getProjectCover(project: LookbookProject): LookbookImage {
  return (
    project.images.find((image) => image.id === project.coverImageId) ??
    project.images[0]
  );
}

export function getProjectPreview(project: LookbookProject): LookbookImage[] {
  return project.images
    .filter((image) => image.id !== project.coverImageId)
    .slice(0, project.previewImageCount);
}
