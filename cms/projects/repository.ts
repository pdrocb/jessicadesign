import "server-only";

import {
  getCmsDatabase,
  isCmsDatabaseConfigured,
  isCmsDatabaseConnectionError,
} from "@/cms/database/client";
import {
  getFeaturedLookbookProjects,
  getProjectCover,
  getPublishedLookbookProjects,
  type HomeLookbookProject,
  type LookbookProject,
} from "@/lib/lookbook";

type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  venue: string | null;
  location: string | null;
  photographer: string | null;
  position: number;
  published: boolean;
  featured: boolean;
  cover_image_id: string;
  preview_image_count: number;
};

type ImageRow = {
  id: string;
  project_id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  position: number;
  focal_x: string | null;
  focal_y: string | null;
  crop_tolerance: "none" | "soft" | null;
};

type HomeProjectRow = Pick<
  ProjectRow,
  "id" | "slug" | "title" | "venue" | "location" | "position"
> & Omit<ImageRow, "id" | "project_id" | "position"> & {
  image_id: string;
};

function fallbackHomeProjects(): HomeLookbookProject[] {
  return getFeaturedLookbookProjects().map((project) => ({
    id: project.id,
    slug: project.slug,
    title: project.title,
    venue: project.venue,
    location: project.location,
    position: project.position,
    cover: getProjectCover(project),
  }));
}

function toHomeLookbookProject(row: HomeProjectRow): HomeLookbookProject {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    venue: row.venue ?? undefined,
    location: row.location ?? undefined,
    position: row.position,
    cover: {
      id: row.image_id,
      src: row.src,
      alt: row.alt,
      width: row.width,
      height: row.height,
      position: row.position,
      focalPoint: row.focal_x !== null && row.focal_y !== null
        ? { x: Number(row.focal_x), y: Number(row.focal_y) }
        : undefined,
      cropTolerance: row.crop_tolerance ?? undefined,
    },
  };
}

function toLookbookProject(row: ProjectRow, imageRows: ImageRow[]): LookbookProject {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle ?? undefined,
    venue: row.venue ?? undefined,
    location: row.location ?? undefined,
    photographer: row.photographer ?? undefined,
    position: row.position,
    published: row.published,
    featured: row.featured,
    coverImageId: row.cover_image_id,
    previewImageCount: row.preview_image_count,
    images: imageRows.map((image) => ({
      id: image.id,
      src: image.src,
      alt: image.alt,
      width: image.width,
      height: image.height,
      position: image.position,
      focalPoint: image.focal_x !== null && image.focal_y !== null
        ? { x: Number(image.focal_x), y: Number(image.focal_y) }
        : undefined,
      cropTolerance: image.crop_tolerance ?? undefined,
    })),
  };
}

async function seedCurrentProjects() {
  const sql = getCmsDatabase();
  const seedRows = (await sql.query(
    "SELECT content_key FROM cms_seed_state WHERE content_key = 'lookbook' LIMIT 1",
  )) as { content_key: string }[];
  if (seedRows[0]) return;

  const countRows = (await sql.query("SELECT count(*)::int AS count FROM cms_projects")) as { count: number }[];
  if ((countRows[0]?.count ?? 0) > 0) {
    await sql.query(
      "INSERT INTO cms_seed_state (content_key) VALUES ('lookbook') ON CONFLICT (content_key) DO NOTHING",
    );
    return;
  }

  const projects = getPublishedLookbookProjects();
  const projectSeed = projects.map((project) => ({
    id: project.id,
    slug: project.slug,
    title: project.title,
    subtitle: project.subtitle ?? null,
    venue: project.venue ?? null,
    location: project.location ?? null,
    photographer: project.photographer ?? null,
    position: project.position,
    published: project.published,
    featured: project.featured,
    cover_image_id: project.coverImageId,
    preview_image_count: project.previewImageCount,
  }));
  const imageSeed = projects.flatMap((project) =>
    project.images.map((image) => ({
      id: image.id,
      project_id: project.id,
      src: image.src,
      alt: image.alt,
      width: image.width,
      height: image.height,
      position: image.position,
      focal_x: image.focalPoint?.x ?? null,
      focal_y: image.focalPoint?.y ?? null,
      crop_tolerance: image.cropTolerance ?? null,
    })),
  );

  await sql.transaction((transaction) => [
    transaction.query(
      `INSERT INTO cms_projects (
       id, slug, title, subtitle, venue, location, photographer, position,
       published, featured, cover_image_id, preview_image_count
     )
     SELECT id, slug, title, subtitle, venue, location, photographer, position,
            published, featured, cover_image_id, preview_image_count
       FROM jsonb_to_recordset($1::jsonb) AS seed(
         id text, slug text, title text, subtitle text, venue text, location text,
         photographer text, position integer, published boolean, featured boolean,
         cover_image_id text, preview_image_count integer
       )
     ON CONFLICT (id) DO NOTHING`,
      [JSON.stringify(projectSeed)],
    ),
    transaction.query(
      `INSERT INTO cms_project_images (
       id, project_id, src, alt, width, height, position, focal_x, focal_y, crop_tolerance
     )
     SELECT id, project_id, src, alt, width, height, position, focal_x, focal_y, crop_tolerance
       FROM jsonb_to_recordset($1::jsonb) AS seed(
         id text, project_id text, src text, alt text, width integer, height integer,
         position integer, focal_x numeric, focal_y numeric, crop_tolerance text
       )
     ON CONFLICT (id) DO NOTHING`,
      [JSON.stringify(imageSeed)],
    ),
    transaction.query(
      "INSERT INTO cms_seed_state (content_key) VALUES ('lookbook') ON CONFLICT (content_key) DO NOTHING",
    ),
  ]);
}

