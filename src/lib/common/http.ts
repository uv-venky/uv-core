export function getBearerTokenFromRequest(req: Request): string | null {
  const header = req.headers.get('authorization');
  if (header) {
    const trimmed = header.trim();
    if (trimmed.toLowerCase().startsWith('bearer ')) {
      const token = trimmed.slice(7).trim();
      if (token.length > 0) return token;
    }
  }

  // Fallback: parse cookie header for uv_access_token
  const cookieHeader = req.headers.get('cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(c => c.trim().split('='));
    const tokenCookie = cookies.find(([name]) => name === 'uv_access_token');
    if (tokenCookie && tokenCookie[1]) {
      return decodeURIComponent(tokenCookie[1]);
    }
  }

  return null;
}

export async function readJsonBody<T>(req: Request): Promise<T> {
  return req.json() as Promise<T>;
}
