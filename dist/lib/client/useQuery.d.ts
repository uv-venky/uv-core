import { type PrefetchOptions, type QueryOptions, type QueryResult, type SuspenseQueryOptions, type MutationOptionsBase, type MutationCallOptions } from './useQueryBase.js';
/**
 * Interface that consuming applications can augment to declare their actions registry type.
 *
 * @example
 * declare module 'uv-core/client' {
 *   interface Register {
 *     getChartData: (client: any, session: any, startDate: string, endDate: string) => Promise<ChartData>;
 *   }
 * }
 */
export interface Register {
}
export type ActionName = keyof Register extends never ? string : keyof Register;
export type ActionParams<T extends ActionName> = T extends keyof Register ? Register[T] extends (client: any, session: any, ...args: infer P) => any ? P : Register[T] extends (client: any, ...args: infer P) => any ? P : any[] : any[];
export type ActionOutput<T extends ActionName> = T extends keyof Register ? Register[T] extends (...args: any[]) => any ? ReturnType<Register[T]> : any : any;
/**
 * Simple query hook for fetching action data.
 */
export declare function useQuery<T extends ActionName>(name: T, ...params: ActionParams<T>): QueryResult<Awaited<ActionOutput<T>>>;
/**
 * Query hook with options like staleTime, refetchInterval, etc.
 */
export declare function useQueryWithOptions<T extends ActionName>(name: T, options: QueryOptions, ...params: ActionParams<T>): QueryResult<Awaited<ActionOutput<T>>>;
/**
 * Suspense-enabled query hook. Suspends until data is ready.
 * Must be used within a React Suspense boundary.
 */
export declare function useSuspenseQuery<T extends ActionName>(name: T, options: SuspenseQueryOptions, ...params: ActionParams<T>): Awaited<ActionOutput<T>>;
/**
 * Mutation hook with cache invalidation and callbacks.
 */
export declare function useMutation<T extends ActionName>(name: T, options?: MutationOptionsBase<Awaited<ActionOutput<T>>>): (...args: [...ActionParams<T>] | [...ActionParams<T>, MutationCallOptions]) => Promise<Awaited<ActionOutput<T>>>;
/**
 * Prefetch data into the cache without triggering a component render.
 */
export declare function prefetchQuery<T extends ActionName>(name: T, options: PrefetchOptions, ...params: ActionParams<T>): Promise<void>;
export type { QueryOptions, SuspenseQueryOptions, MutationOptionsBase, MutationCallOptions, QueryResult };
//# sourceMappingURL=useQuery.d.ts.map