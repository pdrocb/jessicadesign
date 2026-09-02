CREATE TABLE IF NOT EXISTS cms_seed_state (
  content_key text PRIMARY KEY,
  seeded_at timestamptz NOT NULL DEFAULT now()
);

WITH first_images AS (
  SELECT DISTINCT ON (image.project_id)
         image.project_id,
         image.id
    FROM cms_project_images image
   ORDER BY image.project_id, image.position, image.id
)
UPDATE cms_projects project
   SET cover_image_id = first_images.id,
       updated_at = now()
  FROM first_images
 WHERE project.id = first_images.project_id
   AND project.cover_image_id IS DISTINCT FROM first_images.id;

INSERT INTO cms_seed_state (content_key)
SELECT 'lookbook'
WHERE EXISTS (SELECT 1 FROM cms_projects)
ON CONFLICT (content_key) DO NOTHING;

CREATE TABLE IF NOT EXISTS cms_blob_deletion_queue (
  project_id text NOT NULL,
  url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_attempt_at timestamptz,
  last_error text,
  PRIMARY KEY (project_id, url)
);

CREATE INDEX IF NOT EXISTS cms_blob_deletion_queue_created_at_idx
  ON cms_blob_deletion_queue (created_at);
