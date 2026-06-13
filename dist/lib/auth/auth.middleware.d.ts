import type { AuthUser } from './types.js';
export interface AuthenticatedRequest {
    user: AuthUser;
    tokenId: string;
}
export declare function authenticateRequest(req: Request): Promise<AuthenticatedRequest>;
export declare function optionalAuthenticateRequest(req: Request): Promise<AuthenticatedRequest | null>;
export declare function hasRole(user: AuthUser, ...allowedRoles: string[]): boolean;
export declare function assertRole(user: AuthUser, ...allowedRoles: string[]): void;
//# sourceMappingURL=auth.middleware.d.ts.map