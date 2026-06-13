#!/usr/bin/env node
import dotenv from 'dotenv';
import path from 'node:path';
import { loadConfig } from '../common/config.js';
import logger from '../common/logger.js';
import { createStandaloneClient, closePool } from '../database/postgres.js';
import { runMigrations } from '../migrations/migration-runner.js';

async function main(): Promise<void> {
  dotenv.config();
  dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

  if (process.env.SKIP_MIGRATIONS === 'true') {
    logger.warn('Skipping migrations (SKIP_MIGRATIONS=true)');
    return;
  }

  loadConfig();
  const client = await createStandaloneClient();

  try {
    const report = await runMigrations(client, logger);
    if (report.appliedCount > 0) {
      logger.info(`Successfully applied ${report.appliedCount} migration(s) from ${report.migrationsDir}`);
    }
  } finally {
    await client.end();
    await closePool();
  }
}

main().catch((error) => {
  logger.error('Migration failed', error);
  process.exit(1);
});
