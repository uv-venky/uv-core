import type { PgPoolClient } from '../database/postgres.js';
import type { AuthenticatedRequest } from '../auth/auth.middleware.js';
export interface ActionRegistry {
    ACTIONS: Record<string, (client: PgPoolClient, session: AuthenticatedRequest, ...args: any[]) => Promise<any>>;
    ACTION_ACCESS_ROLES: Record<string, string[]>;
}
declare global {
    var _$uvActionRegistry: ActionRegistry | null | undefined;
}
export declare function getActionRegistry(): ActionRegistry;
export declare function setActionRegistry(registry: ActionRegistry): void;
/**
 * Invokes an authenticated action checking role authorization.
 */
export declare function invokeAction(client: PgPoolClient, auth: AuthenticatedRequest, actionName: string, ...args: any[]): Promise<any>;
/**
 * Invokes a public, unauthenticated action.
 */
export declare function invokePublicAction(client: PgPoolClient, actionName: string, ...args: any[]): Promise<any>;
//# sourceMappingURL=registry.d.ts.map