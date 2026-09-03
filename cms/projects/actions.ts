"use server";

import { del, put } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession } from "@/cms/auth/session";
import { getCmsDatabase } from "@/cms/database/client";
import {
  flushProjectBlobDeletions,
  isManagedBlobUrl,
} from "@/cms/projects/blob-cleanup";
import { optimizedCmsImageMetadata } from "@/cms/media/image-metadata";
import type { LookbookImage } from "@/lib/lookbook";

export type ProjectImageAction =
  | "make-primary"
  | "move-up"
  | "move-down"
  | "delete";

export type ProjectSaveState = {
  status: "idle" | "saved" | "error";
  message: string;
  field?: string;
};

export type ProjectCreateState = {
  status: "idle" | "error";
  message: string;
  field?: "title" | "file";
};

type ProjectImageRow = {
  id: string;
  src: string;
  position: number;
  is_primary: boolean;
};

function revalidateProjects() {
  revalidatePath("/");
  revalidatePath("/admin/projects");
  revalidatePath("/look-book");
}

function revalidateProject(projectId: string) {
  revalidateProjects();
  revalidatePath(`/admin/projects/${projectId}`);
}

function slugifyProjectTitle(title: string) {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72) || "project";
}

async function availableProjectSlug(title: string) {
  const base = slugifyProjectTitle(title);
  const sql = getCmsDatabase();
  const rows = (await sql.query(
    "SELECT slug FROM cms_projects WHERE slug = $1 OR slug LIKE $2",
    [base, `${base}-%`],
  )) as { slug: string }[];
  const existing = new Set(rows.map((row) => row.slug));
  if (!existing.has(base)) return base;
  let suffix = 2;
  while (existing.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}

export async function createProject(
  _previousState: ProjectCreateState,
  formData: FormData,
): Promise<ProjectCreateState> {
  await requireSession();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { status: "error", message: "Enter a project title.", field: "title" };
  if (title.length > 160) {
    return { status: "error", message: "Keep the project title under 160 characters.", field: "title" };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Choose the first cover photograph.", field: "file" };
  }

  let metadata;
  try {
    metadata = await optimizedCmsImageMetadata(file);
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "The cover photograph could not be read.",
      field: "file",
    };
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { status: "error", message: "Image uploads are not configured yet.", field: "file" };
  }

  const projectId = `project-${randomUUID()}`;
  const imageId = `project-image-${randomUUID()}`;
  const upload = await (async () => {
    try {
      const slug = await availableProjectSlug(title);
      const blob = await put(`projects/${projectId}/${imageId}.${metadata.extension}`, file, {
        access: "public",
        addRandomSuffix: true,
        cacheControlMaxAge: 31_536_000,
        contentType: file.type,
      });
      return { blob, slug };
    } catch {
      return null;
    }
  })();

  if (!upload) {
    return {
      status: "error",
      message: "The cover photograph could not be uploaded. Check your connection and try again.",
      field: "file",
    };
  }

  const { blob, slug } = upload;

  try {
    const sql = getCmsDatabase();
    await sql.transaction((transaction) => [
      transaction.query(
        `INSERT INTO cms_projects (
           id, slug, title, position, published, featured, cover_image_id
         )
         VALUES (
           $1, $2, $3,
           (SELECT COALESCE(MAX(position), 0) + 1 FROM cms_projects),
           false, false, $4
         )`,
        [projectId, slug, title, imageId],
      ),
      transaction.query(
        `INSERT INTO cms_project_images (
           id, project_id, src, alt, width, height, position
         )
         VALUES ($1, $2, $3, $4, $5, $6, 1)`,
        [
          imageId,
          projectId,
          blob.url,
          `Design details from ${title}, cover photograph`,
          metadata.width,
          metadata.height,
        ],
      ),
      transaction.query(
        "INSERT INTO cms_seed_state (content_key) VALUES ('lookbook') ON CONFLICT (content_key) DO NOTHING",
      ),
    ]);
  } catch {
    await del(blob.url).catch(() => undefined);
    return {
      status: "error",
      message: "The project could not be created. Check your connection and try again.",
    };
  }

  revalidateProject(projectId);
  redirect(`/admin/projects/${projectId}`);
}

