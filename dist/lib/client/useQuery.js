'use client';
import { prefetchQueryBase, useMutationBase, useQueryBase, useSuspenseQueryBase, } from './useQueryBase.js';
/**
 * Simple query hook for fetching action data.
 */
export function useQuery(name, ...params) {
    return useQueryBase(name, {}, ...params);
}
/**
 * Query hook with options like staleTime, refetchInterval, etc.
 */
export function useQueryWithOptions(name, options, ...params) {
    return useQueryBase(name, options, ...params);
}
/**
 * Suspense-enabled query hook. Suspends until data is ready.
 * Must be used within a React Suspense boundary.
 */
export function useSuspenseQuery(name, options, ...params) {
    return useSuspenseQueryBase(name, options, ...params);
}
/**
 * Mutation hook with cache invalidation and callbacks.
 */
export function useMutation(name, options = {}) {
    return useMutationBase(name, options);
}
/**
 * Prefetch data into the cache without triggering a component render.
 */
export async function prefetchQuery(name, options, ...params) {
    return prefetchQueryBase(name, options, ...params);
}
//# sourceMappingURL=useQuery.js.map