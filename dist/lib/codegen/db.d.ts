import type { PgPoolClient } from '../database/postgres.js';
import type { ColumnMeta, TableMeta } from './types.js';
export declare function normalizePgTypeBase(pgType: string): {
    base: string;
    isArray: boolean;
};
export declare function getTableNames(client: PgPoolClient, filter: string): Promise<TableMeta[]>;
export declare function getColumnMeta(client: PgPoolClient, tableName: string, schemaName?: string): Promise<ColumnMeta[]>;
export declare function canBePrimaryKey(pgType: string, maxLength: number | null): boolean;
//# sourceMappingURL=db.d.ts.map