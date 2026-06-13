import { z } from 'zod';
import { USERS_TABLE } from '../common/constants.js';
import { isUserActiveSync } from '../common/user-utils.js';
import { executeQuery } from '../database/postgres.js';
import { UnauthorizedError } from '../common/exceptions.js';
import { normalizeEmail } from '../common/utils.js';
import { getConfig } from '../common/config.js';
import logger from '../common/logger.js';
import { signAccessToken, toAuthUser, verifyPassword } from './jwt.service.js';
import { getUserRoles } from './roles.service.js';
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(5),
});
const userSelect = `user_name, user_id, email, display_name, password_hash, start_date, end_date, locked`;
async function findUserByEmail(email) {
    const result = await executeQuery(`SELECT ${userSelect}
     FROM ${USERS_TABLE}
     WHERE email = $1`, [email]);
    return result.rows[0] ?? null;
}
export async function getUserByName(userName) {
    const result = await executeQuery(`SELECT ${userSelect}
     FROM ${USERS_TABLE}
     WHERE user_name = $1`, [userName]);
    return result.rows[0] ?? null;
}
export async function getAuthUserByName(userName) {
    const user = await getUserByName(userName);
    if (!user || !isUserActiveSync(user)) {
        return null;
    }
    const { appId } = getConfig();
    const roles = await getUserRoles(user.user_name, appId);
    return toAuthUser(user, roles);
}
export async function login(input) {
    const parsed = loginSchema.safeParse(input);
    if (!parsed.success) {
        throw new UnauthorizedError('Invalid credentials');
    }
    const email = normalizeEmail(parsed.data.email);
    const password = parsed.data.password.trim();
    const user = await findUserByEmail(email);
    if (!user || !isUserActiveSync(user)) {
        throw new UnauthorizedError('Invalid credentials');
    }
    const validPassword = await verifyPassword(password, user.password_hash);
    if (!validPassword) {
        throw new UnauthorizedError('Invalid credentials');
    }
    const { appId, jwtExpiresIn } = getConfig();
    const roles = await getUserRoles(user.user_name, appId);
    const authUser = toAuthUser(user, roles);
    const { token } = signAccessToken(authUser);
    await executeQuery(`UPDATE ${USERS_TABLE} SET updated_at = now(), last_login = now() WHERE user_name = $1`, [
        authUser.userName,
    ]);
    logger.info('User logged in', { userName: authUser.userName, email: authUser.email });
    return {
        accessToken: token,
        tokenType: 'Bearer',
        expiresIn: jwtExpiresIn,
        user: authUser,
    };
}
//# sourceMappingURL=login.service.js.map