import { AsyncLocalStorage } from 'node:async_hooks';
import { type Logger as PinoLogger } from 'pino';
export interface LogContext {
    trackId?: string;
    userId?: number;
    email?: string;
    method?: string;
    path?: string;
}
export interface LoggerType {
    error(...args: unknown[]): void;
    warn(...args: unknown[]): void;
    info(...args: unknown[]): void;
    debug(...args: unknown[]): void;
    trace(...args: unknown[]): void;
    logQuery(text: string, durationMs: number, params?: unknown[]): void;
    runWithContext<T>(ctx: LogContext, fn: () => T): T;
    readonly traceEnabled: boolean;
    readonly debugEnabled: boolean;
}
declare global {
    var __baseFrameworkLogger: Logger | undefined;
}
declare class Logger implements LoggerType {
    readonly context: AsyncLocalStorage<LogContext>;
    readonly pino: PinoLogger;
    constructor(pinoLogger: PinoLogger);
    runWithContext<T>(ctx: LogContext, fn: () => T): T;
    get traceEnabled(): boolean;
    get debugEnabled(): boolean;
    private mergeContext;
    error(...args: unknown[]): void;
    warn(...args: unknown[]): void;
    info(...args: unknown[]): void;
    debug(...args: unknown[]): void;
    trace(...args: unknown[]): void;
    logQuery(text: string, durationMs: number, params?: unknown[]): void;
}
declare const logger: LoggerType;
export default logger;
export declare function setLogLevel(level: string): void;
//# sourceMappingURL=logger.d.ts.map