import type { Row, Query } from '../ds/types.js';
export interface StoreProps<T extends object> {
    datasourceId: string;
    alias?: string;
    query?: Query<T>;
    autoQuery?: boolean;
}
export interface StoreState<T extends object> {
    rows: Record<string, Row<T>>;
    rowIds: string[];
    selectedIds: string[];
    isBusy: boolean;
    totalRowCount?: number;
}
export declare class StoreClass<T extends object> {
    readonly datasourceId: string;
    readonly alias: string;
    readonly key: string;
    readonly autoQuery: boolean;
    query: Query<T>;
    state: StoreState<T>;
    constructor(props: StoreProps<T>);
    static getOrCreate<T extends object>(props: StoreProps<T>): StoreClass<T>;
    list(): Row<T>[];
    row(id: string): Row<T> | undefined;
    isBusy(): boolean;
    selectedRowIds(): string[];
    isStoreDirty(): boolean;
    dirtyRows(): Row<T>[];
    selectRow(id: string): void;
    deSelectRow(id: string): void;
    setValue<K extends keyof T>(attrCode: K, value: T[K], rowId: string): void;
    createNew(partialRecord?: Partial<T>): string;
    deleteRow(id: string): void;
    refresh(): Promise<void>;
    executeQuery(): Promise<void>;
    save(): Promise<boolean>;
}
export declare function useStore<T extends object>(props: StoreProps<T>): StoreClass<T>;
//# sourceMappingURL=store.d.ts.map