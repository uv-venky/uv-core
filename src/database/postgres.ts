import pg, { type Pool, type PoolClient, type QueryResult, type QueryResultRow } from 'pg';
import fs from 'node:fs';
import type { ConnectionOptions } from 'node:tls';
import { getConfig } from '../common/config.js';
import logger from '../common/logger.js';
import { getErrorMessage } from '../common/exceptions.js';

const { Pool: PgPool } = pg;
const types = pg.types;

types.setTypeParser(types.builtins.NUMERIC, Number.parseFloat);
types.setTypeParser(types.builtins.INT8, Number.parseInt);
types.setTypeParser(types.builtins.INT4, Number.parseInt);
types.setTypeParser(types.builtins.INT2, Number.parseInt);
types.setTypeParser(types.builtins.FLOAT8, Number.parseFloat);
types.setTypeParser(types.builtins.FLOAT4, Number.parseFloat);

declare global {
  // eslint-disable-next-line no-var
  var __baseFrameworkPool: Pool | undefined;
}

export type PgPoolClient = PoolClient;

export interface PoolStatus {
  idleCount: number;
  totalCount: number;
  waitingCount: number;
}

function buildPoolSsl(): ConnectionOptions | undefined {
  const { PG_SSL_CA, PG_SSL_CERT, PG_SSL_KEY } = process.env;
  const allowInsecureDbTls =
    process.env.NODE_ENV !== 'production' && process.env.PG_SSL_ALLOW_SELF_SIGNED === 'true';

  if (!PG_SSL_CA && !PG_SSL_CERT && !PG_SSL_KEY && !allowInsecureDbTls) {
    return undefined;
  }

  const ssl: ConnectionOptions = { rejectUnauthorized: !allowInsecureDbTls };
  if (PG_SSL_CA) {
    ssl.ca = fs.readFileSync(PG_SSL_CA).toString();
  }
  if (PG_SSL_CERT) {
    ssl.cert = fs.readFileSync(PG_SSL_CERT).toString();
  }
  if (PG_SSL_KEY) {
    ssl.key = fs.readFileSync(PG_SSL_KEY).toString();
  }
  return ssl;
}

export function getPool(): Pool {
  if (globalThis.__baseFrameworkPool) {
    return globalThis.__baseFrameworkPool;
  }

  const { dbUrl } = getConfig();
  const url = new URL(dbUrl);
  url.password = '*****';
  logger.info(`Creating PostgreSQL pool: ${url.toString()}`);

  const ssl = buildPoolSsl();
  globalThis.__baseFrameworkPool = new PgPool({
    connectionString: dbUrl,
    ssl,
    max: Number(process.env.PG_POOL_MAX ?? 20),
    idleTimeoutMillis: Number(process.env.PG_IDLE_TIMEOUT_MS ?? 120_000),
    connectionTimeoutMillis: Number(process.env.PG_CONNECTION_TIMEOUT_MS ?? 60_000),
    application_name: `uv-core-${process.pid}`,
  });

  return globalThis.__baseFrameworkPool;
}

export async function getPoolStatus(): Promise<PoolStatus> {
  const pool = getPool();
  return {
    idleCount: pool.idleCount,
    totalCount: pool.totalCount,
    waitingCount: pool.waitingCount,
  };
}

export async function newClient(): Promise<PgPoolClient> {
  return getPool().connect();
}

export async function executeQuery<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<QueryResult<T>> {
  const client = await newClient();
  try {
    return await execute<T>(client, text, params);
  } finally {
    client.release();
  }
}

export async function execute<T extends QueryResultRow = QueryResultRow>(
  client: PgPoolClient,
  text: string,
  params?: unknown[],
): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const result = await client.query<T>(text, params);
    logger.logQuery(text, Date.now() - start, params);
    return result;
  } catch (error) {
    logger.error('database query failed', {
      text,
      params,
      durationMs: Date.now() - start,
      error: getErrorMessage(error),
    });
    throw error;
  }
}

export async function transaction<T>(callback: (client: PgPoolClient) => Promise<T>): Promise<T> {
  const client = await newClient();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function closePool(): Promise<void> {
  if (globalThis.__baseFrameworkPool) {
    await globalThis.__baseFrameworkPool.end();
    globalThis.__baseFrameworkPool = undefined;
  }
}

export async function createStandaloneClient(): Promise<pg.Client> {
  const { dbUrl } = getConfig();
  const client = new pg.Client({
    connectionString: dbUrl,
    ssl: buildPoolSsl(),
  });
  await client.connect();
  return client;
}
