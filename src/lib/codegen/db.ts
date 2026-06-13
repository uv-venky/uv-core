import type { PgPoolClient } from '../database/postgres.js';
import type { ColumnMeta, TableMeta } from './types.js';

export function normalizePgTypeBase(pgType: string): { base: string; isArray: boolean } {
  let t = pgType.trim();
  const dot = t.lastIndexOf('.');
  if (dot !== -1) {
    t = t.slice(dot + 1).trim();
  }
  const isArray = t.endsWith('[]');
  if (isArray) {
    t = t.slice(0, -2).trim();
  }
  t = t.replace(/\(\d+(?:,\s*\d+)?\)\s*$/, '').trim();
  if (t === 'varchar') {
    t = 'character varying';
  }
  return { base: t, isArray };
}

function allowsDecimals(pgType: string): boolean {
  const { base } = normalizePgTypeBase(pgType);
  return ['numeric', 'double precision', 'real'].includes(base);
}

function includesTime(pgType: string): boolean {
  const { base } = normalizePgTypeBase(pgType);
  return ['timestamp with time zone', 'timestamp without time zone'].includes(base);
}

export async function getTableNames(client: PgPoolClient, filter: string): Promise<TableMeta[]> {
  const query = `
    SELECT table_schema, table_name, table_type 
    FROM information_schema.tables
    WHERE table_schema NOT IN ('pg_catalog', 'information_schema') AND table_name LIKE $1
    UNION ALL
    SELECT schemaname, matviewname, 'MV' AS table_type 
    FROM pg_matviews
    WHERE matviewname LIKE $1
    ORDER BY 2
    LIMIT 50
  `;
  const params = [`${filter}%`];
  const res = await client.query<TableMeta>(query, params);
  return res.rows;
}

export async function getColumnMeta(
  client: PgPoolClient,
  tableName: string,
  schemaName: string = 'public',
): Promise<ColumnMeta[]> {
  let query = `
    SELECT 
      c.column_name,
      pg_catalog.format_type(a.atttypid, a.atttypmod) AS data_type,
      c.character_maximum_length,
      c.is_nullable,
      c.numeric_precision,
      c.numeric_scale
    FROM information_schema.columns c
    INNER JOIN pg_catalog.pg_namespace pn ON pn.nspname = c.table_schema
    INNER JOIN pg_catalog.pg_class pc ON pc.relnamespace = pn.oid AND pc.relname = c.table_name
      AND pc.relkind IN ('r', 'p', 'v', 'm', 'f')
    INNER JOIN pg_catalog.pg_attribute a ON a.attrelid = pc.oid AND a.attname = c.column_name
      AND a.attnum > 0 AND NOT a.attisdropped
    WHERE c.table_name = $1
  `;
  let query2 = `
    UNION ALL
    SELECT 
      a.attname AS column_name,
      pg_catalog.format_type(a.atttypid, a.atttypmod) AS data_type,
      100 AS character_maximum_length,
      'YES' AS is_nullable,
      0 AS numeric_precision,
      0 AS numeric_scale
    FROM pg_attribute a
    JOIN pg_class c ON a.attrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    JOIN pg_matviews m ON m.schemaname = n.nspname AND c.relname = m.matviewname
    WHERE c.relname = $1
      AND a.attnum > 0
      AND NOT a.attisdropped
  `;
  const params = [tableName];
  if (schemaName && schemaName !== 'default') {
    query += ' AND c.table_schema = $2';
    query2 += ' AND n.nspname = $2';
    params.push(schemaName);
  } else {
    query += ' AND c.table_schema = current_schema()';
    query2 += ' AND n.nspname = current_schema()';
  }

  const res = await client.query(query + query2, params);
  return res.rows
    .map((row: any) => {
      const { base } = normalizePgTypeBase(row.data_type);
      return {
        name: row.column_name,
        type: row.data_type,
        maxLength: row.character_maximum_length,
        nullable: row.is_nullable === 'YES',
        allowDecimals: allowsDecimals(row.data_type) && (row.numeric_scale > 0 || base !== 'numeric'),
        excludeTime: !includesTime(row.data_type),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function canBePrimaryKey(pgType: string, maxLength: number | null): boolean {
  const { base } = normalizePgTypeBase(pgType);
  switch (base) {
    case 'integer':
    case 'smallint':
    case 'numeric':
    case 'bigint':
    case 'uuid':
      return true;
    case 'character varying':
    case 'character':
      return maxLength == null || (maxLength > 3 && maxLength <= 256);
    default:
      return false;
  }
}
