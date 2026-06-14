import { getBearerTokenFromRequest, readJsonBody } from '../common/http.js';
import { withAuthRoute, withPublicRoute } from '../common/routes.js';
import { login } from './login.service.js';
import { logout } from './logout.service.js';
import type { LoginInput } from './types.js';

type RouteHandler = (req: Request) => Promise<Response>;

export function createLoginRoute(): RouteHandler {
  return withPublicRoute(async (req) => {
    const body = await readJsonBody<LoginInput>(req);
    return Response.json(await login(body));
  });
}

export function createLogoutRoute(): RouteHandler {
  return withAuthRoute(async (req) => {
    const token = getBearerTokenFromRequest(req);
    if (token) {
      await logout(token);
    }
    return new Response(null, { status: 204 });
  });
}

export function createProfileRoute(): RouteHandler {
  return withAuthRoute(async (_req, auth) => Response.json({ user: auth.user }));
}
