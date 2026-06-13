import type { AuthUser, DbUserRow, LoginInput, LoginResult } from './types.js';
export declare function getUserByName(userName: string): Promise<DbUserRow | null>;
export declare function getAuthUserByName(userName: string): Promise<AuthUser | null>;
export declare function login(input: LoginInput): Promise<LoginResult>;
//# sourceMappingURL=login.service.d.ts.map