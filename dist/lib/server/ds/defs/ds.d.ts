import type { DataSource } from '../../../../lib/core/common/ds/types/DataSource';
declare global {
    var _$wayvoDataSources: Map<string, DataSource<any>> | undefined;
    var _$wayvoDataSourcesVersion: number | undefined;
}
export declare function clearDataSourceCache(): Promise<void>;
export declare function addDataSources(ds: Record<string, DataSource<any>>, options?: {
    reload?: boolean;
}): Promise<void>;
export declare function getDataSource<T extends object>(id: string): DataSource<T>;
export declare function getAllDataSources(): Record<string, DataSource<any>>;
//# sourceMappingURL=ds.d.ts.map