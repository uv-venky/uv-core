import type { PgPoolClient } from '../database/postgres.js';
import type { AuthenticatedRequest } from '../auth/auth.middleware.js';
import { ForbiddenError, UserError } from '../common/exceptions.js';
import type { DataSource, TableDataSource, Row, DBRow, NewRow } from './types.js';
import { hasAccess } from './hasAccess.js';
import logger from '../common/logger.js';

export async function postDataSource<T extends object>(
  client: PgPoolClient,
  auth: AuthenticatedRequest,
  ds: DataSource<T>,
  rows: Row<T>[],
): Promise<{ rows: DBRow<T>[]; elapsed: number }> {
  if (ds.type !== 'Table') {
    throw new UserError('Cannot perform DML operations on non-table data source');
  }
  if (!rows || rows.length === 0) {
    throw new UserError(`No rows to post for DataSource ${ds.id}`);
  }

  const start = Date.now();
  const deletedRows: DBRow<T>[] = [];
  const insertedRows: NewRow<T>[] = [];
  const updatedRows: DBRow<T>[] = [];

  // 1. Group rows by status and check permissions
  for (const row of rows) {
    if (row._status === 'D') {
      const isAllowed = await hasAccess(ds, auth, 'Delete');
      if (!isAllowed) {
        throw new ForbiddenError(`Access denied: Delete denied for DataSource ${ds.id}`);
      }
      deletedRows.push(row as DBRow<T>);
    } else if (row._status === 'I') {
      const isAllowed = await hasAccess(ds, auth, 'Insert');
      if (!isAllowed) {
        throw new ForbiddenError(`Access denied: Insert denied for DataSource ${ds.id}`);
      }
      insertedRows.push(row as NewRow<T>);
    } else if (row._status === 'U') {
      const isAllowed = await hasAccess(ds, auth, 'Update');
      if (!isAllowed) {
        throw new ForbiddenError(`Access denied: Update denied for DataSource ${ds.id}`);
      }
      updatedRows.push(row as DBRow<T>);
    } else {
      throw new UserError(`Invalid record status '${row._status}' passed to post!`);
    }
  }

  const collect: DBRow<T>[] = [];

  // 2. Process Inserts
  if (insertedRows.length > 0) {
    const inserted = await insertMany(client, auth, ds, insertedRows);
    collect.push(...inserted);
  }

  // 3. Process Updates
  if (updatedRows.length > 0) {
    const updated = await updateMany(client, auth, ds, updatedRows);
    collect.push(...updated);
  }

  // 4. Process Deletes
  if (deletedRows.length > 0) {
    const deleted = await deleteMany(client, auth, ds, deletedRows);
    collect.push(...deleted);
  }

  const elapsed = Date.now() - start;
  return { rows: collect, elapsed };
}

