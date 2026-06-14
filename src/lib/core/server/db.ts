import * as pg from '../../database/postgres.js';
import type { PoolClient, QueryResultRow, QueryConfigValues, QueryResult } from 'pg';

export * from '../../database/postgres.js';

export interface PgPoolClient extends PoolClient {
  queryCached<R extends QueryResultRow = any, I = any[]>(
    sql: string,
    params?: QueryConfigValues<I>,
    options?: any
  ): Promise<QueryResult<R>>;
}

export const newClient = async (): Promise<PgPoolClient> => {
  const client = await pg.newClient();
  const queryCached = client.query.bind(client);
  return Object.assign(client, { queryCached }) as PgPoolClient;
};
