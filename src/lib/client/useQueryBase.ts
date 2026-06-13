'use client';

import { ref, useSnapshot } from 'valtio';
import {
  getCacheKey,
  queryStore,
  updateUsage,
  invalidateQuery,
  invalidateQueries,
  invalidateAllQueries,
  type CacheEntry,
} from './valtioQueryStore.js';
import stringify from 'fast-json-stable-stringify';
import {
  AbortError,
  getErrorMessage,
  isErrorResponse,
  isAbortedRequestError,
  type ErrorResponse,
} from '../common/exceptions.js';
import { showError } from './notifications.js';
import { useCallback, useEffect, useRef } from 'react';

// Re-export cache utilities for convenience
export { invalidateQuery, invalidateQueries, invalidateAllQueries };

// Header modifiers registry
export const headerModifiers: Array<(headers: Record<string, string>) => void> = [];
export function applyHeaderModifiers(headers: Record<string, string>) {
  for (const fn of headerModifiers) {
    fn(headers);
  }
}

// Devtools activity stubs
function logActivity(activity: any) { return 'activity-id'; }
function updateActivity(id: string, updates: any) {}
function logMutation(mutation: any) { return 'mutation-id'; }
function updateMutation(id: string, updates: any) {}

// Loading tracker stubs
function incrementPending(name: string) {}
function decrementPending() {}

// PubSub stubs
const globalPubSub = {
  pub(event: string, data: any) {}
};

/**
 * Invoke a registry action from the client and return the result.
 * Does not show error toasts; throws on error.
 */
export async function invokeQueryAction<T>(actionName: string, ...params: unknown[]): Promise<T> {
  const result = await fetchData(actionName, false, params, { showErrors: false });
  if (isErrorResponse(result)) {
    throw new Error(result.message);
  }
  return result as T;
}

// Symbol to mark wrapped primitives (to distinguish from objects that already have 'value')
const WRAPPED_PRIMITIVE = Symbol('__wrapped_primitive__');

/** Generic query result type for use in consuming projects */
export type QueryResult<TData> =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'success'; data: TData };

// Expose cache for devtools (development only)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as unknown as Record<string, unknown>).__QUERY_CACHE__ = queryStore;
}

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

async function fetchData<Params extends unknown[], Output>(
  action: string,
  isPublic: boolean,
  params: Params,
  options: { showErrors?: boolean; signal?: AbortSignal } = {},
): Promise<Output | ErrorResponse> {
  const { showErrors = true, signal } = options;
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    applyHeaderModifiers(headers);
    const response = await fetch(`/api/${isPublic ? 'p/' : ''}action`, {
      credentials: 'include',
      method: 'POST',
      headers,
      body: stringify([action, ...params]),
      signal,
    });
    if (!response) {
      if (showErrors) showError('Failed to fetch: response is undefined');
      return {
        status: 'ERROR',
        message: 'Failed to fetch: response is undefined',
      } as ErrorResponse;
    }
    if (!response.ok) {
      if (showErrors) showError(`Failed to fetch: response is not ok: ${response.status} ${response.statusText}`);
      return {
        status: 'ERROR',
        message: `Failed to fetch: response is not ok: ${response.status} ${response.statusText}`,
      } as ErrorResponse;
    }
    const { status, message, result } = await response.json();
    if (status === 'ERROR') {
      if (showErrors) showError(message ?? 'Unknown error');
      return {
        status: 'ERROR',
        message: message ?? 'Unknown error',
      } as ErrorResponse;
    }
    return result;
  } catch (e) {
    if (e instanceof AbortError || isAbortedRequestError(e)) {
      throw new AbortError();
    }
    throw e;
  }
}

function getRetryDelay(retryDelay: number | ((attempt: number) => number), attempt: number): number {
  return typeof retryDelay === 'function' ? retryDelay(attempt) : retryDelay;
}

