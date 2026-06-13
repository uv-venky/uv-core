import type { DataSource } from './types.js';

declare global {
  // eslint-disable-next-line no-var
  var _$uvDataSources: Map<string, DataSource<any>> | undefined;
}

if (!globalThis._$uvDataSources) {
  globalThis._$uvDataSources = new Map<string, DataSource<any>>();
}

export function getDataSource<T extends object>(id: string): DataSource<T> {
  const map = globalThis._$uvDataSources;
  if (!map) {
    throw new Error('Data sources registry not initialized');
  }
  const ds = map.get(id);
  if (!ds) {
    throw new Error(`Data source ${id} not found in registry`);
  }
  return ds as DataSource<T>;
}

export function addDataSources(ds: Record<string, DataSource<any>>) {
  const map = globalThis._$uvDataSources;
  if (!map) {
    throw new Error('Data sources registry not initialized');
  }
  Object.entries(ds).forEach(([id, definition]) => {
    map.set(id, definition);
  });
}

export function getAllDataSources(): Record<string, DataSource<any>> {
  const map = globalThis._$uvDataSources;
  if (!map) {
    throw new Error('Data sources registry not initialized');
  }
  return Object.fromEntries(map.entries());
}

export function clearDataSourceCache() {
  const map = globalThis._$uvDataSources;
  if (map) {
    map.clear();
  }
}
