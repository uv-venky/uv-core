import { getUserTeams, optionalAuthenticateRequest, renderSidebar, withPublicRoute } from '../auth/index.js';
import { renderCodegenContentHtml } from '../../components/codegen-page.js';
function isProductionEnv() {
    return process.env.NODE_ENV === 'production';
}
export function createCodegenPageRoute(options) {
    const pagePath = options.pagePath ?? '/codegen';
    const loginPagePath = options.loginPagePath ?? '/login';
    const activePath = options.activePath ?? pagePath;
    const brandName = options.brandName ?? 'App';
    const { serverTeams, developmentOnly, ...contentOptions } = options;
    const contentHtml = developmentOnly && isProductionEnv()
        ? `<div style="padding:2rem; font-family:'Outfit',sans-serif; font-size:1.5rem; color:var(--text-white);">Code Generator is only available in development mode.</div>`
        : renderCodegenContentHtml(contentOptions);
    return withPublicRoute(async (req) => {
        let auth = null;
        try {
            auth = await optionalAuthenticateRequest(req);
        }
        catch {
            // Stale or invalid token
        }
        if (!auth) {
            return new Response(null, {
                status: 302,
                headers: {
                    Location: `${loginPagePath}?sourceUrl=${encodeURIComponent(pagePath)}`,
                    'Set-Cookie': 'uv_access_token=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
                },
            });
        }
        const teams = await getUserTeams(auth.user, serverTeams);
        const html = renderSidebar({
            activeTeam: teams[0] ?? null,
            teams,
            activePath,
            user: auth.user,
            brandName,
            contentHtml,
        });
        return new Response(html, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
    });
}
export function createCodegenPageRoutes(options, extraPaths = []) {
    const pagePath = options.pagePath ?? '/codegen';
    const handler = createCodegenPageRoute(options);
    const routes = {
        [`GET ${pagePath}`]: handler,
    };
    for (const path of extraPaths) {
        routes[`GET ${path}`] = handler;
    }
    return routes;
}
//# sourceMappingURL=page-route.js.map