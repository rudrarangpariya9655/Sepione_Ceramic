# Tile identity rollout

This migration is **not applied automatically**. The application continues to serve public collections and admin reads without it. Uploads, edits and bulk migration fail closed until identity protection is installed.

`local_path` is immutable import provenance. Existing paths include nested design-series folders and Windows separators. Logical identity uses normalized size, current category, source subfolder, current filename and image extension. Consequently, JPG/PNG variants and separate series remain distinct. Manual uploads receive a unique `upload:<uuid>.<extension>` provenance value, so renaming frees the previous logical name. No Cloudinary IDs or existing source paths change.

A generated database column and unique indexes enforce identity for concurrent writes. Application checks give readable errors, but are not the concurrency safeguard. The source-path index separately prevents re-importing the same source under different casing/separators after a rename.

## Before applying

1. Pause admin writes and take a Supabase database backup or `pg_dump` of the schema and `public.tile_images`. Keep the backup outside Git and verify it can be restored in a separate database.
2. Run `preflight.sql` in the Supabase SQL editor with administrative access. It lists existing indexes/constraints; both collision queries must return zero rows. Do not delete records to resolve a collision.
3. Review `001-tile-identity.sql`, then run it in the SQL editor. It adds only a function, generated column and indexes; it does not rename, delete or re-upload catalogue entries. The transaction rolls back if a collision exists. Lock acquisition times out after five seconds instead of waiting indefinitely; retry during a quiet period if needed.
4. Confirm `logical_identity` appears in the REST schema, then enable admin writes. Allow PostgREST to reload its schema cache. Keep the server-only service key out of browser configuration.

The REST metadata available to this project does not expose all PostgreSQL constraints. Review the preflight index/constraint output on the real database before applying. Existing primary keys, unique constraints, grants and RLS policies are preserved.

## Rollback

Disable admin writes or restore a compatible application release first. Run `001-tile-identity-rollback.sql`. It removes only these added indexes, column and function; original rows and image references remain. Do not remove unrelated indexes. Restore from backup only if required after investigating a failed rollout.

## Validation

`npm test` runs the actual migration and rollback in an isolated in-memory PostgreSQL database (PGlite). Tests cover preservation of original rows/provenance, rename and name reuse, case normalization, extension/subfolder separation, uniqueness violations, and atomic rollback on pre-existing collisions. No live credentials are used by these tests.
