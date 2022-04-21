set -e

# Prepare
rm -fr build
mkdir -p build

export NEXT_PUBLIC_TON_NETWORK=testnet
export NEXT_PUBLIC_TON_ENDPOINT=testnet.tonhubapi.com

# Build modules
node ./bundle-modules.js
# tsc --project tsconfig.modules.json
# ./node_modules/.bin/esbuild ./app/modules/worker.ts --bundle --outfile=./build/modules-bundled/worker.js --target=es6
# ./node_modules/.bin/esbuild ./app/modules/inject.ts --bundle --outfile=./build/modules-bundled/inject.js --target=es6
# ./node_modules/.bin/esbuild ./app/modules/browser.ts --bundle --outfile=./build/modules-bundled/browser.js --target=es6

# Build plugin
next build
next export -o build/export/
mv build/export/_next build/export/next
rm build/export/404.html
sed -i '' -e "s/\\/_next/\\.\\/next/g" build/export/index.html

# Pack extension
mkdir -p build/chrome-testnet
rsync -va build/export/ ./build/chrome-testnet
cp app/manifests/chrome-testnet.json build/chrome-testnet/manifest.json
cp build/modules-bundled/inject.js build/chrome-testnet/
cp build/modules-bundled/worker.js build/chrome-testnet/
cp build/modules-bundled/browser.js build/chrome-testnet/