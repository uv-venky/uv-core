-- Rollback: 202406030001_add_apps_table.down.sql

SET search_path TO sm, public;

DROP INDEX IF EXISTS uv_apps_name_idx;
DROP INDEX IF EXISTS uv_apps_app_id_idx;
DROP TABLE IF EXISTS uv_apps;
