import { getBearerTokenFromRequest, readJsonBody } from '../common/http.js';
import { withAuthRoute, withPublicRoute } from '../common/routes.js';
import { login } from './login.service.js';
import { logout } from './logout.service.js';
export function createLoginRoute() {
    return withPublicRoute(async (req) => {
        const body = await readJsonBody(req);
        return Response.json(await login(body));
    });
}
export function createLogoutRoute() {
    return withAuthRoute(async (req) => {
        const token = getBearerTokenFromRequest(req);
        if (token) {
            await logout(token);
        }
        return new Response(null, { status: 204 });
    });
}
export function createProfileRoute() {
    return withAuthRoute(async (_req, auth) => Response.json({ user: auth.user }));
}
//# sourceMappingURL=auth.api.routes.js.map