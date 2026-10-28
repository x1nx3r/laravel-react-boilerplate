import fs from 'node:fs';
import path from 'node:path';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

const previewBase = '/_vite/';

export default defineConfig(({ command }) => ({
    // Dev assets and HMR live behind the preview proxy's reserved path.
    // Production builds keep the normal root-relative asset layout.
    base: command === 'serve' ? previewBase : '/',
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        {
            // Laravel's plugin writes an absolute dev-server URL. A relative
            // hot file is what lets the same page work at localhost and at a
            // preview origin.
            name: 'manus-preview-hot-file',
            configureServer(server) {
                server.httpServer?.once('listening', () => {
                    const hotFile = path.resolve(
                        server.config.root,
                        'public/hot',
                    );
                    // Laravel's plugin writes an absolute URL from its own
                    // listening handler. Defer ours until after every handler
                    // has run, so the relative value wins.
                    setTimeout(() => {
                        fs.writeFileSync(
                            hotFile,
                            previewBase.replace(/\/$/, ''),
                        );
                    }, 0);
                });
            },
        },
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
    server: {
        // The preview proxy and the agent browser both run in this
        // container; loopback is enough.
        host: '127.0.0.1',
        // Keep CSS asset URLs relative so they resolve against the browser's
        // origin instead of the container's Vite origin.
        origin: '',
        port: 5173,
        strictPort: true,
        allowedHosts: ['.agent.tcl-it.tech', 'localhost', '127.0.0.1'],
    },
    esbuild: {
        jsx: 'automatic',
    },
}));
