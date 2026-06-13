import type { AuthUser, JwtPayload } from './types.js';
export declare function hashPassword(password: string): Promise<string>;
export declare function verifyPassword(password: string, passwordHash: string): Promise<boolean>;
export declare function signAccessToken(user: AuthUser, tokenId?: string): {
    token: string;
    jti: string;
};
export declare function verifyAccessToken(token: string): JwtPayload;
export declare function toAuthUser(row: {
    user_name: string;
    user_id: number | null;
    email: string;
    display_name: string;
}, roles: string[]): AuthUser;
//# sourceMappingURL=jwt.service.d.ts.map