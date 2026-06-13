import dotenv from 'dotenv';
import path from 'node:path';
import {
  createFetchServer,
  loadConfig,
  login,
  logout,
  readJsonBody,
  withAuthRoute,
  withPublicRoute,
  withRoleRoute,
} from '../../src/index.js';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
loadConfig();

const routes = {
  'GET /health': withPublicRoute(async () => Response.json({ status: 'ok' })),

  'POST /api/auth/login': withPublicRoute(async (req) => {
    const body = await readJsonBody<{ email: string; password: string }>(req);
    const result = await login(body);
    return Response.json(result);
  }),

  'POST /api/auth/logout': withAuthRoute(async (req) => {
    const header = req.headers.get('authorization') ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    await logout(token);
    return new Response(null, { status: 204 });
  }),

  'GET /api/profile': withAuthRoute(async (_req, auth) => Response.json({ user: auth.user })),

  'GET /api/admin/dashboard': withRoleRoute(['admin'], async () =>
    Response.json({
      message: 'Welcome to the protected admin dashboard',
      metrics: { activeUsers: 1, pendingTasks: 0 },
    }),
  ),
};

const port = Number(process.env.PORT ?? 3000);
await createFetchServer(routes, port);
console.info(`Sample app listening on http://localhost:${port}`);
