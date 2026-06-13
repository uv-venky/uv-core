import { type LoginPageOptions } from '../../components/login-page.js';
export interface AuthRoutesOptions {
    loginPath?: string;
    logoutPath?: string;
    profilePath?: string;
    loginPagePath?: string;
    loginPage?: LoginPageOptions | false;
}
type RouteHandler = (req: Request) => Promise<Response>;
export declare function createLoginRoute(): RouteHandler;
export declare function createLogoutRoute(): RouteHandler;
export declare function createProfileRoute(): RouteHandler;
export declare function createLoginPageRoute(options?: LoginPageOptions): RouteHandler;
export declare function createAuthRoutes(options?: AuthRoutesOptions): Record<string, RouteHandler>;
export {};
//# sourceMappingURL=auth.routes.d.ts.map