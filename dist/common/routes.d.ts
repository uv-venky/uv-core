import { type AuthenticatedRequest } from '../auth/auth.middleware.js';
export type { AuthenticatedRequest };
export declare function withPublicRoute(callback: (req: Request) => Promise<Response>): (req: Request) => Promise<Response>;
export declare function withAuthRoute(callback: (req: Request, auth: AuthenticatedRequest) => Promise<Response>): (req: Request) => Promise<Response>;
export declare function withRoleRoute(roles: string[], callback: (req: Request, auth: AuthenticatedRequest) => Promise<Response>): (req: Request) => Promise<Response>;
//# sourceMappingURL=routes.d.ts.map