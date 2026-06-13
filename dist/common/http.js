export function getBearerTokenFromRequest(req) {
    const header = req.headers.get('authorization');
    if (!header) {
        return null;
    }
    const trimmed = header.trim();
    if (!trimmed.toLowerCase().startsWith('bearer ')) {
        return null;
    }
    const token = trimmed.slice(7).trim();
    return token.length > 0 ? token : null;
}
export async function readJsonBody(req) {
    return req.json();
}
//# sourceMappingURL=http.js.map