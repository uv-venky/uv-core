export {
  assertRole,
  authenticateRequest,
  hasRole,
  optionalAuthenticateRequest,
} from './auth.middleware.js';
export {
  createAuthRoutes,
  createLoginPageRoute,
  createLoginRoute,
  createLogoutRoute,
  createProfileRoute,
  createResetPasswordPageRoute,
  createNewPasswordPageRoute,
} from './auth.routes.js';
export type { AuthRoutesOptions } from './auth.routes.js';
export { renderLoginPage } from '../../components/login-page.js';
export type { LoginPageOptions } from '../../components/login-page.js';
export { renderResetPasswordPage } from '../../components/reset-password-page.js';
export type { ResetPasswordPageOptions } from '../../components/reset-password-page.js';
export { renderNewPasswordPage } from '../../components/new-password-page.js';
export type { NewPasswordPageOptions } from '../../components/new-password-page.js';
export { login, getAuthUserByName, getUserByName } from './login.service.js';
export { getUserRoles } from './roles.service.js';
export { assertTokenNotRevoked, cleanupExpiredRevokedTokens, logout } from './logout.service.js';
export { hashPassword, signAccessToken, toAuthUser, verifyAccessToken, verifyPassword } from './jwt.service.js';
export { withAuthRoute, withPublicRoute, withRoleRoute } from '../common/routes.js';
export type { AuthenticatedRequest } from './auth.middleware.js';
export type { AuthUser, DbUserRow, JwtPayload, LoginInput, LoginResult } from './types.js';
