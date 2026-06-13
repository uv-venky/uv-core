import { REVOKED_TOKENS_TABLE } from '../common/constants.js';
import { executeQuery } from '../database/postgres.js';
import { UnauthorizedError } from '../common/exceptions.js';
import logger from '../common/logger.js';
import { verifyAccessToken } from './jwt.service.js';

export async function logout(token: string): Promise<void> {
  const payload = verifyAccessToken(token);
  const userName = payload.userName ?? String(payload.sub);

  await executeQuery(
    `INSERT INTO ${REVOKED_TOKENS_TABLE} (jti, user_name, expires_at, revoked_at)
     VALUES ($1, $2, to_timestamp($3), now())
     ON CONFLICT (jti) DO UPDATE SET revoked_at = now()`,
    [payload.jti, userName, payload.exp ?? 0],
  );

  logger.info('User logged out', { userName, email: payload.email });
}

export async function assertTokenNotRevoked(jti: string): Promise<void> {
  const result = await executeQuery<{ revoked_at: Date | null }>(
    `SELECT revoked_at FROM ${REVOKED_TOKENS_TABLE} WHERE jti = $1`,
    [jti],
  );

  const row = result.rows[0];
  if (row?.revoked_at) {
    throw new UnauthorizedError('Token has been revoked');
  }
}

export async function cleanupExpiredRevokedTokens(): Promise<number> {
  const result = await executeQuery(
    `DELETE FROM ${REVOKED_TOKENS_TABLE} WHERE expires_at < now() AND revoked_at IS NOT NULL`,
  );
  return result.rowCount ?? 0;
}
