-- Read-only: inspect existing schema/constraints and proposed identity collisions.
SELECT indexname, indexdef FROM pg_indexes WHERE schemaname = 'public' AND tablename = 'tile_images';
SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'public.tile_images'::regclass;
WITH paths AS (
  SELECT *, lower(btrim(replace(local_path, chr(92), '/'))) AS source FROM public.tile_images
), identities AS (
  SELECT id, jsonb_build_array(lower(btrim(size)), lower(btrim(category)),
    coalesce(array_to_string((string_to_array(source, '/'))[3:cardinality(string_to_array(source, '/'))-1], '/'), ''),
    lower(btrim(filename)), coalesce(substring(source FROM '\.([^./]+)$'), '')) AS identity FROM paths
)
SELECT identity, count(*) FROM identities GROUP BY identity HAVING count(*) > 1;
SELECT lower(btrim(replace(local_path, chr(92), '/'))) AS source, count(*)
FROM public.tile_images GROUP BY source HAVING count(*) > 1;
