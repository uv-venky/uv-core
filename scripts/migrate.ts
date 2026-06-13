#!/usr/bin/env node
import dotenv from 'dotenv';
import path from 'node:path';
import { loadConfig } from '../src/common/config.js';
import logger from '../src/common/logger.js';
import { createStandaloneClient, closePool } from '../src/database/postgres.js';
import { runMigrations } from '../src/migrations/migration-runner.js';

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
    const count = await runMigrations(client, logger);
    logger.info(`Applied ${count} migration(s)`);
  } finally {
    await client.end();
    await closePool();
  }
}

main().catch((error) => {
  logger.error('Migration failed', error);
  process.exit(1);
});
