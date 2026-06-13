import { createServer } from 'node:http';
async function readBody(req) {
    if (req.method === 'GET' || req.method === 'HEAD') {
        return undefined;
    }
    const chunks = [];
    for await (const chunk of req) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
}
async function toFetchRequest(req) {
    const host = req.headers.host ?? 'localhost';
    const url = `http://${host}${req.url ?? '/'}`;
    const body = await readBody(req);
    return new Request(url, {
        method: req.method,
        headers: req.headers,
        body: body && body.length > 0 ? new Uint8Array(body) : undefined,
    });
}
async function writeFetchResponse(res, response) {
    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
        res.setHeader(key, value);
    });
    const buffer = Buffer.from(await response.arrayBuffer());
    res.end(buffer);
}
export function createFetchServer(routes, port = 3000) {
    const normalizedRoutes = new Map(Object.entries(routes).map(([key, handler]) => {
        const [method, path] = key.split(' ');
        return [`${method.toUpperCase()} ${path}`, handler];
    }));
    return createServer(async (incoming, outgoing) => {
        try {
            const request = await toFetchRequest(incoming);
            const routeKey = `${request.method} ${new URL(request.url).pathname}`;
            const handler = normalizedRoutes.get(routeKey);
            if (!handler) {
                outgoing.statusCode = 404;
                outgoing.end(JSON.stringify({ status: 'ERROR', message: 'Not found' }));
                return;
            }
            const response = await handler(request);
            await writeFetchResponse(outgoing, response);
        }
        catch (error) {
            outgoing.statusCode = 500;
            outgoing.end(JSON.stringify({ status: 'ERROR', message: 'Internal server error' }));
            console.error(error);
        }
    }).listen(port);
}
//# sourceMappingURL=fetch-server.js.map