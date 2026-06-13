export declare const SCHEMA_NAME = "sm";
export declare const PREFIX = "uv_";
export declare const USERS_TABLE = "sm.uv_users";
export declare const USER_SESSIONS_TABLE = "sm.uv_user_sessions";
export declare const USER_SESSIONS_ARCH_TABLE = "sm.uv_user_sessions_arch";
export declare const ROLES_TABLE = "sm.uv_roles";
export declare const USER_ROLES_TABLE = "sm.uv_user_roles";
export declare const AUDIT_TABLE = "sm.uv_audit";
export declare const SAVED_SEARCH_TABLE = "sm.uv_saved_search";
export declare const REVOKED_TOKENS_TABLE = "sm.uv_revoked_tokens";
export declare const SCHEMA_MIGRATIONS_TABLE = "sm.uv_migrations";
export declare const APPS_TABLE = "sm.uv_apps";
export declare const DEFAULT_APP_ID = "core";
export declare const DEFAULT_JWT_EXPIRES_IN = "1h";
export declare const DEFAULT_MIGRATIONS_DIR = "./migrations";
export declare const AUTH_HEADER = "authorization";
export declare const BEARER_PREFIX = "Bearer ";
export declare const HTTP: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly INTERNAL_SERVER_ERROR: 500;
};
//# sourceMappingURL=constants.d.ts.map