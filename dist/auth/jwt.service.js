import { compare, genSaltSync, hashSync } from 'bcrypt-ts';
import jwt from 'jsonwebtoken';
import { getConfig } from '../common/config.js';
import { UnauthorizedError } from '../common/exceptions.js';
import { createTokenId } from '../common/utils.js';
const saltRounds = 10;
export async function hashPassword(password) {
    const salt = genSaltSync(saltRounds);
    return hashSync(password, salt);
}
export async function verifyPassword(password, passwordHash) {
    return compare(password, passwordHash);
}
export function signAccessToken(user, tokenId = createTokenId()) {
    const { secret, jwtExpiresIn } = getConfig();
    const payload = {
        sub: user.userName,
        userName: user.userName,
        email: user.email,
        displayName: user.displayName,
        roles: user.roles,
        jti: tokenId,
    };
    const token = jwt.sign(payload, secret, {
        expiresIn: jwtExpiresIn,
    });
    return { token, jti: tokenId };
}
export function verifyAccessToken(token) {
    const { secret } = getConfig();
    try {
        const decoded = jwt.verify(token, secret);
        if (typeof decoded === 'string' || !decoded.sub || !decoded.jti) {
            throw new UnauthorizedError('Invalid token payload');
        }
        return decoded;
    }
    catch (error) {
        if (error instanceof UnauthorizedError) {
            throw error;
        }
        throw new UnauthorizedError('Invalid or expired token');
    }
}
export function toAuthUser(row, roles) {
    return {
        userName: row.user_name,
        userId: row.user_id,
        email: row.email,
        displayName: row.display_name,
        roles,
    };
}
//# sourceMappingURL=jwt.service.js.map