async function insertMany<T extends object>(
  client: PgPoolClient,
  auth: AuthenticatedRequest,
  ds: TableDataSource<T>,
  insertedRows: NewRow<T>[],
): Promise<DBRow<T>[]> {
  if (ds.readOnly) {
    throw new UserError('DataSource is read only!');
  }

  let rows = [...insertedRows] as unknown as DBRow<T>[];

  // 1. Populate default values and WHO attributes
  const app_id = process.env.APP_ID ?? 'stitchmate';
  const userName = auth.user.userName;

  for (const row of rows) {
    // Defaults
    for (const attr of ds.attributes) {
      if (row[attr.code] === undefined && attr.defaultValue !== undefined) {
        row[attr.code] = attr.defaultValue === 'APP_ID' ? (app_id as any) : attr.defaultValue;
      }
      // WHO columns
      if (attr.code === 'createdAt' || attr.code === 'creationDate') {
        row[attr.code] = new Date() as any;
      } else if (attr.code === 'createdBy') {
        row[attr.code] = userName as any;
      } else if (attr.code === 'updatedAt' || attr.code === 'lastUpdateDate') {
        row[attr.code] = new Date() as any;
      } else if (attr.code === 'updatedBy' || attr.code === 'lastUpdatedBy') {
        row[attr.code] = userName as any;
      }
    }
  }

  // 2. beforeInsert hook
  if (ds.beforeInsert) {
    const sessionMock = { user: auth.user } as any;
    const { rows: hookedRows, skipDML } = await ds.beforeInsert({
      rows,
      session: sessionMock,
      client,
    });
    rows = hookedRows;
    if (skipDML) {
      return rows.map((r) => ({ ...r, _status: 'Q' as const }));
    }
  }

  // 3. Database Execution
  const returnRows: DBRow<T>[] = [];
  const schemaPrefix = ds.schema ? `${ds.schema}.` : '';

  for (const row of rows) {
    const insertColumns: string[] = [];
    const valuesPlaceholders: string[] = [];
    const params: any[] = [];

    for (const attr of ds.attributes) {
      const column = attr.column;
      if (column == null || attr.calculated || attr.auto || attr.insert === false) {
        continue;
      }

      insertColumns.push(column);
      params.push(row[attr.code]);
      valuesPlaceholders.push(`$${params.length}`);
    }

    const returningAttrs = ds.attributes.filter((a) => a.auto && a.column);
    const returningClause = returningAttrs.length > 0
      ? ` RETURNING ${returningAttrs.map((a) => a.column).join(', ')}`
      : '';

    const sql = `INSERT INTO ${schemaPrefix}${ds.tableName} (${insertColumns.join(', ')}) VALUES (${valuesPlaceholders.join(', ')})${returningClause}`;

    try {
      const res = await client.query(sql, params);
      const returnRow = { ...row, _status: 'Q' as const };

      if (returningAttrs.length > 0 && res.rows[0]) {
        for (const attr of returningAttrs) {
          if (attr.column) {
            returnRow[attr.code] = res.rows[0][attr.column];
          }
        }
      }
      returnRows.push(returnRow);
    } catch (error: any) {
      logger.error(`INSERT failed on ${ds.tableName}: ${error.message}`, { sql, params });
      throw new UserError(`Insert failed on ${ds.id}: ${error.message}`);
    }
  }

  // 4. afterInsert hook
  if (ds.afterInsert) {
    const sessionMock = { user: auth.user } as any;
    return (await ds.afterInsert({ rows: returnRows, session: sessionMock, client })) as DBRow<T>[];
  }

  return returnRows;
}

