import dotenv from 'dotenv';
import path from 'node:path';
import { createAuthRoutes, createFetchServer, loadConfig, withPublicRoute, withRoleRoute } from '../../src/index.js';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
loadConfig();

const routes = {
  'GET /health': withPublicRoute(async () => Response.json({ status: 'ok' })),
  ...createAuthRoutes({
    loginPage: {
      title: 'UV Core Sample',
      redirectUrl: '/api/profile',
    },
  }),
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
console.info(`Login page: http://localhost:${port}/login`);
