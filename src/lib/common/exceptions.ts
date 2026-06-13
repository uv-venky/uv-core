export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return String(error);
}

export class FrameworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FrameworkError';
  }
}

export class UserError extends FrameworkError {
  readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
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

export function isUserError(error: unknown): error is UserError {
  return error instanceof UserError;
}

export interface ErrorResponse {
  status: 'ERROR';
  message: string;
}

export function isErrorResponse(value: unknown): value is ErrorResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'status' in value &&
    (value as any).status === 'ERROR' &&
    'message' in value &&
    typeof (value as any).message === 'string'
  );
}

export function toErrorResponse(error: unknown): ErrorResponse {
  if (isUserError(error)) {
    return { status: 'ERROR', message: error.message };
  }
  return { status: 'ERROR', message: getErrorMessage(error) };
}

const ABORT_ERROR = 'AbortError';

export class AbortError extends Error {
  constructor() {
    super(ABORT_ERROR);
    this.name = ABORT_ERROR;
  }
}

export function isAbortedRequestError(error: unknown): boolean {
  if (error instanceof Error) {
    if ('code' in error && error.code === 'ECONNRESET') {
      return true;
    }
    if (error.message === 'aborted' || error.name === 'AbortError') {
      return true;
    }
  }
  return false;
}

