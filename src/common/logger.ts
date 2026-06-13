import { AsyncLocalStorage } from 'node:async_hooks';
import pino, { type Logger as PinoLogger } from 'pino';
import PinoPretty from 'pino-pretty';

export interface LogContext {
  trackId?: string;
  userId?: number;
  email?: string;
  method?: string;
  path?: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __baseFrameworkLogger: Logger | undefined;
}

class Logger {
  readonly context = new AsyncLocalStorage<LogContext>();
  readonly pino: PinoLogger;

  constructor(pinoLogger: PinoLogger) {
    this.pino = pinoLogger;
  }

  runWithContext<T>(ctx: LogContext, fn: () => T): T {
    return this.context.run(ctx, fn);
  }

  get traceEnabled(): boolean {
    return this.pino.levelVal <= 10;
  }

  get debugEnabled(): boolean {
    return this.pino.levelVal <= 20;
  }

  private mergeContext(args: unknown[]): [LogContext | undefined, string] {
    const store = this.context.getStore();
    const message = args
      .map((arg) => {
        if (typeof arg === 'string') {
          return arg;
        }
        try {
          return JSON.stringify(arg);
        } catch {
          return String(arg);
        }
      })
      .join(' ');
    return [store, message];
  }

  error(...args: unknown[]): void {
    const [ctx, message] = this.mergeContext(args);
    this.pino.error(ctx ?? {}, message);
  }

  warn(...args: unknown[]): void {
    const [ctx, message] = this.mergeContext(args);
    this.pino.warn(ctx ?? {}, message);
  }

  info(...args: unknown[]): void {
    const [ctx, message] = this.mergeContext(args);
    this.pino.info(ctx ?? {}, message);
  }

  debug(...args: unknown[]): void {
    const [ctx, message] = this.mergeContext(args);
    this.pino.debug(ctx ?? {}, message);
  }

  trace(...args: unknown[]): void {
    const [ctx, message] = this.mergeContext(args);
    this.pino.trace(ctx ?? {}, message);
  }

  logQuery(text: string, durationMs: number, params?: unknown[]): void {
    if (!this.debugEnabled) {
      return;
    }
    this.debug('database query', { text, durationMs, params });
  }
}

function buildPinoLogger(level: string): PinoLogger {
  if (process.env.NODE_ENV === 'production') {
    return pino({ level });
  }

  return pino(
    { level },
    PinoPretty({
      colorize: true,
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
      singleLine: true,
    }),
  );
}

function ensureLogger(): Logger {
  if (!globalThis.__baseFrameworkLogger) {
    const level =
      process.env.LOG_LEVEL ?? (process.env.NODE_ENV === 'development' ? 'debug' : 'info');
    globalThis.__baseFrameworkLogger = new Logger(buildPinoLogger(level));
  }
  return globalThis.__baseFrameworkLogger;
}

export type LoggerType = Logger;

const logger = {
  error: (...args: unknown[]) => ensureLogger().error(...args),
  warn: (...args: unknown[]) => ensureLogger().warn(...args),
  info: (...args: unknown[]) => ensureLogger().info(...args),
  debug: (...args: unknown[]) => ensureLogger().debug(...args),
  trace: (...args: unknown[]) => ensureLogger().trace(...args),
  logQuery: (text: string, durationMs: number, params?: unknown[]) =>
    ensureLogger().logQuery(text, durationMs, params),
  runWithContext: <T>(ctx: LogContext, fn: () => T) => ensureLogger().runWithContext(ctx, fn),
  get traceEnabled(): boolean {
    return ensureLogger().traceEnabled;
  },
  get debugEnabled(): boolean {
    return ensureLogger().debugEnabled;
  },
  get context(): AsyncLocalStorage<LogContext> {
    return ensureLogger().context;
  },
};

export default logger;

export function setLogLevel(level: string): void {
  globalThis.__baseFrameworkLogger = new Logger(buildPinoLogger(level));
}
