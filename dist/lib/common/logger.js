import { AsyncLocalStorage } from 'node:async_hooks';
import pino from 'pino';
import PinoPretty from 'pino-pretty';
class Logger {
    context = new AsyncLocalStorage();
    pino;
    constructor(pinoLogger) {
        this.pino = pinoLogger;
    }
    runWithContext(ctx, fn) {
        return this.context.run(ctx, fn);
    }
    get traceEnabled() {
        return this.pino.levelVal <= 10;
    }
    get debugEnabled() {
        return this.pino.levelVal <= 20;
    }
    mergeContext(args) {
        const store = this.context.getStore();
        const message = args
            .map((arg) => {
            if (typeof arg === 'string') {
                return arg;
            }
            try {
                return JSON.stringify(arg);
            }
            catch {
                return String(arg);
            }
        })
            .join(' ');
        return [store, message];
    }
    error(...args) {
        const [ctx, message] = this.mergeContext(args);
        this.pino.error(ctx ?? {}, message);
    }
    warn(...args) {
        const [ctx, message] = this.mergeContext(args);
        this.pino.warn(ctx ?? {}, message);
    }
    info(...args) {
        const [ctx, message] = this.mergeContext(args);
        this.pino.info(ctx ?? {}, message);
    }
    debug(...args) {
        const [ctx, message] = this.mergeContext(args);
        this.pino.debug(ctx ?? {}, message);
    }
    trace(...args) {
        const [ctx, message] = this.mergeContext(args);
        this.pino.trace(ctx ?? {}, message);
    }
    logQuery(text, durationMs, params) {
        if (!this.debugEnabled) {
            return;
        }
        this.debug('database query', { text, durationMs, params });
    }
}
function buildPinoLogger(level) {
    if (process.env.NODE_ENV === 'production') {
        return pino({ level });
    }
    return pino({ level }, PinoPretty({
        colorize: true,
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
        singleLine: true,
    }));
}
function ensureLogger() {
    if (!globalThis.__baseFrameworkLogger) {
        const level = process.env.LOG_LEVEL ?? (process.env.NODE_ENV === 'development' ? 'debug' : 'info');
        globalThis.__baseFrameworkLogger = new Logger(buildPinoLogger(level));
    }
    return globalThis.__baseFrameworkLogger;
}
const logger = {
    error: (...args) => ensureLogger().error(...args),
    warn: (...args) => ensureLogger().warn(...args),
    info: (...args) => ensureLogger().info(...args),
    debug: (...args) => ensureLogger().debug(...args),
    trace: (...args) => ensureLogger().trace(...args),
    logQuery: (text, durationMs, params) => ensureLogger().logQuery(text, durationMs, params),
    runWithContext: (ctx, fn) => ensureLogger().runWithContext(ctx, fn),
    get traceEnabled() {
        return ensureLogger().traceEnabled;
    },
    get debugEnabled() {
        return ensureLogger().debugEnabled;
    },
};
export default logger;
export function setLogLevel(level) {
    globalThis.__baseFrameworkLogger = new Logger(buildPinoLogger(level));
}
//# sourceMappingURL=logger.js.map