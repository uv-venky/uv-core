import { readJsonBody } from '../common/http.js';
import { withAuthRoute, withPublicRoute } from '../common/routes.js';
import { transaction } from '../database/postgres.js';
import { invokeAction, invokePublicAction } from './registry.js';

export function createActionRoute() {
  return withAuthRoute(async (req, auth) => {
    const body = await readJsonBody<[string, ...any[]]>(req);
    if (!Array.isArray(body) || body.length === 0) {
      return Response.json({ status: 'ERROR', message: 'Invalid request body: must be an array starting with action name' }, { status: 400 });
    }
    const [actionName, ...params] = body;
    const result = await transaction(async (client) => {
      return invokeAction(client, auth, actionName, ...params);
    });
    return Response.json({ status: 'OK', result });
  });
}

export function createPublicActionRoute() {
  return withPublicRoute(async (req) => {
    const body = await readJsonBody<[string, ...any[]]>(req);
    if (!Array.isArray(body) || body.length === 0) {
      return Response.json({ status: 'ERROR', message: 'Invalid request body: must be an array starting with action name' }, { status: 400 });
    }
    const [actionName, ...params] = body;
    const result = await transaction(async (client) => {
      return invokePublicAction(client, actionName, ...params);
    });
    return Response.json({ status: 'OK', result });
  });
}
