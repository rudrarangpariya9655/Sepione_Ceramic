-- Run with administrative database access after taking a schema/data backup.
-- No rows are renamed, deleted, or re-uploaded. Any collision aborts this transaction.
BEGIN;
SET LOCAL lock_timeout = '5s';

CREATE FUNCTION public.tile_logical_identity(tile_size text, tile_category text, tile_filename text, source_path text)
RETURNS jsonb LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE
SET search_path = pg_catalog
AS $$
  WITH source AS (
    SELECT lower(btrim(replace(source_path, chr(92), '/'))) AS path
  ), parts AS (
    SELECT path, string_to_array(path, '/') AS folders FROM source
  )
  SELECT jsonb_build_array(
    lower(btrim(tile_size)), lower(btrim(tile_category)),
    coalesce(array_to_string(folders[3:cardinality(folders)-1], '/'), ''),
    lower(btrim(tile_filename)), coalesce(substring(path FROM '\.([^./]+)$'), '')
  ) FROM parts;
$$;

ALTER TABLE public.tile_images ADD COLUMN logical_identity jsonb
  GENERATED ALWAYS AS (public.tile_logical_identity(size, category, filename, local_path)) STORED;
CREATE UNIQUE INDEX tile_images_logical_identity_key ON public.tile_images (logical_identity);
-- Preserve import idempotency even after a tile's display name/category changes.
CREATE UNIQUE INDEX tile_images_source_identity_key ON public.tile_images (lower(btrim(replace(local_path, chr(92), '/'))));

NOTIFY pgrst, 'reload schema';
COMMIT;
