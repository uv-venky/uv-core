SET search_path TO sm, public;

DROP INDEX IF EXISTS uv_saved_search_app_id_idx;

ALTER TABLE uv_saved_search DROP COLUMN IF EXISTS app_id;
