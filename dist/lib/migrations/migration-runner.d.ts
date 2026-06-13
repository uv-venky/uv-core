import type { LoggerType } from '../common/logger.js';
import type { PgPoolClient } from '../database/postgres.js';
export type MigrationClient = Pick<PgPoolClient, 'query'>;
export interface MigrationRecord {
    version: number;
    name: string;
    checksum: string;
    installed_on: Date;
    success: boolean;
    execution_time: number;
}
export interface MigrationFile {
    fileName: string;
    version: number;
    name: string;
    filePath: string;
    downFilePath: string;
}
export type MigrationEntryStatus = 'skipped' | 'applied' | 'failed';
export interface MigrationStatusEntry {
    fileName: string;
    version: number;
    name: string;
    status: MigrationEntryStatus;
    checksum: string;
    storedChecksum?: string;
    executionTimeMs?: number;
}
export interface MigrationRunReport {
    migrationsDir: string;
    entries: MigrationStatusEntry[];
    appliedCount: number;
    skippedCount: number;
    failedCount: number;
}
export declare function listMigrationFiles(customDir?: string): Promise<MigrationFile[]>;
export declare function ensureMigrationsTable(client: MigrationClient): Promise<void>;
export declare function runMigrations(client: MigrationClient, logger: LoggerType, customDir?: string): Promise<MigrationRunReport>;
export declare function rollbackLastMigration(client: MigrationClient, logger: LoggerType, customDir?: string): Promise<boolean>;
//# sourceMappingURL=migration-runner.d.ts.map