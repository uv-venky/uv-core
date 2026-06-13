import type { AuthenticatedRequest } from '../auth/auth.middleware.js';
export type Session = AuthenticatedRequest;
import type { PgPoolClient } from '../database/postgres.js';
export type StringKeyof<T> = Extract<keyof T, string>;
export type AttributeType = 'Text' | 'Number' | 'Boolean' | 'Date' | 'Time' | 'JSON' | 'UUID' | 'TextArray' | 'Polygon' | 'Vector' | 'Reference';
export interface ClientAttribute<T extends object> {
    allowDecimals?: boolean;
    audit?: boolean;
    auto?: boolean;
    calculated?: boolean;
    code: StringKeyof<T>;
    defaultValue?: string;
    enumValues?: Array<string>;
    excludeTime?: boolean;
    excludeTZ?: boolean;
    export?: boolean;
    insert?: boolean;
    max?: number;
    maxLength?: number;
    min?: number;
    name: string;
    noUppercaseSearch?: boolean;
    optional?: boolean;
    out?: boolean;
    param?: string;
    primary?: boolean;
    query?: boolean;
    refAlias?: string;
    joinAlias?: string;
    select?: boolean;
    type: AttributeType;
    update?: boolean;
    isBigInt?: boolean;
    skipTrimOnPost?: boolean;
}
export interface Attribute<T extends object> extends ClientAttribute<T> {
    column?: string;
    refTableName?: string;
    refWhereClause?: string | (() => string);
    refEquiJoin?: boolean;
}
export interface JoinDefinition {
    alias: string;
    tableName: string;
    joinType: 'INNER' | 'LEFT';
    on: string | (() => string);
    dependsOn?: string;
    description?: string;
}
export type DataSourceAccess = {
    roleCode: string;
    query?: boolean;
    insert?: boolean;
    update?: boolean;
    delete?: boolean;
    audit?: boolean;
    export?: boolean;
};
export type SchemaMemberValue<T> = {
    [P in StringKeyof<T>]?: T[P];
};
export type SchemaMember<T, V> = {
    [P in StringKeyof<T>]?: V;
};
export type NewRow<T extends object> = Partial<T> & {
    _ca?: StringKeyof<T>;
    _cid?: string;
    _id?: string;
    _orig?: Partial<T>;
    _newKeys?: StringKeyof<T>[];
    _ov?: unknown;
    _status?: 'N' | 'I';
    _chunkIndex?: number;
    _$select?: string[];
};
export type DBRow<T extends object> = T & {
    _ca?: StringKeyof<T>;
    _changedAttributes?: Partial<T>;
    _cid?: string;
    _id?: string;
    _orig?: Partial<T>;
    _newKeys?: StringKeyof<T>[];
    _ov?: unknown;
    _status: 'Q' | 'U' | 'D' | 'V' | 'E';
    _chunkIndex?: number;
    _$select?: string[];
};
export type Row<T extends object> = NewRow<T> | DBRow<T>;
export type QueryResult<T extends object> = {
    rows: DBRow<T>[];
    fields?: any[];
    elapsed: number;
    sql?: string;
    params?: any[];
    count?: number;
};
export type Query<T extends object> = {
    match?: SchemaMemberValue<T>;
    limit?: number;
    offset?: number;
    select?: StringKeyof<T>[];
    sort?: SchemaMember<T, number>;
    countOnly?: boolean;
    whereClause?: string;
    whereClauseParamList?: any[];
    orderBy?: string;
};
type BaseDataSource<T extends object> = {
    type: 'Table' | 'External';
    id: string;
    description?: string;
    cached?: boolean;
    logLevel?: string;
    skipQueryForUpdate?: boolean;
    readOnly?: boolean;
    attributes: Array<Attribute<T>>;
    joins?: Array<JoinDefinition>;
    bulkInsertChunkSize?: number;
    access: Array<DataSourceAccess>;
    publishSSE?: boolean;
    preQuery?: (props: {
        query: Query<T>;
        session: Session;
        client: PgPoolClient;
    }) => Promise<Query<T>>;
    preQuery2?: (props: {
        query: Query<T>;
        sql: string;
        params: any[];
        session: Session;
        client: PgPoolClient;
    }) => {
        sql: string;
        params: any[];
    };
    beforeUpdate?: (props: {
        rows: DBRow<T>[];
        previousRows?: DBRow<T>[];
        session: Session;
        client: PgPoolClient;
    }) => Promise<{
        rows: DBRow<T>[];
        skipDML?: boolean;
    }>;
    beforeInsert?: (props: {
        rows: DBRow<T>[];
        session: Session;
        client: PgPoolClient;
    }) => Promise<{
        rows: DBRow<T>[];
        skipDML?: boolean;
    }>;
    beforeDelete?: (props: {
        rows: DBRow<T>[];
        session: Session;
        client: PgPoolClient;
    }) => Promise<DBRow<T>[]>;
    afterInsert?: (props: {
        rows: DBRow<T>[];
        session: Session;
        client: PgPoolClient;
    }) => Promise<DBRow<T>[]>;
    afterDelete?: (props: {
        rows: DBRow<T>[];
        session: Session;
        client: PgPoolClient;
    }) => Promise<DBRow<T>[]>;
    afterUpdate?: (props: {
        rows: DBRow<T>[];
        previousRows?: DBRow<T>[];
        session: Session;
        client: PgPoolClient;
    }) => Promise<DBRow<T>[]>;
    postQuery?: (props: {
        query: Query<T>;
        rows: DBRow<T>[];
        session: Session;
        client: PgPoolClient;
    }) => Promise<DBRow<T>[]>;
    rowType: T[];
    getSelectableAttributes?: (session: Session) => Array<Attribute<T>>;
};
export type TableDataSource<T extends object> = BaseDataSource<T> & {
    type: 'Table';
    tableName: string;
    schema?: string;
};
export type ExternalDataSource<T extends object> = BaseDataSource<T> & {
    type: 'External';
    externalType: string;
    externalId: string;
};
export type DataSource<T extends object> = TableDataSource<T> | ExternalDataSource<T>;
export {};
//# sourceMappingURL=types.d.ts.map