export async function uploadProjectImage(projectId: string, formData: FormData): Promise<LookbookImage> {
  await requireSession();

  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("Choose an image before uploading.");

  const metadata = await optimizedCmsImageMetadata(file);
  const sql = getCmsDatabase();
  const project = (await sql.query(
    "SELECT id FROM cms_projects WHERE id = $1 LIMIT 1",
    [projectId],
  )) as { id: string }[];
  if (!project[0]) throw new Error("Project not found.");
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("Image uploads are not configured yet.");

  const id = `project-image-${randomUUID()}`;
  const blob = await put(`projects/${projectId}/${id}.${metadata.extension}`, file, {
    access: "public",
    addRandomSuffix: true,
    cacheControlMaxAge: 31_536_000,
    contentType: file.type,
  });

  try {
    const imageRows = (await sql.query(
      `WITH target_project AS (
       SELECT id, title FROM cms_projects WHERE id = $1 FOR UPDATE
       ), next_position AS (
         SELECT COALESCE(MAX(image.position), 0) + 1 AS position
           FROM cms_project_images image
           JOIN target_project project ON project.id = image.project_id
       )
       INSERT INTO cms_project_images (id, project_id, src, alt, width, height, position)
       SELECT $2,
              project.id,
              $3,
              CONCAT('Design details from ', project.title, ', photograph ', next_position.position),
              $4,
              $5,
              next_position.position
         FROM target_project project, next_position
       RETURNING id, src, alt, width, height, position`,
      [projectId, id, blob.url, metadata.width, metadata.height],
    )) as LookbookImage[];

    const image = imageRows[0];
    if (!image) throw new Error("The photograph could not be added to this project.");

    revalidateProject(projectId);
    return image;
  } catch (error) {
    await del(blob.url).catch(() => undefined);
    throw error;
  }
}

export async function saveProject(
  projectId: string,
  _previousState: ProjectSaveState,
  formData: FormData,
): Promise<ProjectSaveState> {
  await requireSession();
  const text = (key: string) => String(formData.get(key) ?? "").trim() || null;
  const title = text("title");
  if (!title) return { status: "error", message: "Enter a project title before saving.", field: "title" };
  const imageAlts = Array.from(formData.entries())
    .filter(([key, value]) => key.startsWith("imageAlt:") && typeof value === "string")
    .map(([key, value]) => ({ id: key.slice("imageAlt:".length), alt: String(value).trim() }));
  const invalidImageAlt = imageAlts.find((image) => !image.alt || image.alt.length > 500);
  if (invalidImageAlt) {
    return {
      status: "error",
      message: "Add alternative text under 500 characters to every photograph.",
      field: `imageAlt:${invalidImageAlt.id}`,
    };
  }

  try {
    const sql = getCmsDatabase();
    await sql.query(
      `WITH updated_project AS (
       UPDATE cms_projects
        SET title = $2,
            subtitle = $3,
            venue = $4,
            location = $5,
            photographer = $6,
            updated_at = now()
      WHERE id = $1
      RETURNING id
     ), updated_images AS (
       UPDATE cms_project_images AS image
          SET alt = incoming.alt,
              updated_at = now()
         FROM jsonb_to_recordset($7::jsonb) AS incoming(id text, alt text)
        WHERE image.id = incoming.id
          AND image.project_id = $1
          AND EXISTS (SELECT 1 FROM updated_project)
       RETURNING image.id
     )
     SELECT id FROM updated_project`,
      [
        projectId,
        title,
        text("subtitle"),
        text("venue"),
        text("location"),
        text("photographer"),
        JSON.stringify(imageAlts),
      ],
    );
  } catch {
    return {
      status: "error",
      message: "The project could not be saved. Check your connection and try again.",
    };
  }
  revalidateProject(projectId);
  redirect("/admin/projects");
}

