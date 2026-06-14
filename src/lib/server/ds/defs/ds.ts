import type { DataSource } from '@/lib/core/common/ds/types/DataSource';

declare global {
  var _$wayvoDataSources: Map<string, DataSource<any>> | undefined;
  var _$wayvoDataSourcesVersion: number | undefined;
}

if (!globalThis._$wayvoDataSources) {
  globalThis._$wayvoDataSources = new Map<string, DataSource<any>>();
  globalThis._$wayvoDataSourcesVersion = 0;
}

export async function clearDataSourceCache() {
  const map = globalThis._$wayvoDataSources;
  if (!map) return;
  map.clear();
  globalThis._$wayvoDataSourcesVersion = (globalThis._$wayvoDataSourcesVersion ?? 0) + 1;
}

export async function addDataSources(ds: Record<string, DataSource<any>>, options?: { reload?: boolean }) {
  const map = globalThis._$wayvoDataSources;
  if (!map) {
    throw new Error('Data sources not initialized');
  }
  Object.entries(ds).forEach(([id, item]) => {
    map.set(id, item);
  });
}

export function getDataSource<T extends object>(id: string): DataSource<T> {
  const map = globalThis._$wayvoDataSources;
  if (!map) {
    throw new Error('Data sources not initialized');
  }
  const ds = map.get(id);
  if (!ds) {
    throw new Error(`Data source ${id} not found`);
  }
  return ds as DataSource<T>;
}

export function getAllDataSources(): Record<string, DataSource<any>> {
  const map = globalThis._$wayvoDataSources;
  if (!map) {
    throw new Error('Data sources not initialized');
  }
  return Object.fromEntries(map.entries());
}
