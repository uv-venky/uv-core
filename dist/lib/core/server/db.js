import * as pg from '../../database/postgres.js';
export * from '../../database/postgres.js';
export const newClient = async () => {
    const client = await pg.newClient();
    const queryCached = client.query.bind(client);
    return Object.assign(client, { queryCached });
};
//# sourceMappingURL=db.js.map