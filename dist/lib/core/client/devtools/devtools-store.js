import { proxy } from 'valtio';
export const devtoolsStore = proxy({
    enabled: false,
    open: false,
    activeTab: 'activity',
    filter: '',
    slowThreshold: 500,
    activity: [],
    mutations: [],
    stores: {},
    network: [],
    routes: [],
    errors: [],
    environment: {},
    config: {},
});
export function openDevtools() {
    devtoolsStore.open = true;
}
export function closeDevtools() {
    devtoolsStore.open = false;
}
export function toggleDevtools() {
    devtoolsStore.open = !devtoolsStore.open;
}
export function setActiveTab(tab) {
    devtoolsStore.activeTab = tab;
}
export function setFilter(filter) {
    devtoolsStore.filter = filter;
}
export function setSlowThreshold(threshold) {
    devtoolsStore.slowThreshold = threshold;
}
export function logActivity(activity) {
    return 'activity-id';
}
export function updateActivity(id, updates) { }
export function clearActivity() { }
export function logMutation(mutation) {
    return 'mutation-id';
}
export function updateMutation(id, updates) { }
export function clearMutations() { }
export function registerStore(storeInfo) { }
export function updateStore(key, updates) { }
export function unregisterStore(key) { }
export function clearStores() { }
export function logNetwork(network) {
    return 'network-id';
}
export function updateNetwork(id, updates) { }
export function clearNetwork() { }
export function installFetchInterceptor() { }
export function uninstallFetchInterceptor() { }
export function logRoute(route) { }
export function clearRoutes() { }
export function logError(source, message, options) {
    return 'error-id';
}
export function logException(exception, source, context) {
    return 'exception-id';
}
export function clearErrors() { }
export function setEnvironmentInfo(info) { }
export function setConfigInfo(info) { }
export function enableDevtools() {
    devtoolsStore.enabled = true;
}
export function disableDevtools() {
    devtoolsStore.enabled = false;
    devtoolsStore.open = false;
}
export function enableDevtoolsForRoles(roles) { }
export function clearAll() { }
export function exportDebugState() {
    return '{}';
}
//# sourceMappingURL=devtools-store.js.map