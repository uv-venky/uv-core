'use client';

import { proxy, useSnapshot } from 'valtio';
import { useEffect, useCallback, useRef } from 'react';
import type { Row, DBRow, NewRow, Query } from '../ds/types.js';
import { showError, showSuccess } from './notifications.js';
import stringify from 'fast-json-stable-stringify';

export interface StoreProps<T extends object> {
  datasourceId: string;
  alias?: string;
  query?: Query<T>;
  autoQuery?: boolean;
}

export interface StoreState<T extends object> {
  rows: Record<string, Row<T>>; // maps _id or _cid to Row
  rowIds: string[]; // keys in display order
  selectedIds: string[];
  isBusy: boolean;
  totalRowCount?: number;
}

// Global cache of stores by unique key (datasourceId:alias)
const globalStoreCache = new Map<string, StoreClass<any>>();

export class StoreClass<T extends object> {
  public readonly datasourceId: string;
  public readonly alias: string;
  public readonly key: string;
  public readonly autoQuery: boolean;
  public query: Query<T>;
  public state: StoreState<T>;

  constructor(props: StoreProps<T>) {
    this.datasourceId = props.datasourceId;
    this.alias = props.alias ?? 'default';
    this.key = `${this.datasourceId}:${this.alias}`;
    this.autoQuery = props.autoQuery ?? true;
    this.query = props.query ?? {};
    this.state = proxy<StoreState<T>>({
      rows: {},
      rowIds: [],
      selectedIds: [],
      isBusy: false,
    });
  }

  public static getOrCreate<T extends object>(props: StoreProps<T>): StoreClass<T> {
    const key = `${props.datasourceId}:${props.alias ?? 'default'}`;
    let store = globalStoreCache.get(key);
    if (!store) {
      store = new StoreClass<T>(props);
      globalStoreCache.set(key, store);
    }
    return store as StoreClass<T>;
  }

  // Getters
  public list(): Row<T>[] {
    return this.state.rowIds.map((id) => this.state.rows[id]).filter(Boolean);
  }

  public row(id: string): Row<T> | undefined {
    return this.state.rows[id];
  }

  public isBusy(): boolean {
    return this.state.isBusy;
  }

  public selectedRowIds(): string[] {
    return this.state.selectedIds;
  }

  public isStoreDirty(): boolean {
    return this.dirtyRows().length > 0;
  }

  public dirtyRows(): Row<T>[] {
    return this.list().filter((r) => {
      if (r._status === 'I' || r._status === 'D') return true;
      if (r._status === 'U') {
        // Check if values differ from original values (_orig)
        if (!r._orig) return true;
        return Object.keys(r._orig).some((key) => {
          return (r as any)[key] !== (r._orig as any)[key];
        });
      }
      return false;
    });
  }

  // Actions
  public selectRow(id: string) {
    if (!this.state.selectedIds.includes(id)) {
      this.state.selectedIds.push(id);
    }
  }

  public deSelectRow(id: string) {
    this.state.selectedIds = this.state.selectedIds.filter((x) => x !== id);
  }

  public setValue<K extends keyof T>(attrCode: K, value: T[K], rowId: string) {
    const row = this.state.rows[rowId];
    if (!row) return;

    // Set dirty status if it is currently clean ('Q')
    if (row._status === 'Q') {
      row._status = 'U';
      // Populate original values cache (_orig) if not already set
      if (!row._orig) {
        const orig: any = {};
        Object.keys(row).forEach((k) => {
          if (!k.startsWith('_')) {
            orig[k] = (row as any)[k];
          }
        });
        row._orig = orig;
      }
    }

    (row as any)[attrCode] = value;
  }

  public createNew(partialRecord: Partial<T> = {}): string {
    const cid = `c_${Math.random().toString(36).substring(2, 9)}`;
    const newRow: NewRow<T> = {
      ...partialRecord,
      _cid: cid,
      _status: 'I',
    };

    this.state.rows[cid] = newRow;
    this.state.rowIds.push(cid);
    return cid;
  }

  public deleteRow(id: string) {
    const row = this.state.rows[id];
    if (!row) return;

    if (row._status === 'I') {
      // If it was just added locally, remove it completely
      delete this.state.rows[id];
      this.state.rowIds = this.state.rowIds.filter((x) => x !== id);
      this.state.selectedIds = this.state.selectedIds.filter((x) => x !== id);
    } else {
      // Mark as deleted for server post
      row._status = 'D';
    }
  }

  public async refresh(): Promise<void> {
    return this.executeQuery();
  }

  public async executeQuery(): Promise<void> {
    if (this.state.isBusy) return;
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

      const newRows: Record<string, Row<T>> = {};
      const newRowIds: string[] = [];

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
    } catch (error: any) {
      showError(`Query failed: ${error.message}`);
    } finally {
      this.state.isBusy = false;
    }
  }

  public async save(): Promise<boolean> {
    if (this.state.isBusy) return false;
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
    } catch (error: any) {
      showError(`Save failed: ${error.message}`);
      return false;
    } finally {
      this.state.isBusy = false;
    }
  }
}

export function useStore<T extends object>(props: StoreProps<T>): StoreClass<T> {
  const store = StoreClass.getOrCreate<T>(props);
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
