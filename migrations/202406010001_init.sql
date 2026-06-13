-- Migration: 202406010001_init.sql
-- Mirrors core/migrations/20240419_init.sql with uv_ prefix (+ uv_revoked_tokens for JWT logout)

CREATE TABLE uv_users (
  user_name VARCHAR(128) NOT NULL,
  user_id INTEGER,
  email VARCHAR(128) NOT NULL,
  display_name VARCHAR(128) NOT NULL,
  location_name VARCHAR(128),
  picture TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  created_by VARCHAR(128) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  updated_by VARCHAR(128) NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  password_hash VARCHAR(256) NOT NULL,
  api_key VARCHAR(256),
  api_secret VARCHAR(256),
  previous_password_hashes JSONB NOT NULL,
  last_login TIMESTAMPTZ,
  ip_address VARCHAR(128),
  locked BOOLEAN NOT NULL,
  failed_login_attempts INTEGER NOT NULL,
  last_failed_login TIMESTAMPTZ,
  last_failed_login_ip_address VARCHAR(128),
  last_password_reset TIMESTAMPTZ,
  last_password_reset_ip_address VARCHAR(128),
  last_password_reset_by VARCHAR(128),
  settings JSONB NOT NULL,
  CONSTRAINT uv_users_pk PRIMARY KEY (user_name)
);

CREATE TABLE uv_user_sessions (
  user_name VARCHAR(128) NOT NULL,
  user_id INTEGER,
  session_id VARCHAR(40) NOT NULL,
  ip_address VARCHAR(128) NOT NULL,
  user_agent TEXT NOT NULL,
  csrf_token VARCHAR(128) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  signed_in_at TIMESTAMPTZ NOT NULL,
  last_accessed_at TIMESTAMPTZ NOT NULL,
  signed_out_at TIMESTAMPTZ,
  CONSTRAINT uv_user_sessions_pk PRIMARY KEY (session_id)
);

CREATE TABLE uv_user_sessions_arch (
  user_name VARCHAR(128) NOT NULL,
  user_id INTEGER,
  session_id VARCHAR(40) NOT NULL,
  ip_address VARCHAR(128) NOT NULL,
  user_agent TEXT NOT NULL,
  csrf_token VARCHAR(128) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  signed_in_at TIMESTAMPTZ NOT NULL,
  last_accessed_at TIMESTAMPTZ NOT NULL,
  signed_out_at TIMESTAMPTZ,
  CONSTRAINT uv_user_sessions_arch_pk PRIMARY KEY (session_id)
);

CREATE TABLE uv_roles (
  role_code VARCHAR(128) NOT NULL,
  role_name VARCHAR(128) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  created_by VARCHAR(128) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  updated_by VARCHAR(128) NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  app_id VARCHAR(128) NOT NULL DEFAULT 'core',
  CONSTRAINT uv_roles_pk PRIMARY KEY (role_code)
);

CREATE TABLE uv_user_roles (
  role_code VARCHAR(128) NOT NULL,
  user_name VARCHAR(128) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  created_by VARCHAR(128) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  updated_by VARCHAR(128) NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  app_id VARCHAR(128) NOT NULL DEFAULT 'core',
  CONSTRAINT uv_user_roles_pk PRIMARY KEY (user_name, role_code)
);

CREATE TABLE uv_audit (
  datasource_id VARCHAR(40) NOT NULL,
  pk_value VARCHAR(120) NOT NULL,
  attribute_code VARCHAR(40) NOT NULL,
  value_type VARCHAR(20) NOT NULL,
  old_string_value VARCHAR(512) DEFAULT NULL,
  new_string_value VARCHAR(512) DEFAULT NULL,
  old_clob_value TEXT,
  new_clob_value TEXT,
  old_double_value DOUBLE PRECISION,
  new_double_value DOUBLE PRECISION,
  old_datetime_value TIMESTAMPTZ DEFAULT NULL,
  new_datetime_value TIMESTAMPTZ DEFAULT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  updated_by VARCHAR(128) NOT NULL,
  audit_id SERIAL,
  PRIMARY KEY (audit_id)
);

CREATE TABLE uv_saved_search (
  id VARCHAR(40) NOT NULL,
  page_id VARCHAR(40) NOT NULL,
  item_id VARCHAR(40) NOT NULL,
  owner VARCHAR(128) NOT NULL,
  name VARCHAR(120) NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL,
  is_default BOOLEAN NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  created_by VARCHAR(128) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  updated_by VARCHAR(128) NOT NULL,
  CONSTRAINT uv_saved_search_pk PRIMARY KEY (id)
);

CREATE TABLE uv_revoked_tokens (
  jti VARCHAR(64) NOT NULL,
  user_name VARCHAR(128) NOT NULL REFERENCES uv_users(user_name) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uv_revoked_tokens_pk PRIMARY KEY (jti)
);

CREATE INDEX uv_revoked_tokens_expires_at_idx ON uv_revoked_tokens (expires_at);
CREATE INDEX uv_roles_app_id_idx ON uv_roles (app_id);
CREATE INDEX uv_user_roles_app_id_idx ON uv_user_roles (app_id);

INSERT INTO uv_roles (role_code, role_name, description, created_at, created_by, updated_at, updated_by, start_date)
VALUES
  ('root', 'Super Administrator', 'Super Administrator role', now(), 'system', now(), 'system', now()),
  ('admin', 'Administrator', 'Administrator role', now(), 'system', now(), 'system', now()),
  ('user_admin', 'User Administrator', 'User Administrator role', now(), 'system', now(), 'system', now()),
  ('user', 'User', 'User role', now(), 'system', now(), 'system', now());

INSERT INTO uv_users (
  user_name, email, display_name, created_at, created_by, updated_at, updated_by,
  start_date, password_hash, previous_password_hashes, locked, failed_login_attempts, settings
)
VALUES (
  'admin',
  'admin@example.com',
  'Admin',
  now(), 'system', now(), 'system',
  now(),
  '$2b$12$cYnlTYHNhZg.gnEKx1OsnuEuyg5RI.wkv9tIS06NlKhixEjlKhg..',
  '[]'::jsonb,
  false,
  0,
  '{"theme":"light"}'::jsonb
);

INSERT INTO uv_user_roles (role_code, user_name, created_at, created_by, updated_at, updated_by, start_date)
VALUES
  ('root', 'admin', now(), 'system', now(), 'system', now()),
  ('admin', 'admin', now(), 'system', now(), 'system', now());