async function fetchWithRetry<Params extends unknown[], Output>(
  action: string,
  isPublic: boolean,
  params: Params,
  retry: number,
  retryDelay: number | ((attempt: number) => number),
  options: { signal?: AbortSignal } = {},
): Promise<Output | ErrorResponse> {
  const { signal } = options;
  let lastError: ErrorResponse | null = null;

  for (let attempt = 0; attempt <= retry; attempt++) {
    try {
      const isLastAttempt = attempt === retry;
      const result = await fetchData<Params, Output>(action, isPublic, params, {
        showErrors: isLastAttempt,
        signal,
      });

      if (!isErrorResponse(result)) {
        return result;
      }

      lastError = result;
    } catch (e) {
      if (e instanceof AbortError || isAbortedRequestError(e)) {
        throw e;
      }
      throw e;
    }

    if (attempt < retry) {
      const delay = getRetryDelay(retryDelay, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return lastError ?? { status: 'ERROR', message: 'Unknown error' };
}

interface FetchConfig {
  name: string;
  cacheKey: string;
  isPublic: boolean;
  params: unknown[];
  retry: number;
  retryDelay: number | ((attempt: number) => number);
  signal?: AbortSignal;
}

/** Debounce time to prevent redundant refetches */
const REFETCH_DEBOUNCE_MS = 100;

function startFetch(config: FetchConfig): Promise<void> {
  const { name, cacheKey, isPublic, params, retry, retryDelay, signal } = config;

  const existingEntry = queryStore[cacheKey];

  if (existingEntry?.status === 'loading' && existingEntry.promise) {
    return existingEntry.promise;
  }

  if (
    existingEntry?.status === 'success' &&
    existingEntry.dataUpdatedAt &&
    Date.now() - existingEntry.dataUpdatedAt < REFETCH_DEBOUNCE_MS
  ) {
    return Promise.resolve();
  }

  incrementPending(`query:${name}`);
  const initialQueryFiredAt = Date.now();

  const activityId = logActivity({
    type: 'query',
    name,
    params,
    status: 'pending',
    startedAt: new Date(initialQueryFiredAt).toISOString(),
  });

  const promise = fetchWithRetry(name, isPublic, params, retry, retryDelay, { signal })
    .then((data) => {
      if (isErrorResponse(data)) {
        queryStore[cacheKey] = {
          status: 'error',
          error: data.message,
          initialQueryFiredAt,
        };
        updateActivity(activityId, {
          status: 'error',
          error: data.message,
          completedAt: new Date().toISOString(),
        });
      } else {
        const wrappedData =
          typeof data === 'object' && data !== null
            ? data
            : ({ value: data, [WRAPPED_PRIMITIVE]: true } as { value: unknown; [WRAPPED_PRIMITIVE]: true });
        queryStore[cacheKey] = {
          status: 'success',
          data: ref(wrappedData),
          initialQueryFiredAt,
          dataUpdatedAt: Date.now(),
        };
        updateActivity(activityId, {
          status: 'success',
          completedAt: new Date().toISOString(),
        });
      }
    })
    .catch((error: unknown) => {
      if (error instanceof AbortError || isAbortedRequestError(error)) {
        const entry = queryStore[cacheKey];
        if (!entry || entry.status !== 'success') {
          delete queryStore[cacheKey];
        }
        return;
      }
      const errorMessage = getErrorMessage(error);
      queryStore[cacheKey] = {
        status: 'error',
        error: errorMessage,
        initialQueryFiredAt,
      };
      updateActivity(activityId, {
        status: 'error',
        error: errorMessage,
        completedAt: new Date().toISOString(),
      });
    })
    .finally(() => {
      decrementPending();
    });

  if (existingEntry?.status === 'success' && existingEntry.data) {
    queryStore[cacheKey] = {
      ...existingEntry,
      promise,
      invalidated: false,
    };
    return promise;
  }

  queryStore[cacheKey] = {
    status: 'loading',
    promise,
    initialQueryFiredAt,
  };

  return promise;
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

export function useQueryBase<TOutput = unknown>(
  name: string,
  options: QueryOptions,
  ...params: unknown[]
): QueryResult<TOutput> {
  const {
    staleTime = Number.POSITIVE_INFINITY,
    refetchOnWindowFocus = false,
    enabled = true,
    isPublic = false,
    retry = 0,
    retryDelay = 1000,
    refetchInterval,
  } = options;
  const cacheKey = getCacheKey(name, params);
  const snap = useSnapshot(queryStore);
  const hasRefetchedOnFocus = useRef(false);
  const controllerRef = useRef<AbortController | null>(null);

  updateUsage(cacheKey);

  const isStale = useCallback(() => {
    const entry = queryStore[cacheKey];
    if (!entry || entry.invalidated || entry.status !== 'success' || !entry.dataUpdatedAt) return true;
    return Date.now() - entry.dataUpdatedAt > staleTime;
  }, [cacheKey, staleTime]);

  const triggerFetch = useCallback(() => {
    const prev = controllerRef.current;
    if (prev) prev.abort();
    controllerRef.current = new AbortController();
    startFetch({
      name,
      cacheKey,
      isPublic,
      params,
      retry,
      retryDelay,
      signal: controllerRef.current.signal,
    });
  }, [cacheKey, name, isPublic, retry, retryDelay]);

  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  if (enabled && !queryStore[cacheKey]) {
    triggerFetch();
  }

  useEffect(() => {
    if (!refetchOnWindowFocus || !enabled) return;

    const handleFocus = () => {
      const entry = queryStore[cacheKey];
      if (entry?.status !== 'loading' && !hasRefetchedOnFocus.current) {
        hasRefetchedOnFocus.current = true;
        triggerFetch();
        setTimeout(() => {
          hasRefetchedOnFocus.current = false;
        }, 1000);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetchOnWindowFocus, enabled, cacheKey, triggerFetch]);

  useEffect(() => {
    if (!refetchInterval || !enabled) return;

    const intervalId = setInterval(() => {
      const entry = queryStore[cacheKey];
      if (entry?.status !== 'loading') {
        triggerFetch();
      }
    }, refetchInterval);

    return () => clearInterval(intervalId);
  }, [refetchInterval, enabled, cacheKey, triggerFetch]);

  const result = snap[cacheKey] as CacheEntry<TOutput> | undefined;
  const { status, data, error, invalidated } = result ?? { status: 'loading' };

  useEffect(() => {
    if (!invalidated || !enabled) return;

    triggerFetch();
  }, [invalidated, enabled, cacheKey, isStale, triggerFetch]);

  if (!enabled) {
    return { status: 'loading' };
  }

  if (status === 'loading') {
    return { status };
  }

  if (status === 'error') {
    return { status, error: error ?? 'Unknown error' };
  }

  if (status === 'success' && data) {
    const dataObj = data as { value?: unknown; [WRAPPED_PRIMITIVE]?: boolean };
    const unwrappedData =
      typeof data === 'object' && data !== null && WRAPPED_PRIMITIVE in dataObj && dataObj[WRAPPED_PRIMITIVE]
        ? dataObj.value
        : data;
    return { status, data: unwrappedData as TOutput };
  }

  throw new Error('Invalid query state');
}

export function useSuspenseQueryBase<TOutput = unknown>(
  name: string,
  options: SuspenseQueryOptions,
  ...params: unknown[]
): TOutput {
  const { isPublic = false, retry = 0, retryDelay = 1000 } = options;
  const cacheKey = getCacheKey(name, params);
  const snap = useSnapshot(queryStore);
  const controllerRef = useRef<AbortController | null>(null);

  updateUsage(cacheKey);

  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  if (!queryStore[cacheKey]) {
    if (!controllerRef.current) controllerRef.current = new AbortController();
    const promise = startFetch({
      name,
      cacheKey,
      isPublic,
      params,
      retry,
      retryDelay,
      signal: controllerRef.current.signal,
    });
    throw promise;
  }

  const result = snap[cacheKey] as CacheEntry<TOutput> | undefined;

  if (!result) {
    throw new Error('Query result not found');
  }

  if (result.status === 'loading' && result.promise) {
    throw result.promise;
  }

  if (result.status === 'error') {
    throw new Error(result.error ?? 'Query failed');
  }

  if (result.status === 'success' && result.data) {
    const dataObj = result.data as { value?: unknown; [WRAPPED_PRIMITIVE]?: boolean };
    const unwrappedData =
      typeof result.data === 'object' &&
      result.data !== null &&
      WRAPPED_PRIMITIVE in dataObj &&
      dataObj[WRAPPED_PRIMITIVE]
        ? dataObj.value
        : result.data;
    return unwrappedData as TOutput;
  }

  throw new Error('Invalid query state');
}

export interface MutationCallOptions {
  signal?: AbortSignal;
}

export function useMutationBase<TParams extends unknown[] = unknown[], TOutput = unknown>(
  name: string,
  options: MutationOptionsBase<TOutput> = {},
): (...args: [...TParams] | [...TParams, MutationCallOptions]) => Promise<TOutput> {
  const { invalidateOnSuccess, isPublic = false, onSuccess, onError } = options;

  const mutate = useCallback(
    async (...args: [...TParams] | [...TParams, MutationCallOptions]): Promise<TOutput> => {
      let params: TParams;
      let signal: AbortSignal | undefined;
      const last = args[args.length - 1];
      if (
        args.length > 0 &&
        typeof last === 'object' &&
        last !== null &&
        'signal' in last &&
        (last as MutationCallOptions).signal instanceof AbortSignal
      ) {
        params = args.slice(0, -1) as TParams;
        signal = (last as MutationCallOptions).signal;
      } else {
        params = args as TParams;
      }

      const startedAt = new Date().toISOString();

      const mutationId = logMutation({
        name,
        params,
        status: 'pending',
        startedAt,
      });

      try {
        const result = (await fetchData(name, isPublic, params, { signal })) as TOutput;

        if (isErrorResponse(result)) {
          onError?.((result as ErrorResponse).message);

          updateMutation(mutationId, {
            status: 'error',
            error: (result as ErrorResponse).message,
            completedAt: new Date().toISOString(),
          });

          throw new AbortError();
        }

        if (invalidateOnSuccess?.length) {
          invalidateQueries(invalidateOnSuccess);

          const ts = new Date().toISOString();
          logActivity({
            type: 'cache-invalidate',
            name: `Invalidated: ${invalidateOnSuccess.join(', ')}`,
            status: 'success',
            startedAt: ts,
            completedAt: ts,
          });
        }

        updateMutation(mutationId, {
          status: 'success',
          completedAt: new Date().toISOString(),
          invalidatedQueries: invalidateOnSuccess,
        });

        onSuccess?.(result);
        return result;
      } catch (error) {
        if (!(error instanceof AbortError) && !isAbortedRequestError(error)) {
          const errorMessage = getErrorMessage(error);
          updateMutation(mutationId, {
            status: 'error',
            error: errorMessage,
            completedAt: new Date().toISOString(),
          });
        }
        throw error;
      }
    },
    [name, isPublic, invalidateOnSuccess, onSuccess, onError],
  );

  return mutate;
}

export async function prefetchQueryBase(name: string, options: PrefetchOptions, ...params: unknown[]): Promise<void> {
  const { isPublic = false, retry = 0, retryDelay = 1000 } = options;
  const cacheKey = getCacheKey(name, params);

  if (queryStore[cacheKey]?.status === 'success') {
    return;
  }

  if (queryStore[cacheKey]?.status === 'loading') {
    return queryStore[cacheKey].promise;
  }

  await startFetch({ name, cacheKey, isPublic, params, retry, retryDelay });
}
