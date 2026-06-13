import { UserError, ForbiddenError } from '../common/exceptions.js';
export function getActionRegistry() {
    const reg = globalThis._$uvActionRegistry;
    if (!reg) {
        throw new Error('Action registry not set. setActionRegistry() must be called to register actions in the application.');
    }
    return reg;
}
export function setActionRegistry(registry) {
    globalThis._$uvActionRegistry = registry;
}
/**
 * Invokes an authenticated action checking role authorization.
 */
export async function invokeAction(client, auth, actionName, ...args) {
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
export async function invokePublicAction(client, actionName, ...args) {
    const { ACTIONS, ACTION_ACCESS_ROLES } = getActionRegistry();
    const actionFn = ACTIONS[actionName];
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
//# sourceMappingURL=registry.js.map