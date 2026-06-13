export interface AuthUser {
    userName: string;
    userId?: number | null;
    email: string;
    displayName: string;
    roles: string[];
}
export interface JwtPayload {
    sub: string;
    userName: string;
    email: string;
    displayName: string;
    roles: string[];
    jti: string;
    iat?: number;
    exp?: number;
}
export interface LoginInput {
    email: string;
    password: string;
}
export interface LoginResult {
    accessToken: string;
    tokenType: 'Bearer';
    expiresIn: string;
    user: AuthUser;
}
export interface DbUserRow {
    user_name: string;
    user_id: number | null;
    email: string;
    display_name: string;
    password_hash: string;
    start_date: Date;
    end_date: Date | null;
    locked: boolean;
}
//# sourceMappingURL=types.d.ts.map