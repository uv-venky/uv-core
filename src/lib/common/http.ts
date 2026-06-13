export function getBearerTokenFromRequest(req: Request): string | null {
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

export async function readJsonBody<T>(req: Request): Promise<T> {
  return req.json() as Promise<T>;
}
