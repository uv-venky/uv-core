export const SCHEMA_NAME = 'sm';
export const PREFIX = 'uv_';
export const USERS_TABLE = `${SCHEMA_NAME}.${PREFIX}users`;
export const USER_SESSIONS_TABLE = `${SCHEMA_NAME}.${PREFIX}user_sessions`;
export const USER_SESSIONS_ARCH_TABLE = `${SCHEMA_NAME}.${PREFIX}user_sessions_arch`;
export const ROLES_TABLE = `${SCHEMA_NAME}.${PREFIX}roles`;
export const USER_ROLES_TABLE = `${SCHEMA_NAME}.${PREFIX}user_roles`;
export const AUDIT_TABLE = `${SCHEMA_NAME}.${PREFIX}audit`;
export const SAVED_SEARCH_TABLE = `${SCHEMA_NAME}.${PREFIX}saved_search`;
export const REVOKED_TOKENS_TABLE = `${SCHEMA_NAME}.${PREFIX}revoked_tokens`;
export const SCHEMA_MIGRATIONS_TABLE = `${SCHEMA_NAME}.${PREFIX}migrations`;
export const APPS_TABLE = `${SCHEMA_NAME}.${PREFIX}apps`;
export const DEFAULT_APP_ID = 'core';
export const DEFAULT_JWT_EXPIRES_IN = '1h';
export const DEFAULT_MIGRATIONS_DIR = './migrations';
export const AUTH_HEADER = 'authorization';
export const BEARER_PREFIX = 'Bearer ';
export const HTTP = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};
//# sourceMappingURL=constants.js.map