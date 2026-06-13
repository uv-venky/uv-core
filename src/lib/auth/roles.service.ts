import { executeQuery } from '../database/postgres.js';
import { ROLES_TABLE, USER_ROLES_TABLE } from '../common/constants.js';

export async function getUserRoles(userName: string, appId: string): Promise<string[]> {
  const result = await executeQuery<{ role_code: string }>(
    `SELECT r.role_code
     FROM ${USER_ROLES_TABLE} ur, ${ROLES_TABLE} r
     WHERE ur.role_code = r.role_code
       AND ur.user_name = $1
       AND ur.start_date <= now()
       AND (ur.end_date IS NULL OR ur.end_date >= now())
       AND r.start_date <= now()
       AND (r.end_date IS NULL OR r.end_date >= now())
       AND r.app_id IN ($2, 'core')
       AND ur.app_id IN ($2, 'core')`,
    [userName, appId],
  );

  return result.rows.map((row) => row.role_code);
}
