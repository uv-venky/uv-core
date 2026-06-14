SET search_path TO sm, public;

ALTER TABLE uv_saved_search ADD COLUMN app_id VARCHAR(128) NOT NULL DEFAULT 'core';

CREATE INDEX IF NOT EXISTS uv_saved_search_app_id_idx ON uv_saved_search(app_id);
