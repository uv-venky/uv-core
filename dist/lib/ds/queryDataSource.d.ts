import type { PgPoolClient } from '../database/postgres.js';
import type { AuthenticatedRequest } from '../auth/auth.middleware.js';
import type { DataSource, Query, QueryResult } from './types.js';
export declare function queryDataSource<T extends object>(client: PgPoolClient, auth: AuthenticatedRequest, ds: DataSource<T>, query: Query<T>): Promise<QueryResult<T>>;
//# sourceMappingURL=queryDataSource.d.ts.map