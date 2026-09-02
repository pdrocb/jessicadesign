import "server-only";

import { del } from "@vercel/blob";
import { getCmsDatabase, isCmsDatabaseConfigured } from "@/cms/database/client";

type QueuedBlobRow = {
  project_id: string;
  url: string;
};

export function isManagedBlobUrl(source: string) {
  try {
    const url = new URL(source);
    return url.protocol === "https:" && url.hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

async function removeQueueEntries(rows: QueuedBlobRow[]) {
  if (rows.length === 0) return;
  const sql = getCmsDatabase();
  await sql.query(
    `DELETE FROM cms_blob_deletion_queue queue
      USING jsonb_to_recordset($1::jsonb) AS removed(project_id text, url text)
      WHERE queue.project_id = removed.project_id
        AND queue.url = removed.url`,
    [JSON.stringify(rows)],
  );
}

async function flushRows(rows: QueuedBlobRow[]) {
  if (rows.length === 0 || !process.env.BLOB_READ_WRITE_TOKEN) return;

  const sql = getCmsDatabase();
  const referencedRows = (await sql.query(
    `SELECT DISTINCT image.src AS url
       FROM cms_project_images image
       JOIN jsonb_to_recordset($1::jsonb) AS pending(url text)
         ON pending.url = image.src`,
    [JSON.stringify(rows.map(({ url }) => ({ url })))],
  )) as { url: string }[];
  const referencedUrls = new Set(referencedRows.map(({ url }) => url));
  const sharedRows = rows.filter(({ url }) => referencedUrls.has(url));
  const deletableRows = rows.filter(({ url }) => !referencedUrls.has(url));

  // A file still referenced by another project is not orphaned and must remain in Blob.
  await removeQueueEntries(sharedRows);
  if (deletableRows.length === 0) return;

  try {
    await del([...new Set(deletableRows.map(({ url }) => url))]);
    await removeQueueEntries(deletableRows);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Blob deletion error";
    await sql.query(
      `UPDATE cms_blob_deletion_queue queue
          SET last_attempt_at = now(),
              last_error = $2
         FROM jsonb_to_recordset($1::jsonb) AS failed(project_id text, url text)
        WHERE queue.project_id = failed.project_id
          AND queue.url = failed.url`,
      [JSON.stringify(deletableRows), message.slice(0, 1000)],
    );
    console.error("Project media cleanup remains queued for retry.", error);
  }
}

export async function flushProjectBlobDeletions(projectId: string) {
  if (!isCmsDatabaseConfigured()) return;
  const sql = getCmsDatabase();
  const rows = (await sql.query(
    `SELECT project_id, url
       FROM cms_blob_deletion_queue
      WHERE project_id = $1
      ORDER BY created_at`,
    [projectId],
  )) as QueuedBlobRow[];
  await flushRows(rows);
}

export async function flushPendingBlobDeletions() {
  if (!isCmsDatabaseConfigured() || !process.env.BLOB_READ_WRITE_TOKEN) return;
  const sql = getCmsDatabase();
  const rows = (await sql.query(
    `SELECT project_id, url
       FROM cms_blob_deletion_queue
      ORDER BY created_at
      LIMIT 100`,
  )) as QueuedBlobRow[];
  await flushRows(rows);
}
