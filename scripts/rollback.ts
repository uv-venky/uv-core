#!/usr/bin/env node
import dotenv from 'dotenv';
import path from 'node:path';
import { loadConfig } from '../src/common/config.js';
import logger from '../src/common/logger.js';
import { createStandaloneClient, closePool } from '../src/database/postgres.js';
import { rollbackLastMigration } from '../src/migrations/migration-runner.js';

async function main(): Promise<void> {
  dotenv.config();
  dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

  loadConfig();
  const client = await createStandaloneClient();

  try {
    const rolledBack = await rollbackLastMigration(client, logger);
    if (rolledBack) {
      logger.info('Rollback completed successfully');
    }
  } finally {
    await client.end();
    await closePool();
  }
}

main().catch((error) => {
  logger.error('Rollback failed', error);
  process.exit(1);
});
