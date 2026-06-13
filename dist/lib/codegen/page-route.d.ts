import type { ServerTeam } from '../auth/sidebar.js';
import { type CodegenPageOptions } from '../../components/codegen-page.js';
export interface CodegenPageRouteOptions extends CodegenPageOptions {
    pagePath?: string;
    loginPagePath?: string;
    brandName?: string;
    serverTeams: ServerTeam[];
    activePath?: string;
    developmentOnly?: boolean;
}
type RouteHandler = (req: Request) => Promise<Response>;
export declare function createCodegenPageRoute(options: CodegenPageRouteOptions): RouteHandler;
export declare function createCodegenPageRoutes(options: CodegenPageRouteOptions, extraPaths?: string[]): Record<string, RouteHandler>;
export {};
//# sourceMappingURL=page-route.d.ts.map