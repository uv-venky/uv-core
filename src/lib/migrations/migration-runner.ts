import path from 'node:path';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { PREFIX, SCHEMA_MIGRATIONS_TABLE } from '../common/constants.js';
import { getConfig } from '../common/config.js';
import { isEnvTruthy } from '../common/utils.js';
import { getErrorMessage } from '../common/exceptions.js';
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

function generateChecksum(content: string): string {
  return crypto.createHash('md5').update(content.replace(/\r\n/g, '\n'), 'utf8').digest('hex');
}

function migrationKey(version: number, name: string): string {
  return `${version}_${name}`;
}

function resolveMigrationsDir(customDir?: string): string {
  const { migrationsDir } = getConfig();
  const dir = customDir ?? migrationsDir;
  return path.isAbsolute(dir) ? dir : path.resolve(process.cwd(), dir);
}

function parseMigrationFileName(fileName: string): { version: number; name: string } | null {
  if (!fileName.endsWith('.sql') || fileName.endsWith('.down.sql')) {
    return null;
  }

  const parts = fileName.slice(0, -4).split('_');
  const versionStr = parts.shift();
  if (!versionStr) {
    return null;
  }

  const version = Number(versionStr);
  if (Number.isNaN(version)) {
    return null;
  }

  const name = parts.join('_');
  if (!name) {
    return null;
  }

  if (fileName !== `${versionStr}_${name}.sql`) {
    return null;
  }

  return { version, name };
}

function logMigrationHeader(logger: LoggerType, migrationsDir: string, fileCount: number, installedCount: number): void {
  logger.info(`Migrations directory: ${migrationsDir}`);
  logger.info(`Found ${fileCount} migration file(s), ${installedCount} already applied in ${SCHEMA_MIGRATIONS_TABLE}`);
}

function logMigrationEntry(logger: LoggerType, entry: MigrationStatusEntry): void {
  const label = entry.status === 'skipped' ? 'SKIP' : entry.status === 'applied' ? 'OK  ' : 'FAIL';

  if (entry.status === 'skipped') {
    logger.info(
      `${label}  ${entry.fileName}  checksum=${entry.checksum}  verified (matches ${SCHEMA_MIGRATIONS_TABLE})`,
    );
    return;
  }

  if (entry.status === 'applied') {
    logger.info(
      `${label}  ${entry.fileName}  checksum=${entry.checksum}  applied in ${entry.executionTimeMs ?? 0}ms`,
    );
    return;
  }

  logger.error(
    `${label}  ${entry.fileName}  checksum=${entry.checksum}  stored=${entry.storedChecksum ?? 'unknown'}`,
  );
}

function logMigrationSummary(logger: LoggerType, report: MigrationRunReport): void {
  if (report.appliedCount === 0 && report.skippedCount > 0 && report.failedCount === 0) {
    logger.info('No new migrations to run');
  }

  logger.info(
    `Migration summary: ${report.appliedCount} applied, ${report.skippedCount} skipped, ${report.failedCount} failed`,
  );
}

export async function listMigrationFiles(customDir?: string): Promise<MigrationFile[]> {
  const directory = resolveMigrationsDir(customDir);
  const entries = await fs.readdir(directory);
  const migrations: MigrationFile[] = [];

  for (const fileName of entries.filter((file) => !file.startsWith('.')).sort()) {
    const parsed = parseMigrationFileName(fileName);
    if (!parsed) {
      continue;
    }

    migrations.push({
      fileName,
      version: parsed.version,
      name: parsed.name,
      filePath: path.join(directory, fileName),
      downFilePath: path.join(directory, `${parsed.version}_${parsed.name}.down.sql`),
    });
  }

  return migrations;
}

