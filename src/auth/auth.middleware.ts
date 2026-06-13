import { ForbiddenError, UnauthorizedError } from '../common/exceptions.js';
import { getBearerTokenFromRequest } from '../common/http.js';
import { getAuthUserByName } from './login.service.js';
import { assertTokenNotRevoked } from './logout.service.js';
import { verifyAccessToken } from './jwt.service.js';
import type { AuthUser } from './types.js';

export interface AuthenticatedRequest {
  user: AuthUser;
  tokenId: string;
}

export async function authenticateRequest(req: Request): Promise<AuthenticatedRequest> {
  const token = getBearerTokenFromRequest(req);
  if (!token) {
    throw new UnauthorizedError('Missing bearer token');
  }

  const payload = verifyAccessToken(token);
  await assertTokenNotRevoked(payload.jti);

  const authUser = await getAuthUserByName(payload.userName ?? String(payload.sub));
  if (!authUser) {
    throw new UnauthorizedError('User is inactive or not found');
  }

  return {
    user: authUser,
    tokenId: payload.jti,
  };
}

export async function optionalAuthenticateRequest(req: Request): Promise<AuthenticatedRequest | null> {
  const token = getBearerTokenFromRequest(req);
  if (!token) {
    return null;
  }
  return authenticateRequest(req);
}

export function hasRole(user: AuthUser, ...allowedRoles: string[]): boolean {
  return user.roles.some((role) => allowedRoles.includes(role));
}

export function assertRole(user: AuthUser, ...allowedRoles: string[]): void {
  if (!hasRole(user, ...allowedRoles)) {
    throw new ForbiddenError('Insufficient permissions');
  }
}
