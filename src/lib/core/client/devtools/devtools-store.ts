import { proxy } from 'valtio';

export const devtoolsStore = proxy({
  enabled: false,
  open: false,
  activeTab: 'activity' as const,
  filter: '',
  slowThreshold: 500,
  activity: [] as any[],
  mutations: [] as any[],
  stores: {} as Record<string, any>,
  network: [] as any[],
  routes: [] as any[],
  errors: [] as any[],
  environment: {} as any,
  config: {} as any,
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

export function setActiveTab(tab: any) {
  devtoolsStore.activeTab = tab;
}

export function setFilter(filter: string) {
  devtoolsStore.filter = filter;
}

export function setSlowThreshold(threshold: number) {
  devtoolsStore.slowThreshold = threshold;
}

export function logActivity(activity: any) {
  return 'activity-id';
}

export function updateActivity(id: string, updates: any) {}
export function clearActivity() {}

export function logMutation(mutation: any) {
  return 'mutation-id';
}

export function updateMutation(id: string, updates: any) {}
export function clearMutations() {}

export function registerStore(storeInfo: any) {}
export function updateStore(key: string, updates: any) {}
export function unregisterStore(key: string) {}
export function clearStores() {}

export function logNetwork(network: any) {
  return 'network-id';
}
export function updateNetwork(id: string, updates: any) {}
export function clearNetwork() {}
export function installFetchInterceptor() {}
export function uninstallFetchInterceptor() {}

export function logRoute(route: any) {}
export function clearRoutes() {}

export function logError(
  source: string,
  message: string,
  options?: { stack?: string; context?: Record<string, any>; url?: string },
): string {
  return 'error-id';
}
export function logException(exception: any, source?: string, context?: any): string {
  return 'exception-id';
}
export function clearErrors() {}

export function setEnvironmentInfo(info: any) {}
export function setConfigInfo(info: any) {}

export function enableDevtools() {
  devtoolsStore.enabled = true;
}
export function disableDevtools() {
  devtoolsStore.enabled = false;
  devtoolsStore.open = false;
}
export function enableDevtoolsForRoles(roles: string[]) {}
export function clearAll() {}
export function exportDebugState() {
  return '{}';
}
