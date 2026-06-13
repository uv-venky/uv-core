import { readJsonBody } from '../common/http.js';
import { withAuthRoute } from '../common/routes.js';
import { transaction } from '../database/postgres.js';
import { getDataSource } from './registry.js';
import { queryDataSource } from './queryDataSource.js';
import { postDataSource } from './postDataSource.js';

export function createDataSourceRoute() {
  return withAuthRoute(async (req, auth) => {
    const body = await readJsonBody<any>(req);
    if (!body || typeof body !== 'object') {
      return Response.json({ status: 'ERROR', message: 'Invalid request payload' }, { status: 400 });
    }

    const { ds: dsId, query, rows } = body;
    if (!dsId || typeof dsId !== 'string') {
      return Response.json({ status: 'ERROR', message: 'DataSource ID ("ds") is required' }, { status: 400 });
    }

    const ds = getDataSource(dsId);

    if (query !== undefined) {
      const result = await transaction(async (client) => {
        return queryDataSource(client, auth, ds, query);
      });
      return Response.json(result);
    } else if (rows !== undefined) {
      const result = await transaction(async (client) => {
        return postDataSource(client, auth, ds, rows);
      });
      return Response.json(result);
    } else {
      return Response.json({ status: 'ERROR', message: 'Either "query" or "rows" must be provided' }, { status: 400 });
    }
  });
}
