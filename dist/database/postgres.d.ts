import pg, { type Pool, type PoolClient, type QueryResult, type QueryResultRow } from 'pg';
declare global {
    var __baseFrameworkPool: Pool | undefined;
}
export type PgPoolClient = PoolClient;
export interface PoolStatus {
    idleCount: number;
    totalCount: number;
    waitingCount: number;
}
export declare function getPool(): Pool;
export declare function getPoolStatus(): Promise<PoolStatus>;
export declare function newClient(): Promise<PgPoolClient>;
export declare function executeQuery<T extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]): Promise<QueryResult<T>>;
export declare function execute<T extends QueryResultRow = QueryResultRow>(client: PgPoolClient, text: string, params?: unknown[]): Promise<QueryResult<T>>;
export declare function transaction<T>(callback: (client: PgPoolClient) => Promise<T>): Promise<T>;
export declare function closePool(): Promise<void>;
export declare function createStandaloneClient(): Promise<pg.Client>;
//# sourceMappingURL=postgres.d.ts.map