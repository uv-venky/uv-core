interface AdminConfig {
    email: string;
    password: string;
}
export interface AppConfig {
    appId: string;
    dbUrl: string;
    secret: string;
    jwtExpiresIn: string;
    migrationsDir: string;
    init: {
        admin: AdminConfig;
    };
}
export declare function getConfig(_name?: string): AppConfig;
export declare function loadConfig(_name?: string): AppConfig;
export declare function configure(overrides: Partial<AppConfig>): AppConfig;
export declare function resetConfigForTests(): void;
export type FrameworkConfig = AppConfig;
export {};
//# sourceMappingURL=config.d.ts.map