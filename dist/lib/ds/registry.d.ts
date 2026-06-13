import type { DataSource } from './types.js';
declare global {
    var _$uvDataSources: Map<string, DataSource<any>> | undefined;
}
export declare function getDataSource<T extends object>(id: string): DataSource<T>;
export declare function addDataSources(ds: Record<string, DataSource<any>>): void;
export declare function getAllDataSources(): Record<string, DataSource<any>>;
export declare function clearDataSourceCache(): void;
//# sourceMappingURL=registry.d.ts.map