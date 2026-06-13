import { getErrorMessage, isUserError, type ErrorResponse } from './exceptions.js';

export function createErrorResponse(error: unknown): ErrorResponse {
  if (isUserError(error)) {
    return { status: 'ERROR', message: error.message };
  }
  return { status: 'ERROR', message: getErrorMessage(error) };
}
