import "server-only";

import {
  getCmsDatabase,
  isCmsDatabaseConfigured,
  isCmsDatabaseConnectionError,
} from "@/cms/database/client";
import { getPublishedLookbookProjects, type LookbookProject } from "@/lib/lookbook";

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
  featured_position: number | null;
  home_shape: LookbookProject["homeShape"];
  home_cover_image_id: string | null;
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

async function seedCurrentProjects() {
  const sql = getCmsDatabase();
  const countRows = (await sql.query("SELECT count(*)::int AS count FROM cms_projects")) as { count: number }[];
  if ((countRows[0]?.count ?? 0) > 0) return;

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
    featured_position: project.featuredPosition ?? null,
    home_shape: project.homeShape,
    home_cover_image_id: project.homeCoverImageId ?? null,
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

  await sql.query(
    `INSERT INTO cms_projects (
       id, slug, title, subtitle, venue, location, photographer, position,
       published, featured, featured_position, home_shape, home_cover_image_id,
       cover_image_id, preview_image_count
     )
     SELECT id, slug, title, subtitle, venue, location, photographer, position,
            published, featured, featured_position, home_shape, home_cover_image_id,
            cover_image_id, preview_image_count
       FROM jsonb_to_recordset($1::jsonb) AS seed(
         id text, slug text, title text, subtitle text, venue text, location text,
         photographer text, position integer, published boolean, featured boolean,
         featured_position integer, home_shape text, home_cover_image_id text,
         cover_image_id text, preview_image_count integer
       )
     ON CONFLICT (id) DO NOTHING`,
    [JSON.stringify(projectSeed)],
  );
  await sql.query(
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
  );
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

  const projects = projectRows.map((row) => ({
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
    featuredPosition: row.featured_position ?? undefined,
    homeShape: row.home_shape,
    homeCoverImageId: row.home_cover_image_id ?? undefined,
    coverImageId: row.cover_image_id,
    previewImageCount: row.preview_image_count,
    images: imageRows.filter((image) => image.project_id === row.id).map((image) => ({
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
  }));

  return { projects, connected: true };
}
