import { getErrorMessage, isUserError } from './exceptions.js';
export function createErrorResponse(error) {
    if (isUserError(error)) {
        return { status: 'ERROR', message: error.message };
    }
    return { status: 'ERROR', message: getErrorMessage(error) };
}
//# sourceMappingURL=error-response.js.map