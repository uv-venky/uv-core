import { randomUUID } from 'node:crypto';
export function normalizeEmail(email) {
    return email.trim().toLowerCase();
}
export function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
}
export function createTokenId() {
    return randomUUID().replace(/-/g, '');
}
export function parseBearerToken(headerValue) {
    if (!headerValue) {
        return null;
    }
    const trimmed = headerValue.trim();
    if (!trimmed.toLowerCase().startsWith('bearer ')) {
        return null;
    }
    const token = trimmed.slice(7).trim();
    return token.length > 0 ? token : null;
}
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export function isEnvTruthy(value) {
    if (value === undefined) {
        return false;
    }
    const normalized = value.trim().toLowerCase();
    return normalized === '1' || normalized === 'true' || normalized === 'yes';
}
export function escapeHtml(value) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}
//# sourceMappingURL=utils.js.map