import { type LoginPageOptions } from '../../components/login-page.js';
import { type ResetPasswordPageOptions } from '../../components/reset-password-page.js';
import { type NewPasswordPageOptions } from '../../components/new-password-page.js';
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
export declare function createLoginPageRoute(options?: LoginPageOptions): RouteHandler;
export declare function createResetPasswordPageRoute(options?: ResetPasswordPageOptions): RouteHandler;
export declare function createNewPasswordPageRoute(options?: NewPasswordPageOptions): RouteHandler;
export declare function createAuthRoutes(options?: AuthRoutesOptions): Record<string, RouteHandler>;
//# sourceMappingURL=auth.routes.d.ts.map