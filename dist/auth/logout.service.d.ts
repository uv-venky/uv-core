export declare function logout(token: string): Promise<void>;
export declare function assertTokenNotRevoked(jti: string): Promise<void>;
export declare function cleanupExpiredRevokedTokens(): Promise<number>;
//# sourceMappingURL=logout.service.d.ts.map