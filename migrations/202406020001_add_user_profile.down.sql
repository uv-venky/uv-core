-- Rollback: 202406020001_add_user_profile.down.sql

SET search_path TO sm, public;

DROP INDEX IF EXISTS uv_saved_search_owner_idx;
DROP INDEX IF EXISTS uv_user_sessions_user_name_idx;
DROP INDEX IF EXISTS uv_user_roles_user_name_idx;
DROP INDEX IF EXISTS uv_users_email_idx;
