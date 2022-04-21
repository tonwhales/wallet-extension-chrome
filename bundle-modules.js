const GlobalsPolyfills = require('@esbuild-plugins/node-globals-polyfill').default;
const esbuild = require('esbuild');

// Worker
esbuild.build({
    entryPoints: ['./app/extension/worker.ts'],
    bundle: true,
    outfile: './build/modules-bundled/worker.js',
    target: 'es6',
    define: {
        global: 'self',
        window: 'self',
        process: JSON.stringify({
            env: {
                NEXT_PUBLIC_TON_NETWORK: process.env.NEXT_PUBLIC_TON_NETWORK,
                NEXT_PUBLIC_TON_ENDPOINT: process.env.NEXT_PUBLIC_TON_ENDPOINT,
            }
        })
    },
    plugins: [
        GlobalsPolyfills({
            buffer: true,
            process: false
        }),
    ],
});

// Browser
esbuild.build({
    entryPoints: ['./app/extension/browser.ts'],
    bundle: true,
    outfile: './build/modules-bundled/browser.js',
    target: 'es6',
    define: {
        global: 'self',
        window: 'self',
        process: JSON.stringify({
            env: {
                NEXT_PUBLIC_TON_NETWORK: process.env.NEXT_PUBLIC_TON_NETWORK,
                NEXT_PUBLIC_TON_ENDPOINT: process.env.NEXT_PUBLIC_TON_ENDPOINT,
            }
        })
    },
    plugins: [
        GlobalsPolyfills({
            buffer: true,
            process: false
        }),
    ],
});

// Browser
esbuild.build({
    entryPoints: ['./app/extension/inject.ts'],
    bundle: true,
    outfile: './build/modules-bundled/inject.js',
    target: 'es6',
    define: {
        global: 'self',
        window: 'self',
        process: JSON.stringify({
            env: {
                NEXT_PUBLIC_TON_NETWORK: process.env.NEXT_PUBLIC_TON_NETWORK,
                NEXT_PUBLIC_TON_ENDPOINT: process.env.NEXT_PUBLIC_TON_ENDPOINT,
            }
        })
    },
    plugins: [
        GlobalsPolyfills({
            buffer: true,
            process: false
        }),
    ],
});