BEGIN;

UPDATE cms_projects
   SET cover_image_id = CASE id
         WHEN 'project-lucas-will' THEN 'lucas-will-01'
         WHEN 'project-mckenzie-jordan' THEN 'mckenzie-jordan-01'
         WHEN 'project-isabelle-marshall' THEN 'isabelle-marshall-01'
       END,
       updated_at = now()
 WHERE id IN (
   'project-lucas-will',
   'project-mckenzie-jordan',
   'project-isabelle-marshall'
 );

WITH canonical_order AS (
  SELECT image.id,
         substring(image.id FROM '([0-9]+)$')::integer AS position
    FROM cms_project_images image
   WHERE image.project_id IN (
     'project-lucas-will',
     'project-mckenzie-jordan',
     'project-isabelle-marshall'
   )
)
UPDATE cms_project_images image
   SET position = canonical_order.position,
       updated_at = now()
  FROM canonical_order
 WHERE image.id = canonical_order.id
   AND image.position IS DISTINCT FROM canonical_order.position;

COMMIT;
