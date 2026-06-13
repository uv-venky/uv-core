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

function generateChecksum(content: string): string {
  return crypto.createHash('md5').update(content.replace(/\r\n/g, '\n'), 'utf8').digest('hex');
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

async function validateInstalledChecksums(
  client: MigrationClient,
  logger: LoggerType,
  customDir?: string,
): Promise<MigrationFile[]> {
  const pending = await listMigrationFiles(customDir);
  const installed = await getInstalledMigrations(client);
  const pendingByKey = new Map(pending.map((file) => [`${file.version}_${file.name}`, file]));

  for (const row of installed) {
    const key = `${row.version}_${row.name}`;
    const file = pendingByKey.get(key);
    if (!file) {
      continue;
    }

    const content = await fs.readFile(file.filePath, 'utf-8');
    const checksum = generateChecksum(content);
    if (checksum !== row.checksum) {
      const message = `Checksum mismatch for migration ${file.fileName}: ${checksum} != ${row.checksum}`;
        if (process.env.NODE_ENV === 'development' && isEnvTruthy(process.env.IGNORE_MIGRATION_CHECKSUM_MISMATCH)) {
        logger.warn(`${message} (ignored because IGNORE_MIGRATION_CHECKSUM_MISMATCH=true)`);
      } else {
        throw new Error(message);
      }
    }

    pendingByKey.delete(key);
  }

  return [...pendingByKey.values()].sort((a, b) => {
    if (a.version !== b.version) {
      return a.version - b.version;
    }
    return a.name.localeCompare(b.name);
  });
}

export async function runMigrations(
  client: MigrationClient,
  logger: LoggerType,
  customDir?: string,
): Promise<number> {
  await ensureMigrationsTable(client);
  const pending = await validateInstalledChecksums(client, logger, customDir);

  if (pending.length === 0) {
    logger.info('No new migrations to run');
    return 0;
  }

  for (const migration of pending) {
    const content = await fs.readFile(migration.filePath, 'utf-8');
    const start = Date.now();
    logger.info(`Running migration: ${migration.fileName}`);

    try {
      await client.query('BEGIN');
      await client.query(content);
      const duration = Date.now() - start;
      const checksum = generateChecksum(content);
      await client.query(
        `INSERT INTO ${SCHEMA_MIGRATIONS_TABLE}(version, name, success, checksum, execution_time)
         VALUES ($1, $2, $3, $4, $5)`,
        [migration.version, migration.name, true, checksum, duration],
      );
      await client.query('COMMIT');
      logger.info(`Migration ${migration.fileName} completed in ${duration}ms`);
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error(`Migration ${migration.fileName} failed: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  return pending.length;
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

  logger.info(`Rolling back migration: ${migration.fileName}`);
  const start = Date.now();

  try {
    await client.query('BEGIN');
    await client.query(downSql);
    await client.query(
      `DELETE FROM ${SCHEMA_MIGRATIONS_TABLE} WHERE version = $1 AND name = $2`,
      [last.version, last.name],
    );
    await client.query('COMMIT');
    logger.info(`Rollback completed in ${Date.now() - start}ms`);
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error(`Rollback failed: ${getErrorMessage(error)}`);
    throw error;
  }
}