export async function ensureMigrationsTable(client: MigrationClient): Promise<void> {
  await client.query('CREATE SCHEMA IF NOT EXISTS sm;');
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${SCHEMA_MIGRATIONS_TABLE} (
      version bigint NOT NULL,
      name character varying(120) NOT NULL,
      installed_on timestamp with time zone NOT NULL DEFAULT now(),
      success boolean NOT NULL,
      checksum text NOT NULL,
      execution_time bigint NOT NULL,
      CONSTRAINT ${PREFIX}migrations_pk PRIMARY KEY (version, name)
    )
  `);
}

async function getInstalledMigrations(client: MigrationClient): Promise<MigrationRecord[]> {
  const result = await client.query<MigrationRecord>(
    `SELECT version, name, checksum, installed_on, success, execution_time
     FROM ${SCHEMA_MIGRATIONS_TABLE}
     ORDER BY version ASC, name ASC`,
  );
  return result.rows;
}

async function resolvePendingMigrations(
  client: MigrationClient,
  logger: LoggerType,
  customDir?: string,
): Promise<{ pending: MigrationFile[]; skipped: MigrationStatusEntry[]; migrationsDir: string }> {
  const migrationsDir = resolveMigrationsDir(customDir);
  const files = await listMigrationFiles(customDir);
  const installed = await getInstalledMigrations(client);
  const installedByKey = new Map(installed.map((row) => [migrationKey(row.version, row.name), row]));
  const skipped: MigrationStatusEntry[] = [];
  const pending: MigrationFile[] = [];

  logMigrationHeader(logger, migrationsDir, files.length, installed.length);

  for (const file of files) {
    const key = migrationKey(file.version, file.name);
    const installedRow = installedByKey.get(key);
    const content = await fs.readFile(file.filePath, 'utf-8');
    const checksum = generateChecksum(content);

    if (!installedRow) {
      pending.push(file);
      logger.info(`PEND  ${file.fileName}  checksum=${checksum}  pending apply`);
      continue;
    }

    if (checksum !== installedRow.checksum) {
      const message = `Checksum mismatch for migration ${file.fileName}: file=${checksum} stored=${installedRow.checksum}`;
      if (process.env.NODE_ENV === 'development' && isEnvTruthy(process.env.IGNORE_MIGRATION_CHECKSUM_MISMATCH)) {
        logger.warn(`${message} (ignored because IGNORE_MIGRATION_CHECKSUM_MISMATCH=true)`);
        skipped.push({
          fileName: file.fileName,
          version: file.version,
          name: file.name,
          status: 'skipped',
          checksum,
          storedChecksum: installedRow.checksum,
        });
        logMigrationEntry(logger, skipped[skipped.length - 1]!);
        continue;
      }

      throw new Error(message);
    }

    const entry: MigrationStatusEntry = {
      fileName: file.fileName,
      version: file.version,
      name: file.name,
      status: 'skipped',
      checksum,
      storedChecksum: installedRow.checksum,
      executionTimeMs: installedRow.execution_time,
    };
    skipped.push(entry);
    logMigrationEntry(logger, entry);
  }

  return { pending, skipped, migrationsDir };
}

export async function runMigrations(
  client: MigrationClient,
  logger: LoggerType,
  customDir?: string,
): Promise<MigrationRunReport> {
  await ensureMigrationsTable(client);
  const { pending, skipped, migrationsDir } = await resolvePendingMigrations(client, logger, customDir);
  const entries: MigrationStatusEntry[] = [...skipped];

  if (pending.length === 0) {
    const report: MigrationRunReport = {
      migrationsDir,
      entries,
      appliedCount: 0,
      skippedCount: skipped.length,
      failedCount: 0,
    };
    logMigrationSummary(logger, report);
    return report;
  }

  for (const migration of pending) {
    const content = await fs.readFile(migration.filePath, 'utf-8');
    const checksum = generateChecksum(content);
    const start = Date.now();
    logger.info(`RUN   ${migration.fileName}  checksum=${checksum}`);

    try {
      await client.query('BEGIN');
      await client.query(content);
      const duration = Date.now() - start;
      await client.query(
        `INSERT INTO ${SCHEMA_MIGRATIONS_TABLE}(version, name, success, checksum, execution_time)
         VALUES ($1, $2, $3, $4, $5)`,
        [migration.version, migration.name, true, checksum, duration],
      );
      await client.query('COMMIT');

      const entry: MigrationStatusEntry = {
        fileName: migration.fileName,
        version: migration.version,
        name: migration.name,
        status: 'applied',
        checksum,
        executionTimeMs: duration,
      };
      entries.push(entry);
      logMigrationEntry(logger, entry);
    } catch (error) {
      await client.query('ROLLBACK');
      const entry: MigrationStatusEntry = {
        fileName: migration.fileName,
        version: migration.version,
        name: migration.name,
        status: 'failed',
        checksum,
      };
      entries.push(entry);
      logMigrationEntry(logger, entry);
      logger.error(`Migration ${migration.fileName} failed: ${getErrorMessage(error)}`);
      const report: MigrationRunReport = {
        migrationsDir,
        entries,
        appliedCount: entries.filter((item) => item.status === 'applied').length,
        skippedCount: skipped.length,
        failedCount: 1,
      };
      logMigrationSummary(logger, report);
      throw error;
    }
  }

  const report: MigrationRunReport = {
    migrationsDir,
    entries,
    appliedCount: pending.length,
    skippedCount: skipped.length,
    failedCount: 0,
  };
  logMigrationSummary(logger, report);
  return report;
}

export async function rollbackLastMigration(
  client: MigrationClient,
  logger: LoggerType,
  customDir?: string,
): Promise<boolean> {
  await ensureMigrationsTable(client);

  const result = await client.query<MigrationRecord>(
    `SELECT version, name, checksum, installed_on, success, execution_time
     FROM ${SCHEMA_MIGRATIONS_TABLE}
     ORDER BY version DESC, name DESC
     LIMIT 1`,
  );

  const last = result.rows[0];
  if (!last) {
    logger.info('No migrations to rollback');
    return false;
  }

  const migrations = await listMigrationFiles(customDir);
  const migration = migrations.find((file) => file.version === last.version && file.name === last.name);
  if (!migration) {
    throw new Error(`Rollback target not found for ${last.version}_${last.name}`);
  }

  let downSql: string;
  try {
    downSql = await fs.readFile(migration.downFilePath, 'utf-8');
  } catch {
    throw new Error(`Missing rollback file: ${path.basename(migration.downFilePath)}`);
  }

  const downChecksum = generateChecksum(downSql);
  logger.info(
    `ROLL  ${migration.fileName}  stored_checksum=${last.checksum}  down_checksum=${downChecksum}`,
  );
  const start = Date.now();

  try {
    await client.query('BEGIN');
    await client.query(downSql);
    await client.query(
      `DELETE FROM ${SCHEMA_MIGRATIONS_TABLE} WHERE version = $1 AND name = $2`,
      [last.version, last.name],
    );
    await client.query('COMMIT');
    logger.info(`OK    ${migration.fileName}  rolled back in ${Date.now() - start}ms`);
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error(`Rollback failed: ${getErrorMessage(error)}`);
    throw error;
  }
}
