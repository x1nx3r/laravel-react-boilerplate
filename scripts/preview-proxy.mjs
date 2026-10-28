// Dev-only preview proxy for the Laravel template.
//
// The preview origin must serve both Laravel and Vite through one port. Vite
// owns the reserved /_vite path (HTTP and HMR WebSocket); everything else is
// Laravel. The proxy preserves the incoming Host for Laravel so its URL
// generation and TrustCloudflare middleware see the preview origin.
import http from 'node:http';
import httpProxy from 'http-proxy';

const HOST = process.env.PREVIEW_HOST ?? '127.0.0.1';
const PORT = Number(process.env.PREVIEW_PORT ?? 8000);
const APP_PORT = Number(process.env.APP_PORT ?? 8001);
const VITE_PORT = Number(process.env.VITE_PORT ?? 5173);
const VITE_BASE = (process.env.VITE_BASE ?? '/_vite').replace(/\/$/, '');

const appProxy = httpProxy.createProxyServer({
    target: `http://127.0.0.1:${APP_PORT}`,
    changeOrigin: false,
    xfwd: true,
    ws: true,
});

const viteProxy = httpProxy.createProxyServer({
    target: `http://127.0.0.1:${VITE_PORT}`,
    changeOrigin: true,
    xfwd: true,
    ws: true,
});

appProxy.on('proxyReq', (proxyReq, req) => {
    const host = req.headers['x-forwarded-host'] ?? req.headers.host;
    const proto = req.headers['x-forwarded-proto'] ?? 'http';

    if (host) proxyReq.setHeader('X-Forwarded-Host', host);
    proxyReq.setHeader('X-Forwarded-Proto', proto);
});

function fail(res, error) {
    if (res.headersSent) {
        res.destroy(error);
        return;
    }

    res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(
        `Preview upstream is not available (${error?.code ?? 'proxy error'}).\n`,
    );
}

function isVitePath(url) {
    const path = new URL(url ?? '/', 'http://preview.local').pathname;
    return path === VITE_BASE || path.startsWith(`${VITE_BASE}/`);
}

const server = http.createServer((req, res) => {
    const proxy = isVitePath(req.url) ? viteProxy : appProxy;

    proxy.web(req, res, {}, (error) => fail(res, error));
});

server.on('upgrade', (req, socket, head) => {
    const proxy = isVitePath(req.url) ? viteProxy : appProxy;

    proxy.ws(req, socket, head, (error) => {
        socket.destroy(error);
    });
});

for (const proxy of [appProxy, viteProxy]) {
    proxy.on('error', (error) => {
        console.error(`preview proxy: ${error.message}`);
    });
}

server.listen(PORT, HOST, () => {
    console.log(
        `preview proxy on http://${HOST}:${PORT} ` +
            `(app :${APP_PORT}, vite :${VITE_PORT}, base ${VITE_BASE})`,
    );
});

function close() {
    server.close(() => process.exit(0));
}

process.on('SIGINT', close);
process.on('SIGTERM', close);
