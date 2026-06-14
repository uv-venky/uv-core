import { withPublicRoute } from '../common/routes.js';
import { renderLoginPage } from '../../components/login-page.js';
import { renderResetPasswordPage } from '../../components/reset-password-page.js';
import { renderNewPasswordPage } from '../../components/new-password-page.js';
import { createLoginRoute, createLogoutRoute, createProfileRoute, } from './auth.api.routes.js';
export { createLoginRoute, createLogoutRoute, createProfileRoute } from './auth.api.routes.js';
export function createLoginPageRoute(options = {}) {
    const html = renderLoginPage(options);
    return withPublicRoute(async () => {
        return new Response(html, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
    });
}
export function createResetPasswordPageRoute(options = {}) {
    const html = renderResetPasswordPage(options);
    return withPublicRoute(async () => {
        return new Response(html, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
    });
}
export function createNewPasswordPageRoute(options = {}) {
    const html = renderNewPasswordPage(options);
    return withPublicRoute(async () => {
        return new Response(html, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
    });
}
export function createAuthRoutes(options = {}) {
    const loginPath = options.loginPath ?? '/api/auth/login';
    const logoutPath = options.logoutPath ?? '/api/auth/logout';
    const profilePath = options.profilePath ?? '/api/profile';
    const loginPagePath = options.loginPagePath ?? '/login';
    const resetPasswordPagePath = options.resetPasswordPagePath ?? '/login/reset-password';
    const newPasswordPagePath = options.newPasswordPagePath ?? '/login/reset-password/change';
    const routes = {
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
//# sourceMappingURL=auth.routes.js.map