import type { DataSourceAccess } from './types.js';
import type { TableDataSource } from './types.js';
import type { Attribute } from './types.js';
export declare const DefaultDataSource: Omit<TableDataSource<any>, 'id' | 'description' | 'tableName' | 'attributes' | 'access' | 'externalType' | 'externalId'>;
export declare const DefaultAttribute: Omit<Attribute<any>, 'code' | 'name'>;
export declare const DefaultCalculatedAttribute: Omit<Attribute<any>, 'code' | 'name'>;
export declare const DefaultFullAccess: Omit<DataSourceAccess, 'roleCode'>;
export declare const DefaultReadOnlyAccess: Omit<DataSourceAccess, 'roleCode'>;
//# sourceMappingURL=defaults.d.ts.map