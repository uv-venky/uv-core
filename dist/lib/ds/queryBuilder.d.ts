import type { DataSource, Query } from './types.js';
export declare class QueryBuilder<T extends object> {
    private ds;
    private session;
    private selectFields;
    private joinClauses;
    private whereClauses;
    private params;
    private orderClause;
    private limitClause;
    private offsetClause;
    constructor(ds: DataSource<T>, session: any);
    applyQuery(query: Query<T>): void;
    getQuery(): string;
    getCountQuery(): string;
    getParams(): any[];
    getCountParams(): any[];
}
//# sourceMappingURL=queryBuilder.d.ts.map