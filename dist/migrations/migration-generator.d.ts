export interface CreateMigrationOptions {
    name: string;
    migrationsDir?: string;
    version?: number;
}
export declare function createMigrationFile(options: CreateMigrationOptions): Promise<string>;
//# sourceMappingURL=migration-generator.d.ts.map