import { getBearerTokenFromRequest, readJsonBody } from '../common/http.js';
import { withAuthRoute, withPublicRoute } from '../common/routes.js';
import { login } from './login.service.js';
import { logout } from './logout.service.js';
import { renderLoginPage, type LoginPageOptions } from './login-page.js';
import type { LoginInput } from './types.js';

export interface AuthRoutesOptions {
  loginPath?: string;
  logoutPath?: string;
  profilePath?: string;
  loginPagePath?: string;
  loginPage?: LoginPageOptions | false;
}

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

export function createLoginPageRoute(options: LoginPageOptions = {}): RouteHandler {
  const html = renderLoginPage(options);
  return withPublicRoute(async () => {
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  });
}

export function createAuthRoutes(options: AuthRoutesOptions = {}): Record<string, RouteHandler> {
  const loginPath = options.loginPath ?? '/api/auth/login';
  const logoutPath = options.logoutPath ?? '/api/auth/logout';
  const profilePath = options.profilePath ?? '/api/profile';
  const loginPagePath = options.loginPagePath ?? '/login';

  const routes: Record<string, RouteHandler> = {
    [`POST ${loginPath}`]: createLoginRoute(),
    [`POST ${logoutPath}`]: createLogoutRoute(),
    [`GET ${profilePath}`]: createProfileRoute(),
  };

  if (options.loginPage !== false) {
    routes[`GET ${loginPagePath}`] = createLoginPageRoute(options.loginPage ?? {});
  }

  return routes;
}
