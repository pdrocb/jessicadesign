"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/cms/auth/session";
import { getCmsDatabase } from "@/cms/database/client";

export type ProjectImageAction =
  | "make-primary"
  | "move-up"
  | "move-down"
  | "delete";

type ProjectImageRow = {
  id: string;
  position: number;
  is_primary: boolean;
};

function revalidateProjects() {
  revalidatePath("/");
  revalidatePath("/admin/projects");
  revalidatePath("/look-book");
}

export async function saveProject(projectId: string, formData: FormData) {
  await requireSession();
  const text = (key: string) => String(formData.get(key) ?? "").trim() || null;
  const title = text("title");
  if (!title) throw new Error("Project title is required.");
  const imageAlts = Array.from(formData.entries())
    .filter(([key, value]) => key.startsWith("imageAlt:") && typeof value === "string")
    .map(([key, value]) => ({ id: key.slice("imageAlt:".length), alt: String(value).trim() }));
  if (imageAlts.some((image) => !image.alt || image.alt.length > 500)) {
    throw new Error("Every photograph needs alternative text under 500 characters.");
  }

  const sql = getCmsDatabase();
  await sql.query(
    `WITH updated_project AS (
       UPDATE cms_projects
        SET title = $2,
            subtitle = $3,
            venue = $4,
            location = $5,
            photographer = $6,
            published = $7,
            updated_at = now()
      WHERE id = $1
      RETURNING id
     ), updated_images AS (
       UPDATE cms_project_images AS image
          SET alt = incoming.alt,
              updated_at = now()
         FROM jsonb_to_recordset($8::jsonb) AS incoming(id text, alt text)
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
      formData.get("published") === "on",
      JSON.stringify(imageAlts),
    ],
  );
  revalidateProjects();
}

export async function moveProject(projectId: string, direction: "up" | "down") {
  await requireSession();
  const operator = direction === "up" ? "<" : ">";
  const order = direction === "up" ? "DESC" : "ASC";
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
  revalidateProjects();
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
    if (currentIndex === 0) throw new Error("The principal photograph is pinned first.");
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
              home_cover_image_id = CASE
                WHEN $3::boolean AND home_cover_image_id = $4 THEN $2
                ELSE home_cover_image_id
              END,
              updated_at = now()
        WHERE id = $1`,
      [projectId, nextPrimaryId, action === "delete", imageId],
    ),
  ]);

  revalidateProjects();
  return { ok: true };
}
