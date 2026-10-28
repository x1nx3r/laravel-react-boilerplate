# ADR-0013: Preview uses an app-side dev proxy for Vite HMR

Status: proposed · Date: 2026-10-29
Builds on: ADR-0002 (Laravel + Inertia + React baseline)
Relates: `resources/docs/architecture.md`, `vite.config.ts`, `composer.json`,
manus-dei ADR-025 (hosted preview)

## Context

A session has one app dev server. The agent uses it from inside the container;
a human opens the same app at a hosted preview origin.

The Laravel app actually runs two dev servers:

- Laravel on PHP, which renders pages and handles application routes
- Vite, which serves JavaScript, CSS, React Refresh, and HMR

Laravel's `@vite` directive reads `public/hot`. By default Vite writes an
absolute URL there, such as:

```text
http://localhost:5173
```

That only works for a browser that can reach the container's localhost. A
human preview at `https://p-<uuid>.<base>` cannot. Hardcoding the preview host
is also wrong because the agent still uses localhost, and the preview host is
different for every session.

The preview must therefore be **origin-agnostic**: the same HTML and the same
HMR client must work at both:

```text
http://localhost:8000
https://p-<uuid>.<base>
```

## Decision

### 1. The preview port is the dev proxy

The template exposes one preview port, `8000`, from a small app-side proxy.
It is not the PHP server and not Vite.

```text
preview.port = 8000

preview proxy :8000
  /_vite/*    -> Vite     127.0.0.1:5173   HTTP + WebSocket
  everything  -> Laravel  127.0.0.1:8001   HTTP
```

The proxy is development-only. Production serves built assets through PHP.

The proxy binds `0.0.0.0` inside the container so Docker can publish it on
the host's loopback for deusd. It is not published to the LAN. Loopback
callers (the agent's own browser) are trusted; every other caller must send
`X-Manus-Preview-Token` with the per-session preview token. The proxy strips
that header before forwarding.

The proxy must:

- forward HTTP and WebSocket upgrades
- preserve `Host` and `X-Forwarded-*` for Laravel
- keep the preview host visible to the app
- fail with a clear 502 when either side is down

### 2. Vite owns a reserved path

Vite uses a path base:

```ts
base: '/_vite/';
```

All Vite-owned URLs are then under one prefix:

```text
/_vite/@vite/client
/_vite/@react-refresh
/_vite/resources/js/app.tsx
/_vite/node_modules/...
```

The prefix is reserved by the template. Laravel routes must not use
`/_vite`.

### 3. The hot file is relative

`public/hot` contains:

```text
/_vite
```

not an absolute dev-server URL.

Laravel's `@vite` therefore emits:

```html
<script src="/_vite/@vite/client"></script>
<script src="/_vite/resources/js/app.tsx"></script>
```

The browser resolves those against the current origin. The same HTML works at
localhost and at `p-<uuid>`.

The HMR client also derives its host and port from the current origin because
`server.hmr.host` and `server.hmr.clientPort` are not set. It connects to:

```text
ws://localhost:8000/_vite/
wss://p-<uuid>.<base>/_vite/
```

Both are the same proxy path.

### 4. Vite configuration

The template uses:

```ts
server: {
  host: '127.0.0.1',
  port: 5173,
  strictPort: true,
  allowedHosts: ['.agent.tcl-it.tech', 'localhost', '127.0.0.1'],
},
base: '/_vite/',
```

`allowedHosts` covers the preview host. It does not replace auth; it only
stops Vite's host check from rejecting a proxied request.

A small Vite plugin overwrites `public/hot` with `/_vite` after the server
starts. The Laravel plugin still removes the hot file when the dev server
stops.

### 5. APP_URL

Keep the Laravel app URL on the proxy port:

```dotenv
APP_URL=http://localhost:8000
```

Web requests still generate correct URLs because Laravel uses the request host
and `TrustCloudflare` trusts `X-Forwarded-Host` and `X-Forwarded-Proto`. The
preview request sees `p-<uuid>` and generates preview URLs.

`APP_URL` remains the console/queue/mail fallback. It is not the preview
origin, and preview links must not rely on URLs generated outside a web
request.

### 6. Dev command

`make dev` and `composer dev` start:

```text
php artisan serve --port=8001
vite --port=5173
node scripts/preview-proxy.mjs   # port 8000
php artisan queue:listen
```

The agent uses `http://localhost:8000`; the human uses the preview origin.
Both hit the same proxy, the same Laravel app, and the same Vite server.

## Alternatives

**Use an absolute hot file.** Rejected. It can name either localhost or the
preview host, not both.

**Set `server.hmr.clientPort=443`.** Rejected. It fixes the public preview and
breaks HMR for the agent's localhost browser.

**Use Vite as the front door and proxy Laravel through it.** Rejected for
v1. It changes the app URL to `localhost:5173`, puts Laravel routes and Vite
assets in one routing table, and makes a catch-all proxy responsible for
Inertia and app routes. The `/_vite` prefix is a smaller contract.

**Build assets before preview.** Rejected as the default. It removes HMR,
which is the point of a live preview. It remains a fallback for a preview
that only needs refresh-on-build.

**Put the proxy in deusd or the session server.** Rejected. Vite is a
template concern. The platform should route one preview port, not understand
`/_vite`, React Refresh, or HMR.

## Consequences

- HMR works on both the agent browser and the hosted preview.
- The preview port stays stable at `8000`.
- Laravel keeps rendering the app; Vite is not the front door.
- The template gains one dev-only proxy process and a reserved `/_vite`
  prefix.
- The hot file must be relative; an absolute hot file silently breaks one of
  the two origins.
- The proxy must handle WebSocket upgrades; an HTTP-only proxy gives a page
  that loads and then loses HMR.
- The preview is still the agent's dev server. Stopping it stops the preview,
  without failing the session.

## Open questions

1. Use a small Node `http-proxy` process or a template-owned Caddy/nginx
   process for the dev proxy?
2. Should the proxy port remain `8000`, with PHP moved to `8001`, or should
   PHP stay on `8000` and the proxy take another port?
3. Does the agent's browser always use the proxy, or may it talk directly to
   Vite for HMR debugging?
4. Should the proxy start from `composer dev`, `make dev`, or the template
   start hook?
5. Do we need a production preview mode that serves built assets without the
   dev proxy?
