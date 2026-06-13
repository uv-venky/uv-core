export function getErrorMessage(error) {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return String(error);
}
export class FrameworkError extends Error {
    constructor(message) {
        super(message);
        this.name = 'FrameworkError';
    }
}
export class UserError extends FrameworkError {
    statusCode;
    constructor(message, statusCode = 400) {
        super(message);
        this.name = 'UserError';
        this.statusCode = statusCode;
    }
}
export class UnauthorizedError extends UserError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
        this.name = 'UnauthorizedError';
    }
}
export class ForbiddenError extends UserError {
    constructor(message = 'Forbidden') {
        super(message, 403);
        this.name = 'ForbiddenError';
    }
}
export class NotFoundError extends UserError {
    constructor(message = 'Not found') {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}
export function isUserError(error) {
    return error instanceof UserError;
}
export function toErrorResponse(error) {
    if (isUserError(error)) {
        return { status: 'ERROR', message: error.message };
    }
    return { status: 'ERROR', message: getErrorMessage(error) };
}
//# sourceMappingURL=exceptions.js.map