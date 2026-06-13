import type { IncomingMessage, ServerResponse } from 'node:http';
type RouteHandler = (req: Request) => Promise<Response>;
export declare function createFetchServer(routes: Record<string, RouteHandler>, port?: number): import("node:http").Server<typeof IncomingMessage, typeof ServerResponse>;
export {};
//# sourceMappingURL=fetch-server.d.ts.map