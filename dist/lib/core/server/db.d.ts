import type { PoolClient, QueryResultRow, QueryConfigValues, QueryResult } from 'pg';
export * from '../../database/postgres.js';
export interface PgPoolClient extends PoolClient {
    queryCached<R extends QueryResultRow = any, I = any[]>(sql: string, params?: QueryConfigValues<I>, options?: any): Promise<QueryResult<R>>;
}
export declare const newClient: () => Promise<PgPoolClient>;
//# sourceMappingURL=db.d.ts.map