export declare function getErrorMessage(error: unknown): string;
export declare class FrameworkError extends Error {
    constructor(message: string);
}
export declare class UserError extends FrameworkError {
    readonly statusCode: number;
    constructor(message: string, statusCode?: number);
}
export declare class UnauthorizedError extends UserError {
    constructor(message?: string);
}
export declare class ForbiddenError extends UserError {
    constructor(message?: string);
}
export declare class NotFoundError extends UserError {
    constructor(message?: string);
}
export declare function isUserError(error: unknown): error is UserError;
export interface ErrorResponse {
    status: 'ERROR';
    message: string;
}
export declare function toErrorResponse(error: unknown): ErrorResponse;
//# sourceMappingURL=exceptions.d.ts.map