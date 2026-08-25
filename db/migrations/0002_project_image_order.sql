BEGIN;

ALTER TABLE cms_project_images
  DROP CONSTRAINT IF EXISTS cms_project_images_project_id_position_key;

ALTER TABLE cms_project_images
  DROP CONSTRAINT IF EXISTS cms_project_images_project_position_unique;

ALTER TABLE cms_project_images
  ADD CONSTRAINT cms_project_images_project_position_unique
  UNIQUE (project_id, position) DEFERRABLE INITIALLY DEFERRED;

WITH ranked_images AS (
  SELECT image.id,
         row_number() OVER (
           PARTITION BY image.project_id
           ORDER BY CASE WHEN image.id = project.cover_image_id THEN 0 ELSE 1 END,
                    image.position,
                    image.id
         )::integer AS next_position
    FROM cms_project_images image
    JOIN cms_projects project ON project.id = image.project_id
)
UPDATE cms_project_images image
   SET position = ranked.next_position,
       updated_at = now()
  FROM ranked_images ranked
 WHERE image.id = ranked.id
   AND image.position IS DISTINCT FROM ranked.next_position;

COMMIT;