async function updateMany<T extends object>(
  client: PgPoolClient,
  auth: AuthenticatedRequest,
  ds: TableDataSource<T>,
  updatedRows: DBRow<T>[],
): Promise<DBRow<T>[]> {
  if (ds.readOnly) {
    throw new UserError('DataSource is read only!');
  }

  let rows = [...updatedRows];
  const userName = auth.user.userName;

  // 1. Optimistic Locking Check
  if (!ds.skipQueryForUpdate) {
    const pkAttrs = ds.attributes.filter((a) => a.primary && a.column);
    const updatedAtAttr = ds.attributes.find((a) => a.code === 'updatedAt' || a.code === 'lastUpdateDate');

    if (pkAttrs.length > 0 && updatedAtAttr && updatedAtAttr.column) {
      const schemaPrefix = ds.schema ? `${ds.schema}.` : '';

      for (const row of rows) {
        const pkClauses: string[] = [];
        const pkParams: any[] = [];
        for (const pk of pkAttrs) {
          pkParams.push(row[pk.code]);
          pkClauses.push(`${pk.column} = $${pkParams.length}`);
        }

        const checkSql = `SELECT ${updatedAtAttr.column} FROM ${schemaPrefix}${ds.tableName} WHERE ${pkClauses.join(' AND ')}`;
        const checkRes = await client.query(checkSql, pkParams);

        if (checkRes.rows.length === 0) {
          throw new UserError(`Record not found for update in DataSource ${ds.id}`);
        }

        const dbUpdatedAt = checkRes.rows[0][updatedAtAttr.column]?.toISOString?.() ?? String(checkRes.rows[0][updatedAtAttr.column]);
        const clientUpdatedAt = row[updatedAtAttr.code] instanceof Date
          ? (row[updatedAtAttr.code] as Date).toISOString()
          : String(row[updatedAtAttr.code]);

        if (dbUpdatedAt !== clientUpdatedAt) {
          throw new UserError(
            `Record has been updated since it was read! (DataSource: ${ds.id}). Please refresh and try again.`,
          );
        }
      }
    }
  }

  // 2. beforeUpdate hook
  if (ds.beforeUpdate) {
    const sessionMock = { user: auth.user } as any;
    const { rows: hookedRows, skipDML } = await ds.beforeUpdate({
      rows,
      session: sessionMock,
      client,
    });
    rows = hookedRows;
    if (skipDML) {
      return rows;
    }
  }

  // 3. Populate WHO columns
  for (const row of rows) {
    for (const attr of ds.attributes) {
      if (attr.code === 'updatedAt' || attr.code === 'lastUpdateDate') {
        row[attr.code] = new Date() as any;
      } else if (attr.code === 'updatedBy' || attr.code === 'lastUpdatedBy') {
        row[attr.code] = userName as any;
      }
    }
  }

  // 4. Database Execution
  const returnRows: DBRow<T>[] = [];
  const schemaPrefix = ds.schema ? `${ds.schema}.` : '';
  const pkAttrs = ds.attributes.filter((a) => a.primary && a.column);

  if (pkAttrs.length === 0) {
    throw new UserError(`No primary attributes defined for DataSource ${ds.id}`);
  }

  for (const row of rows) {
    const setClauses: string[] = [];
    const params: any[] = [];

    // Fields to SET
    for (const attr of ds.attributes) {
      const column = attr.column;
      if (column == null || attr.calculated || attr.primary || attr.update === false) {
        continue;
      }

      params.push(row[attr.code]);
      setClauses.push(`${column} = $${params.length}`);
    }

    // WHERE primary keys clause
    const whereClauses: string[] = [];
    for (const pk of pkAttrs) {
      params.push(row[pk.code]);
      whereClauses.push(`${pk.column} = $${params.length}`);
    }

    const sql = `UPDATE ${schemaPrefix}${ds.tableName} SET ${setClauses.join(', ')} WHERE ${whereClauses.join(' AND ')}`;

    try {
      await client.query(sql, params);
      returnRows.push({ ...row, _status: 'Q' as const });
    } catch (error: any) {
      logger.error(`UPDATE failed on ${ds.tableName}: ${error.message}`, { sql, params });
      throw new UserError(`Update failed on ${ds.id}: ${error.message}`);
    }
  }

  // 5. afterUpdate hook
  if (ds.afterUpdate) {
    const sessionMock = { user: auth.user } as any;
    return (await ds.afterUpdate({ rows: returnRows, session: sessionMock, client })) as DBRow<T>[];
  }

  return returnRows;
}

async function deleteMany<T extends object>(
  client: PgPoolClient,
  auth: AuthenticatedRequest,
  ds: TableDataSource<T>,
  deletedRows: DBRow<T>[],
): Promise<DBRow<T>[]> {
  if (ds.readOnly) {
    throw new UserError('DataSource is read only!');
  }

  let rows = [...deletedRows];

  // 1. beforeDelete hook
  if (ds.beforeDelete) {
    const sessionMock = { user: auth.user } as any;
    rows = (await ds.beforeDelete({ rows, session: sessionMock, client })) as DBRow<T>[];
  }

  // 2. Database Execution
  const returnRows: DBRow<T>[] = [];
  const schemaPrefix = ds.schema ? `${ds.schema}.` : '';
  const pkAttrs = ds.attributes.filter((a) => a.primary && a.column);

  if (pkAttrs.length === 0) {
    throw new UserError(`No primary attributes defined for DataSource ${ds.id}`);
  }

  for (const row of rows) {
    const params: any[] = [];
    const whereClauses: string[] = [];

    for (const pk of pkAttrs) {
      params.push(row[pk.code]);
      whereClauses.push(`${pk.column} = $${params.length}`);
    }

    const sql = `DELETE FROM ${schemaPrefix}${ds.tableName} WHERE ${whereClauses.join(' AND ')}`;

    try {
      await client.query(sql, params);
      returnRows.push({ ...row, _status: 'D' as const });
    } catch (error: any) {
      logger.error(`DELETE failed on ${ds.tableName}: ${error.message}`, { sql, params });
      throw new UserError(`Delete failed on ${ds.id}: ${error.message}`);
    }
  }

  // 3. afterDelete hook
  if (ds.afterDelete) {
    const sessionMock = { user: auth.user } as any;
    return (await ds.afterDelete({ rows: returnRows, session: sessionMock, client })) as DBRow<T>[];
  }

  return returnRows;
}
