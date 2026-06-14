import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
export function getErrorMessage(error) {
    if (error === null || error === undefined) {
        return 'Unknown error';
    }
    if (error instanceof Error) {
        if (error.cause && error.cause instanceof Error) {
            return `${error.message}: ${error.cause.message}`;
        }
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    if (typeof error === 'object') {
        const obj = error;
        if (typeof obj.message === 'string' && obj.message) {
            return obj.message;
        }
        if (typeof obj.error === 'string' && obj.error) {
            return obj.error;
        }
        try {
            const stringified = JSON.stringify(error, null, 0);
            if (stringified && stringified !== '{}' && stringified.length < 500) {
                return stringified;
            }
        }
        catch { }
    }
    return 'Unknown error';
}
export async function getErrorMessageAsync(error) {
    if (error instanceof Promise) {
        try {
            return getErrorMessage(await error);
        }
        catch (rejected) {
            return getErrorMessage(rejected);
        }
    }
    return getErrorMessage(error);
}
//# sourceMappingURL=utils.js.map