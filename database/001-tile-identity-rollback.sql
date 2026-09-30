-- First revert application writes to a compatible release or disable admin writes.
BEGIN;
SET LOCAL lock_timeout = '5s';
DROP INDEX IF EXISTS public.tile_images_source_identity_key;
DROP INDEX IF EXISTS public.tile_images_logical_identity_key;
ALTER TABLE public.tile_images DROP COLUMN IF EXISTS logical_identity;
DROP FUNCTION IF EXISTS public.tile_logical_identity(text, text, text, text);
NOTIFY pgrst, 'reload schema';
COMMIT;
