import type { PgPoolClient } from '../database/postgres.js';
import type { AuthenticatedRequest } from '../auth/auth.middleware.js';
import type { DataSource, Row, DBRow } from './types.js';
export declare function postDataSource<T extends object>(client: PgPoolClient, auth: AuthenticatedRequest, ds: DataSource<T>, rows: Row<T>[]): Promise<{
    rows: DBRow<T>[];
    elapsed: number;
}>;
//# sourceMappingURL=postDataSource.d.ts.map