export async function getCmsProjects(): Promise<{ projects: LookbookProject[]; connected: boolean }> {
  if (!isCmsDatabaseConfigured()) {
    return { projects: getPublishedLookbookProjects(), connected: false };
  }

  let projectRows: ProjectRow[];
  let imageRows: ImageRow[];
  try {
    await seedCurrentProjects();
    const sql = getCmsDatabase();
    [projectRows, imageRows] = await Promise.all([
      sql.query("SELECT * FROM cms_projects ORDER BY position"),
      sql.query("SELECT * FROM cms_project_images ORDER BY project_id, position"),
    ]) as [ProjectRow[], ImageRow[]];
  } catch (error) {
    if (isCmsDatabaseConnectionError(error)) {
      return { projects: getPublishedLookbookProjects(), connected: false };
    }
    throw error;
  }

  const projects = projectRows.map((row) => toLookbookProject(
    row,
    imageRows.filter((image) => image.project_id === row.id),
  ));

  return { projects, connected: true };
}

export async function getHomeLookbookProjects(): Promise<HomeLookbookProject[]> {
  if (!isCmsDatabaseConfigured()) return fallbackHomeProjects();

  try {
    await seedCurrentProjects();
    const sql = getCmsDatabase();
    const rows = (await sql.query(
      `SELECT project.id,
              project.slug,
              project.title,
              project.venue,
              project.location,
              project.position,
              image.id AS image_id,
              image.src,
              image.alt,
              image.width,
              image.height,
              image.focal_x,
              image.focal_y,
              image.crop_tolerance
         FROM cms_projects project
         JOIN cms_project_images image ON image.id = project.cover_image_id
        WHERE project.published = true
          AND project.featured = true
        ORDER BY project.position
        LIMIT 7`,
    )) as HomeProjectRow[];

    return rows.map(toHomeLookbookProject);
  } catch (error) {
    if (isCmsDatabaseConnectionError(error)) return fallbackHomeProjects();
    throw error;
  }
}

export async function getCmsProject(projectId: string): Promise<{ project?: LookbookProject; connected: boolean }> {
  if (!isCmsDatabaseConfigured()) {
    return { project: getPublishedLookbookProjects().find((project) => project.id === projectId), connected: false };
  }

  try {
    await seedCurrentProjects();
    const sql = getCmsDatabase();
    const [projectRows, imageRows] = await Promise.all([
      sql.query("SELECT * FROM cms_projects WHERE id = $1 LIMIT 1", [projectId]),
      sql.query("SELECT * FROM cms_project_images WHERE project_id = $1 ORDER BY position", [projectId]),
    ]) as [ProjectRow[], ImageRow[]];
    const row = projectRows[0];
    return { project: row ? toLookbookProject(row, imageRows) : undefined, connected: true };
  } catch (error) {
    if (isCmsDatabaseConnectionError(error)) {
      return { project: getPublishedLookbookProjects().find((project) => project.id === projectId), connected: false };
    }
    throw error;
  }
}
