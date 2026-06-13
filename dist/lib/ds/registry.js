if (!globalThis._$uvDataSources) {
    globalThis._$uvDataSources = new Map();
}
export function getDataSource(id) {
    const map = globalThis._$uvDataSources;
    if (!map) {
        throw new Error('Data sources registry not initialized');
    }
    const ds = map.get(id);
    if (!ds) {
        throw new Error(`Data source ${id} not found in registry`);
    }
    return ds;
}
export function addDataSources(ds) {
    const map = globalThis._$uvDataSources;
    if (!map) {
        throw new Error('Data sources registry not initialized');
    }
    Object.entries(ds).forEach(([id, definition]) => {
        map.set(id, definition);
    });
}
export function getAllDataSources() {
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
//# sourceMappingURL=registry.js.map