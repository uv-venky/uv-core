import fs from 'node:fs/promises';
import path from 'node:path';
import { getConfig } from '../common/config.js';

export interface CreateMigrationOptions {
  name: string;
  migrationsDir?: string;
  version?: number;
}

function sanitizeMigrationName(rawName: string): string {
  return rawName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

function defaultVersion(): number {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const suffix = String(now.getUTCHours() * 3600 + now.getUTCMinutes() * 60 + now.getUTCSeconds()).padStart(
    5,
    '0',
  );
  return Number(`${date}${suffix}`);
}

export async function createMigrationFile(options: CreateMigrationOptions): Promise<string> {
  const name = sanitizeMigrationName(options.name);
  if (!name) {
    throw new Error('Migration name is required');
  }

  const version = options.version ?? defaultVersion();
  const migrationsDir = path.resolve(
    process.cwd(),
    options.migrationsDir ?? getConfig().migrationsDir,
  );
  await fs.mkdir(migrationsDir, { recursive: true });

  const upFileName = `${version}_${name}.sql`;
  const downFileName = `${version}_${name}.down.sql`;
  const upFilePath = path.join(migrationsDir, upFileName);
  const downFilePath = path.join(migrationsDir, downFileName);

  const upTemplate = `-- Migration: ${upFileName}

-- Write your forward SQL below.
`;

  const downTemplate = `-- Rollback: ${downFileName}

-- Write SQL to undo ${upFileName}.
`;

  await fs.writeFile(upFilePath, upTemplate, { flag: 'wx' });
  await fs.writeFile(downFilePath, downTemplate, { flag: 'wx' });

  return upFilePath;
}
