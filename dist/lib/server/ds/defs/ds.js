if (!globalThis._$wayvoDataSources) {
    globalThis._$wayvoDataSources = new Map();
    globalThis._$wayvoDataSourcesVersion = 0;
}
export async function clearDataSourceCache() {
    const map = globalThis._$wayvoDataSources;
    if (!map)
        return;
    map.clear();
    globalThis._$wayvoDataSourcesVersion = (globalThis._$wayvoDataSourcesVersion ?? 0) + 1;
}
export async function addDataSources(ds, options) {
    const map = globalThis._$wayvoDataSources;
    if (!map) {
        throw new Error('Data sources not initialized');
    }
    Object.entries(ds).forEach(([id, item]) => {
        map.set(id, item);
    });
}
export function getDataSource(id) {
    const map = globalThis._$wayvoDataSources;
    if (!map) {
        throw new Error('Data sources not initialized');
    }
    const ds = map.get(id);
    if (!ds) {
        throw new Error(`Data source ${id} not found`);
    }
    return ds;
}
export function getAllDataSources() {
    const map = globalThis._$wayvoDataSources;
    if (!map) {
        throw new Error('Data sources not initialized');
    }
    return Object.fromEntries(map.entries());
}
//# sourceMappingURL=ds.js.map