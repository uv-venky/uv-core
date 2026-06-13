import { compare, genSaltSync, hashSync } from 'bcrypt-ts';
import jwt from 'jsonwebtoken';
import { getConfig } from '../common/config.js';
import { UnauthorizedError } from '../common/exceptions.js';
import { createTokenId } from '../common/utils.js';
import type { AuthUser, JwtPayload } from './types.js';

const saltRounds = 10;

export async function hashPassword(password: string): Promise<string> {
  const salt = genSaltSync(saltRounds);
  return hashSync(password, salt);
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return compare(password, passwordHash);
}

export function signAccessToken(user: AuthUser, tokenId = createTokenId()): { token: string; jti: string } {
  const { secret, jwtExpiresIn } = getConfig();
  const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
    sub: user.userName,
    userName: user.userName,
    email: user.email,
    displayName: user.displayName,
    roles: user.roles,
    jti: tokenId,
  };

  const token = jwt.sign(payload, secret, {
    expiresIn: jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });

  return { token, jti: tokenId };
}

export function verifyAccessToken(token: string): JwtPayload {
  const { secret } = getConfig();
  try {
    const decoded = jwt.verify(token, secret);
    if (typeof decoded === 'string' || !decoded.sub || !decoded.jti) {
      throw new UnauthorizedError('Invalid token payload');
    }
    return decoded as unknown as JwtPayload;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    throw new UnauthorizedError('Invalid or expired token');
  }
}

export function toAuthUser(
  row: {
    user_name: string;
    user_id: number | null;
    email: string;
    display_name: string;
  },
  roles: string[],
): AuthUser {
  return {
    userName: row.user_name,
    userId: row.user_id,
    email: row.email,
    displayName: row.display_name,
    roles,
  };
}
