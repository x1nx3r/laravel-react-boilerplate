// Dev-only preview proxy for the Laravel template.
//
// The preview origin must serve both Laravel and Vite through one port. Vite
// owns the reserved /_vite path (HTTP and HMR WebSocket); everything else is
// Laravel. The proxy preserves the incoming Host for Laravel so its URL
// generation and TrustCloudflare middleware see the preview origin.
import crypto from 'node:crypto';
import http from 'node:http';
import httpProxy from 'http-proxy';

const HOST = process.env.PREVIEW_HOST ?? '0.0.0.0';
const PORT = Number(process.env.PREVIEW_PORT ?? 8000);
const APP_PORT = Number(process.env.APP_PORT ?? 8001);
const VITE_PORT = Number(process.env.VITE_PORT ?? 5173);
const VITE_BASE = (process.env.VITE_BASE ?? '/_vite').replace(/\/$/, '');
const TOKEN = process.env.MANUS_PREVIEW_TOKEN ?? '';

const appProxy = httpProxy.createProxyServer({
    target: `http://127.0.0.1:${APP_PORT}`,
    changeOrigin: false,
    // Do not let http-proxy append its own http to X-Forwarded-Proto: the
    // incoming request is HTTP (deusd -> this proxy), but the browser's
    // original request may be HTTPS. The header is set explicitly below.
    xfwd: false,
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
    const proto = (req.headers['x-forwarded-proto'] ?? 'http')
        .split(',')[0]
        .trim();

    if (host) proxyReq.setHeader('X-Forwarded-Host', host);
    proxyReq.setHeader('X-Forwarded-Proto', proto || 'http');
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

function loopback(req) {
    const address = req.socket.remoteAddress ?? '';
    return (
        address === '127.0.0.1' ||
        address === '::1' ||
        address === '::ffff:127.0.0.1'
    );
}

function hasPreviewToken(req) {
    if (!TOKEN || loopback(req)) return true;
    const given = req.headers['x-manus-preview-token'] ?? '';
    if (typeof given !== 'string') return false;
    const want = Buffer.from(TOKEN);
    const got = Buffer.from(given);
    return want.length === got.length && crypto.timingSafeEqual(want, got);
}

function authorize(req, res) {
    if (hasPreviewToken(req)) {
        // The token is for this proxy, never for the app behind it.
        delete req.headers['x-manus-preview-token'];
        return true;
    }
    res.writeHead(401, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Preview token is missing or invalid.\n');
    return false;
}

const server = http.createServer((req, res) => {
    if (!authorize(req, res)) return;
    const proxy = isVitePath(req.url) ? viteProxy : appProxy;

    proxy.web(req, res, {}, (error) => fail(res, error));
});

server.on('upgrade', (req, socket, head) => {
    if (!hasPreviewToken(req)) {
        socket.destroy();
        return;
    }
    delete req.headers['x-manus-preview-token'];
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
