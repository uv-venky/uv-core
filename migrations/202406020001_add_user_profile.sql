-- Migration: 202406020001_add_user_profile.sql

CREATE INDEX IF NOT EXISTS uv_users_email_idx ON uv_users (email);
CREATE INDEX IF NOT EXISTS uv_user_roles_user_name_idx ON uv_user_roles (user_name);
CREATE INDEX IF NOT EXISTS uv_user_sessions_user_name_idx ON uv_user_sessions (user_name);
CREATE INDEX IF NOT EXISTS uv_saved_search_owner_idx ON uv_saved_search (owner);
