#!/usr/bin/env node
import dotenv from 'dotenv';
import path from 'node:path';
import { loadConfig } from '../src/common/config.js';
import logger from '../src/common/logger.js';
import { createMigrationFile } from '../src/migrations/migration-generator.js';

async function main(): Promise<void> {
  dotenv.config();
  dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

  const name = process.argv[2];
  if (!name) {
    console.error('Usage: npm run migration:create -- <migration_name>');
    process.exit(1);
  }

  loadConfig();
  const filePath = await createMigrationFile({ name });
  logger.info(`Created migration: ${filePath}`);
}

main().catch((error) => {
  logger.error('Failed to create migration', error);
  process.exit(1);
});
