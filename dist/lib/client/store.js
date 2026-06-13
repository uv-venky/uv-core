'use client';
import { proxy, useSnapshot } from 'valtio';
import { useEffect, useRef } from 'react';
import { showError, showSuccess } from './notifications.js';
import stringify from 'fast-json-stable-stringify';
// Global cache of stores by unique key (datasourceId:alias)
const globalStoreCache = new Map();
export class StoreClass {
    datasourceId;
    alias;
    key;
    autoQuery;
    query;
    state;
    constructor(props) {
        this.datasourceId = props.datasourceId;
        this.alias = props.alias ?? 'default';
        this.key = `${this.datasourceId}:${this.alias}`;
        this.autoQuery = props.autoQuery ?? true;
        this.query = props.query ?? {};
        this.state = proxy({
            rows: {},
            rowIds: [],
            selectedIds: [],
            isBusy: false,
        });
    }
    static getOrCreate(props) {
        const key = `${props.datasourceId}:${props.alias ?? 'default'}`;
        let store = globalStoreCache.get(key);
        if (!store) {
            store = new StoreClass(props);
            globalStoreCache.set(key, store);
        }
        return store;
    }
    // Getters
    list() {
        return this.state.rowIds.map((id) => this.state.rows[id]).filter(Boolean);
    }
    row(id) {
        return this.state.rows[id];
    }
    isBusy() {
        return this.state.isBusy;
    }
    selectedRowIds() {
        return this.state.selectedIds;
    }
    isStoreDirty() {
        return this.dirtyRows().length > 0;
    }
    dirtyRows() {
        return this.list().filter((r) => {
            if (r._status === 'I' || r._status === 'D')
                return true;
            if (r._status === 'U') {
                // Check if values differ from original values (_orig)
                if (!r._orig)
                    return true;
                return Object.keys(r._orig).some((key) => {
                    return r[key] !== r._orig[key];
                });
            }
            return false;
        });
    }
    // Actions
    selectRow(id) {
        if (!this.state.selectedIds.includes(id)) {
            this.state.selectedIds.push(id);
        }
    }
    deSelectRow(id) {
        this.state.selectedIds = this.state.selectedIds.filter((x) => x !== id);
    }
    setValue(attrCode, value, rowId) {
        const row = this.state.rows[rowId];
        if (!row)
            return;
        // Set dirty status if it is currently clean ('Q')
        if (row._status === 'Q') {
            row._status = 'U';
            // Populate original values cache (_orig) if not already set
            if (!row._orig) {
                const orig = {};
                Object.keys(row).forEach((k) => {
                    if (!k.startsWith('_')) {
                        orig[k] = row[k];
                    }
                });
                row._orig = orig;
            }
        }
        row[attrCode] = value;
    }
    createNew(partialRecord = {}) {
        const cid = `c_${Math.random().toString(36).substring(2, 9)}`;
        const newRow = {
            ...partialRecord,
            _cid: cid,
            _status: 'I',
        };
        this.state.rows[cid] = newRow;
        this.state.rowIds.push(cid);
        return cid;
    }
    deleteRow(id) {
        const row = this.state.rows[id];
        if (!row)
            return;
        if (row._status === 'I') {
            // If it was just added locally, remove it completely
            delete this.state.rows[id];
            this.state.rowIds = this.state.rowIds.filter((x) => x !== id);
            this.state.selectedIds = this.state.selectedIds.filter((x) => x !== id);
        }
        else {
            // Mark as deleted for server post
            row._status = 'D';
        }
    }
    async refresh() {
        return this.executeQuery();
    }
    async executeQuery() {
        if (this.state.isBusy)
            return;
        this.state.isBusy = true;
        try {
            const response = await fetch('/api/ds', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: stringify({
                    ds: this.datasourceId,
                    query: this.query,
                }),
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
            }
            const res = await response.json();
            if (res.status === 'ERROR') {
                throw new Error(res.message);
            }
            const newRows = {};
            const newRowIds = [];
            for (const row of res.rows) {
                const id = String(row._id ?? row.id ?? `r_${Math.random().toString(36).substring(2, 9)}`);
                row._id = id;
                row._status = 'Q';
                newRows[id] = row;
                newRowIds.push(id);
            }
            this.state.rows = newRows;
            this.state.rowIds = newRowIds;
            this.state.selectedIds = [];
            if (res.count !== undefined) {
                this.state.totalRowCount = res.count;
            }
        }
        catch (error) {
            showError(`Query failed: ${error.message}`);
        }
        finally {
            this.state.isBusy = false;
        }
    }
    async save() {
        if (this.state.isBusy)
            return false;
        const dirty = this.dirtyRows();
        if (dirty.length === 0) {
            return false;
        }
        this.state.isBusy = true;
        try {
            const response = await fetch('/api/ds', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: stringify({
                    ds: this.datasourceId,
                    rows: dirty,
                }),
            });
            if (!response.ok) {
                throw new Error(`Failed to save: ${response.status} ${response.statusText}`);
            }
            const res = await response.json();
            if (res.status === 'ERROR') {
                throw new Error(res.message);
            }
            // After successful save, refresh the store to get up-to-date values
            showSuccess(`${dirty.length} row${dirty.length === 1 ? '' : 's'} saved successfully.`);
            await this.executeQuery();
            return true;
        }
        catch (error) {
            showError(`Save failed: ${error.message}`);
            return false;
        }
        finally {
            this.state.isBusy = false;
        }
    }
}
export function useStore(props) {
    const store = StoreClass.getOrCreate(props);
    // Connect React re-renders to Valtio proxy updates
    useSnapshot(store.state);
    const initialLoadRef = useRef(false);
    useEffect(() => {
        if (store.autoQuery && !initialLoadRef.current) {
            initialLoadRef.current = true;
            store.executeQuery();
        }
    }, [store]);
    return store;
}
//# sourceMappingURL=store.js.map