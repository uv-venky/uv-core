import { randomUUID } from 'node:crypto';
import logger from './logger.js';
import { createErrorResponse } from './error-response.js';
import { getErrorMessage, isUserError } from './exceptions.js';
import { authenticateRequest } from '../auth/auth.middleware.js';
function buildLogContext(req) {
    return {
        trackId: req.headers.get('x-track-id') ?? randomUUID(),
        method: req.method,
        path: new URL(req.url).pathname,
    };
}
function toErrorResponse(req, error) {
    return Response.json(createErrorResponse(error), {
        status: isUserError(error) ? error.statusCode : 500,
    });
}
export function withPublicRoute(callback) {
    return async (req) => {
        return logger.runWithContext(buildLogContext(req), async () => {
            try {
                logger.info('incoming request');
                const response = await callback(req);
                logger.info('request completed', { statusCode: response.status });
                return response;
            }
            catch (error) {
                logger.error('request failed', { error: getErrorMessage(error) });
                return toErrorResponse(req, error);
            }
        });
    };
}
export function withAuthRoute(callback) {
    return async (req) => {
        return logger.runWithContext(buildLogContext(req), async () => {
            try {
                const auth = await authenticateRequest(req);
                logger.info('incoming request', { userName: auth.user.userName, email: auth.user.email });
                const response = await callback(req, auth);
                logger.info('request completed', { statusCode: response.status });
                return response;
            }
            catch (error) {
                logger.error('request failed', { error: getErrorMessage(error) });
                return toErrorResponse(req, error);
            }
        });
    };
}
export function withRoleRoute(roles, callback) {
    return withAuthRoute(async (req, auth) => {
        const hasRole = auth.user.roles.some((role) => roles.includes(role));
        if (!hasRole) {
            return Response.json({ status: 'ERROR', message: 'Forbidden' }, { status: 403 });
        }
        return callback(req, auth);
    });
}
//# sourceMappingURL=routes.js.map