import type { PgPoolClient } from '../database/postgres.js';
import type { AuthenticatedRequest } from '../auth/auth.middleware.js';
import { ForbiddenError, UserError } from '../common/exceptions.js';
import type { DataSource, Query, QueryResult, DBRow } from './types.js';
import { hasAccess } from './hasAccess.js';
import { QueryBuilder } from './queryBuilder.js';
import logger from '../common/logger.js';

export async function queryDataSource<T extends object>(
  client: PgPoolClient,
  auth: AuthenticatedRequest,
  ds: DataSource<T>,
  query: Query<T>,
): Promise<QueryResult<T>> {
  const isAllowed = await hasAccess(ds, auth, 'Query');
  if (!isAllowed) {
    throw new ForbiddenError(`Access denied: Query access denied for DataSource ${ds.id}`);
  }

  const start = Date.now();
  let localQuery = { ...query };

  // 1. preQuery hook
  if (ds.preQuery) {
    // Map uv-core auth.user to match core's session type expectations
    const sessionMock = { user: auth.user } as any;
    localQuery = await ds.preQuery({ query: localQuery, session: sessionMock, client });
  }

  // 2. Build SQL statement
  const qb = new QueryBuilder<T>(ds, auth);
  qb.applyQuery(localQuery);

  let sql = localQuery.countOnly ? qb.getCountQuery() : qb.getQuery();
  let params = localQuery.countOnly ? qb.getCountParams() : qb.getParams();

  // 3. preQuery2 hook
  if (ds.preQuery2) {
    const sessionMock = { user: auth.user } as any;
    const modified = ds.preQuery2({ query: localQuery, sql, params, session: sessionMock, client });
    sql = modified.sql;
    params = modified.params;
  }

  // 4. Database Query execution
  let queryRes: any;
  try {
    queryRes = await client.query(sql, params);
  } catch (error: any) {
    logger.error(`DataSource query failed: ${error.message}`, { sql, params });
    throw new UserError(`${ds.id} query failed: ${error.message}`);
  }

  let rows: DBRow<T>[] = queryRes.rows.map((r: any) => ({
    ...r,
    _status: 'Q' as const,
  }));

  // 5. Transform Attribute types (e.g. Date exclusion format, JSON parsing)
  if (!localQuery.countOnly && rows.length > 0) {
    for (const attr of ds.attributes) {
      if (attr.type === 'Date' && attr.excludeTime) {
        for (const row of rows) {
          const val = row[attr.code];
          if (val instanceof Date) {
            row[attr.code] = val.toISOString().split('T')[0] as any;
          } else if (val && typeof val === 'string') {
            row[attr.code] = val.split('T')[0] as any;
          }
        }
      }
    }
  }

  // 6. postQuery hook
  if (ds.postQuery && !localQuery.countOnly) {
    const sessionMock = { user: auth.user } as any;
    rows = (await ds.postQuery({ query: localQuery, rows, session: sessionMock, client })) as DBRow<T>[];
  }

  const elapsed = Date.now() - start;
  const count = localQuery.countOnly ? (rows[0] as any)?.count ?? 0 : undefined;

  return {
    rows,
    fields: queryRes.fields,
    elapsed,
    sql,
    params,
    count,
  };
}
