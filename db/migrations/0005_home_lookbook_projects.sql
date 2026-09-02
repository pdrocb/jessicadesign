ALTER TABLE cms_projects
  DROP COLUMN featured_position,
  DROP COLUMN home_shape,
  DROP COLUMN home_cover_image_id;

ALTER TABLE cms_projects
  ADD CONSTRAINT cms_projects_featured_requires_published
  CHECK (NOT featured OR published);

CREATE INDEX IF NOT EXISTS cms_projects_home_idx
  ON cms_projects (position)
  WHERE published = true AND featured = true;

WITH preferred_order(slug, preferred_position) AS (
  VALUES
    ('lucas-will', 1),
    ('mckenzie-jordan', 2),
    ('morgan-garrett', 3),
    ('isabelle-marshall', 4),
    ('custom-tablescape', 5),
    ('cori-ezra', 6),
    ('garden-chic-styled-shoot-picnic', 7)
), canonical_order AS (
  SELECT project.id,
         row_number() OVER (
           ORDER BY
             COALESCE(preferred.preferred_position, 100000 + project.position),
             project.position,
             project.id
         )::integer AS position
    FROM cms_projects project
    LEFT JOIN preferred_order preferred ON preferred.slug = project.slug
)
UPDATE cms_projects project
   SET position = canonical_order.position,
       featured = project.slug IN (
         'lucas-will',
         'mckenzie-jordan',
         'morgan-garrett',
         'isabelle-marshall',
         'custom-tablescape',
         'cori-ezra',
         'garden-chic-styled-shoot-picnic'
       ),
       updated_at = now()
  FROM canonical_order
 WHERE project.id = canonical_order.id;
