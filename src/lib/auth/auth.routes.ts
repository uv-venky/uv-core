import { getBearerTokenFromRequest, readJsonBody } from '../common/http.js';
import { withAuthRoute, withPublicRoute } from '../common/routes.js';
import { renderLoginPage, type LoginPageOptions } from '../../components/login-page.js';
import { renderResetPasswordPage, type ResetPasswordPageOptions } from '../../components/reset-password-page.js';
import { renderNewPasswordPage, type NewPasswordPageOptions } from '../../components/new-password-page.js';
import {
  createLoginRoute,
  createLogoutRoute,
  createProfileRoute,
} from './auth.api.routes.js';

export interface AuthRoutesOptions {
  loginPath?: string;
  logoutPath?: string;
  profilePath?: string;
  loginPagePath?: string;
  loginPage?: LoginPageOptions | false;
  resetPasswordPagePath?: string;
  resetPasswordPage?: ResetPasswordPageOptions | false;
  newPasswordPagePath?: string;
  newPasswordPage?: NewPasswordPageOptions | false;
}

type RouteHandler = (req: Request) => Promise<Response>;

export { createLoginRoute, createLogoutRoute, createProfileRoute } from './auth.api.routes.js';

export function createLoginPageRoute(options: LoginPageOptions = {}): RouteHandler {
  const html = renderLoginPage(options);
  return withPublicRoute(async () => {
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  });
}

export function createResetPasswordPageRoute(options: ResetPasswordPageOptions = {}): RouteHandler {
  const html = renderResetPasswordPage(options);
  return withPublicRoute(async () => {
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  });
}

export function createNewPasswordPageRoute(options: NewPasswordPageOptions = {}): RouteHandler {
  const html = renderNewPasswordPage(options);
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
  const resetPasswordPagePath = options.resetPasswordPagePath ?? '/login/reset-password';
  const newPasswordPagePath = options.newPasswordPagePath ?? '/login/reset-password/change';

  const routes: Record<string, RouteHandler> = {
    [`POST ${loginPath}`]: createLoginRoute(),
    [`POST ${logoutPath}`]: createLogoutRoute(),
    [`GET ${profilePath}`]: createProfileRoute(),
  };

  if (options.loginPage !== false) {
    routes[`GET ${loginPagePath}`] = createLoginPageRoute(options.loginPage ?? {});
  }

  if (options.resetPasswordPage !== false) {
    routes[`GET ${resetPasswordPagePath}`] = createResetPasswordPageRoute(options.resetPasswordPage ?? {});
  }

  if (options.newPasswordPage !== false) {
    routes[`GET ${newPasswordPagePath}`] = createNewPasswordPageRoute(options.newPasswordPage ?? {});
  }

  return routes;
}