export async function setProjectPublished(projectId: string, published: boolean) {
  await requireSession();
  const sql = getCmsDatabase();
  await sql.query(
    `UPDATE cms_projects
        SET published = $2,
            featured = CASE WHEN $2 THEN featured ELSE false END,
            updated_at = now()
      WHERE id = $1`,
    [projectId, published],
  );
  revalidateProject(projectId);
}

export async function setProjectFeatured(
  projectId: string,
  featured: boolean,
): Promise<{ ok: boolean; message?: string }> {
  await requireSession();
  const sql = getCmsDatabase();

  try {
    if (!featured) {
      await sql.query(
        `UPDATE cms_projects
            SET featured = false,
                updated_at = now()
          WHERE id = $1`,
        [projectId],
      );
    } else {
      const rows = (await sql.query(
        `UPDATE cms_projects project
            SET featured = true,
                updated_at = now()
          WHERE project.id = $1
            AND project.published = true
            AND (
              SELECT count(*)
                FROM cms_projects selected
               WHERE selected.featured = true
                 AND selected.id <> project.id
            ) < 7
        RETURNING project.id`,
        [projectId],
      )) as { id: string }[];

      if (!rows[0]) {
        const projectRows = (await sql.query(
          "SELECT published FROM cms_projects WHERE id = $1 LIMIT 1",
          [projectId],
        )) as { published: boolean }[];
        return {
          ok: false,
          message: projectRows[0]?.published
            ? "Home can show up to 7 projects. Remove one before adding another."
            : "Publish this project before showing it on Home.",
        };
      }
    }
  } catch {
    return {
      ok: false,
      message: "Couldn’t update Home visibility. Try again.",
    };
  }

  revalidateProject(projectId);
  return { ok: true };
}

export type ProjectMoveResult = {
  ok: boolean;
  message?: string;
};

export async function moveProject(
  projectId: string,
  direction: "up" | "down",
): Promise<ProjectMoveResult> {
  await requireSession();
  const operator = direction === "up" ? "<" : ">";
  const order = direction === "up" ? "DESC" : "ASC";
  try {
    const sql = getCmsDatabase();
    await sql.query(
      `WITH current_project AS (
         SELECT id, position FROM cms_projects WHERE id = $1
       ), target_project AS (
         SELECT p.id, p.position
           FROM cms_projects p, current_project c
          WHERE p.position ${operator} c.position
          ORDER BY p.position ${order}
          LIMIT 1
       )
       UPDATE cms_projects p
          SET position = CASE
            WHEN p.id = c.id THEN t.position
            WHEN p.id = t.id THEN c.position
            ELSE p.position
          END,
          updated_at = now()
         FROM current_project c, target_project t
        WHERE p.id IN (c.id, t.id)`,
      [projectId],
    );
  } catch {
    return {
      ok: false,
      message: "The project could not be moved. Check your connection and try again.",
    };
  }

  revalidateProject(projectId);
  return { ok: true };
}

export async function deleteProject(projectId: string) {
  await requireSession();
  const sql = getCmsDatabase();
  const projectRows = (await sql.query(
    "SELECT id FROM cms_projects WHERE id = $1 LIMIT 1",
    [projectId],
  )) as { id: string }[];

  if (!projectRows[0]) throw new Error("Project not found.");

  await sql.transaction((transaction) => [
    transaction.query(
      `INSERT INTO cms_blob_deletion_queue (project_id, url)
       SELECT project.id, image.src
         FROM (
           SELECT id FROM cms_projects WHERE id = $1 FOR UPDATE
         ) project
         JOIN cms_project_images image ON image.project_id = project.id
        WHERE image.src LIKE 'https://%.public.blob.vercel-storage.com/%'
       ON CONFLICT (project_id, url) DO NOTHING`,
      [projectId],
    ),
    transaction.query(
      `WITH deleted_project AS (
         DELETE FROM cms_projects
          WHERE id = $1
          RETURNING position
       )
       UPDATE cms_projects
          SET position = position - 1,
              updated_at = now()
        WHERE position > COALESCE((SELECT position FROM deleted_project), 2147483647)`,
      [projectId],
    ),
  ]);

  await flushProjectBlobDeletions(projectId);
  revalidateProject(projectId);
  redirect("/admin/projects");
}

