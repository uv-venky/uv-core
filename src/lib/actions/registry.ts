import type { PgPoolClient } from '../database/postgres.js';
import type { AuthenticatedRequest } from '../auth/auth.middleware.js';
import { UserError, ForbiddenError } from '../common/exceptions.js';

export interface ActionRegistry {
  ACTIONS: Record<string, (client: PgPoolClient, session: AuthenticatedRequest, ...args: any[]) => Promise<any>>;
  ACTION_ACCESS_ROLES: Record<string, string[]>;
}

declare global {
  // eslint-disable-next-line no-var
  var _$uvActionRegistry: ActionRegistry | null | undefined;
}

export function getActionRegistry(): ActionRegistry {
  const reg = globalThis._$uvActionRegistry;
  if (!reg) {
    throw new Error(
      'Action registry not set. setActionRegistry() must be called to register actions in the application.',
    );
  }
  return reg;
}

export function setActionRegistry(registry: ActionRegistry): void {
  globalThis._$uvActionRegistry = registry;
}

/**
 * Invokes an authenticated action checking role authorization.
 */
export async function invokeAction(
  client: PgPoolClient,
  auth: AuthenticatedRequest,
  actionName: string,
  ...args: any[]
): Promise<any> {
  const { ACTIONS, ACTION_ACCESS_ROLES } = getActionRegistry();
  const actionFn = ACTIONS[actionName];
  if (!actionFn) {
    throw new UserError(`Action ${actionName} not found!`, 404);
  }

  const accessRoles = ACTION_ACCESS_ROLES[actionName];
  const hasAccess = accessRoles?.some((role) => {
    if (role === 'all_users') {
      return auth.user.userName !== 'guest';
    }
    return auth.user.roles.includes(role);
  });

  if (!hasAccess) {
    throw new ForbiddenError(`You do not have access to action ${actionName}`);
  }

  return actionFn(client, auth, ...args);
}

/**
 * Invokes a public, unauthenticated action.
 */
export async function invokePublicAction(
  client: PgPoolClient,
  actionName: string,
  ...args: any[]
): Promise<any> {
  const { ACTIONS, ACTION_ACCESS_ROLES } = getActionRegistry();
  const actionFn = ACTIONS[actionName] as unknown as (
    client: PgPoolClient,
    ...args: any[]
  ) => Promise<any>;

  if (!actionFn) {
    throw new UserError(`Action ${actionName} not found!`, 404);
  }

  const accessRoles = ACTION_ACCESS_ROLES[actionName];
  const isPublic = accessRoles?.some((role) => role === 'public');

  if (!isPublic) {
    throw new ForbiddenError(`You do not have access to action ${actionName}`);
  }

  return actionFn(client, ...args);
}
