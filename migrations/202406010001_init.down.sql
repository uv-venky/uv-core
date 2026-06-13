-- Rollback: 202406010001_init.down.sql

DROP INDEX IF EXISTS uv_user_roles_app_id_idx;
DROP INDEX IF EXISTS uv_roles_app_id_idx;
DROP INDEX IF EXISTS uv_revoked_tokens_expires_at_idx;
DROP TABLE IF EXISTS uv_revoked_tokens;
DROP TABLE IF EXISTS uv_saved_search;
DROP TABLE IF EXISTS uv_audit;
DROP TABLE IF EXISTS uv_user_roles;
DROP TABLE IF EXISTS uv_roles;
DROP TABLE IF EXISTS uv_user_sessions_arch;
DROP TABLE IF EXISTS uv_user_sessions;
DROP TABLE IF EXISTS uv_users;
