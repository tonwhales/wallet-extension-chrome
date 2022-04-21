set -e

# Prepare
rm -fr build
mkdir -p build

# Build plugin
export NEXT_PUBLIC_TON_NETWORK=testnet
export NEXT_PUBLIC_TON_ENDPOINT=testnet.tonhubapi.com
next build
next export -o build/export/
mv build/export/_next build/export/next
rm build/export/404.html
sed -i '' -e "s/\\/_next/\\.\\/next/g" build/export/index.html

# Pack extension
mkdir -p build/chrome-testnet
rsync -va build/export/ ./build/chrome-testnet
cp app/manifests/chrome-testnet.json build/chrome-testnet/manifest.json
cp app/inject.js build/chrome-testnet/
cp app/worker.js build/chrome-testnet/
cp app/browser.js build/chrome-testnet/