export async function updateProjectImage(
  projectId: string,
  imageId: string,
  action: ProjectImageAction,
) {
  await requireSession();
  const sql = getCmsDatabase();
  const rows = (await sql.query(
    `SELECT image.id,
            image.src,
            image.position,
            image.id = project.cover_image_id AS is_primary
       FROM cms_project_images image
       JOIN cms_projects project ON project.id = image.project_id
      WHERE image.project_id = $1
      ORDER BY CASE WHEN image.id = project.cover_image_id THEN 0 ELSE 1 END,
               image.position,
               image.id`,
    [projectId],
  )) as ProjectImageRow[];

  const currentIndex = rows.findIndex((image) => image.id === imageId);
  if (currentIndex === -1) throw new Error("Photograph not found.");
  if (action === "delete" && rows.length === 1) {
    throw new Error("A project must keep at least one photograph.");
  }

  const orderedIds = rows.map((image) => image.id);
  if (action === "make-primary") {
    orderedIds.splice(currentIndex, 1);
    orderedIds.unshift(imageId);
  } else if (action === "move-up") {
    if (currentIndex <= 1) {
      throw new Error("This photograph is already at the highest available position.");
    }
    [orderedIds[currentIndex - 1], orderedIds[currentIndex]] = [
      orderedIds[currentIndex],
      orderedIds[currentIndex - 1],
    ];
  } else if (action === "move-down") {
    if (currentIndex === 0) throw new Error("The cover photograph is pinned first.");
    if (currentIndex === rows.length - 1) {
      throw new Error("This photograph is already last.");
    }
    [orderedIds[currentIndex], orderedIds[currentIndex + 1]] = [
      orderedIds[currentIndex + 1],
      orderedIds[currentIndex],
    ];
  } else {
    orderedIds.splice(currentIndex, 1);
  }

  const nextOrder = orderedIds.map((id, index) => ({ id, position: index + 1 }));
  const nextPrimaryId = orderedIds[0];
  const temporaryOffset = 1_000_000;

  await sql.transaction((transaction) => [
    ...(action === "delete"
      ? [
          transaction.query(
            "DELETE FROM cms_project_images WHERE id = $1 AND project_id = $2",
            [imageId, projectId],
          ),
        ]
      : []),
    transaction.query(
      `UPDATE cms_project_images
          SET position = position + $2,
              updated_at = now()
        WHERE project_id = $1`,
      [projectId, temporaryOffset],
    ),
    transaction.query(
      `UPDATE cms_project_images AS image
          SET position = incoming.position,
              updated_at = now()
         FROM jsonb_to_recordset($2::jsonb) AS incoming(id text, position integer)
        WHERE image.project_id = $1
          AND image.id = incoming.id`,
      [projectId, JSON.stringify(nextOrder)],
    ),
    transaction.query(
      `UPDATE cms_projects
          SET cover_image_id = $2,
              updated_at = now()
        WHERE id = $1`,
      [projectId, nextPrimaryId],
    ),
  ]);

  if (action === "delete") {
    const deletedSource = rows[currentIndex].src;
    if (isManagedBlobUrl(deletedSource)) {
      await del(deletedSource).catch((error) => {
        console.error("The project photograph was removed from Neon but not from Vercel Blob.", error);
      });
    }
  }

  revalidateProject(projectId);
  return { ok: true };
}
