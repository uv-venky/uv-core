import { invalidateQuery, invalidateQueries, invalidateAllQueries } from './valtioQueryStore.js';
export { invalidateQuery, invalidateQueries, invalidateAllQueries };
export declare const headerModifiers: Array<(headers: Record<string, string>) => void>;
export declare function applyHeaderModifiers(headers: Record<string, string>): void;
/**
 * Invoke a registry action from the client and return the result.
 * Does not show error toasts; throws on error.
 */
export declare function invokeQueryAction<T>(actionName: string, ...params: unknown[]): Promise<T>;
/** Generic query result type for use in consuming projects */
export type QueryResult<TData> = {
    status: 'loading';
} | {
    status: 'error';
    error: string;
} | {
    status: 'success';
    data: TData;
};
export interface QueryOptions {
    /** Time in ms that data is considered fresh. Default: Infinity (never stale) */
    staleTime?: number;
    /** Refetch when window regains focus. Default: false */
    refetchOnWindowFocus?: boolean;
    /** Only fetch when true. Default: true */
    enabled?: boolean;
    /** Whether this is a public (unauthenticated) action */
    isPublic?: boolean;
    /** Number of retry attempts on failure. Default: 0 (no retries) */
    retry?: number;
    /** Delay between retries in ms. Default: 1000. Can be a function for exponential backoff. */
    retryDelay?: number | ((attempt: number) => number);
    /** Auto-refetch interval in ms. Default: undefined (no auto-refetch) */
    refetchInterval?: number;
}
export interface PrefetchOptions {
    /** Whether this is a public (unauthenticated) action */
    isPublic?: boolean;
    /** Number of retry attempts on failure. Default: 0 */
    retry?: number;
    /** Delay between retries in ms. Default: 1000 */
    retryDelay?: number | ((attempt: number) => number);
}
export interface SuspenseQueryOptions {
    /** Time in ms that data is considered fresh. Default: Infinity (never stale) */
    staleTime?: number;
    /** Whether this is a public (unauthenticated) action */
    isPublic?: boolean;
    /** Number of retry attempts on failure. Default: 0 (no retries) */
    retry?: number;
    /** Delay between retries in ms. Default: 1000. Can be a function for exponential backoff. */
    retryDelay?: number | ((attempt: number) => number);
}
export interface MutationOptionsBase<TOutput> {
    /** Action names to invalidate on success */
    invalidateOnSuccess?: string[];
    /** Whether this is a public (unauthenticated) action */
    isPublic?: boolean;
    /** Callback on success */
    onSuccess?: (result: TOutput) => void;
    /** Callback on error (in addition to toast) */
    onError?: (error: string) => void;
}
export declare function useQueryBase<TOutput = unknown>(name: string, options: QueryOptions, ...params: unknown[]): QueryResult<TOutput>;
export declare function useSuspenseQueryBase<TOutput = unknown>(name: string, options: SuspenseQueryOptions, ...params: unknown[]): TOutput;
export interface MutationCallOptions {
    signal?: AbortSignal;
}
export declare function useMutationBase<TParams extends unknown[] = unknown[], TOutput = unknown>(name: string, options?: MutationOptionsBase<TOutput>): (...args: [...TParams] | [...TParams, MutationCallOptions]) => Promise<TOutput>;
export declare function prefetchQueryBase(name: string, options: PrefetchOptions, ...params: unknown[]): Promise<void>;
//# sourceMappingURL=useQueryBase.d.ts.map