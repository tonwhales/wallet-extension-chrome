set -e

# Prepare
rm -fr build
mkdir -p build

export NEXT_PUBLIC_TON_NETWORK=testnet
export NEXT_PUBLIC_TON_ENDPOINT=testnet.tonhubapi.com

# Build modules
node ./bundle-modules.js

# Build plugin
next build
next export -o build/export/
mv build/export/_next build/export/next
rm build/export/404.html
sed -i '' -e "s/\\/_next/\\.\\/next/g" build/export/index.html

# Pack Chrome
mkdir -p build/chrome-testnet
rsync -va build/export/ ./build/chrome-testnet
cp app/manifests/chrome-testnet.json build/chrome-testnet/manifest.json
cp build/modules-bundled/inject.js build/chrome-testnet/
cp build/modules-bundled/worker.js build/chrome-testnet/
cp build/modules-bundled/browser.js build/chrome-testnet/

# Pack Firefox
mkdir -p build/firefox-testnet
rsync -va build/export/ ./build/firefox-testnet
cp app/manifests/firefox-testnet.json build/firefox-testnet/manifest.json
cp build/modules-bundled/inject.js build/firefox-testnet/
cp build/modules-bundled/worker.js build/firefox-testnet/
cp build/modules-bundled/browser.js build/firefox-testnet/

# Pack Safari
mkdir -p safari-app/safari-extension\ Extension/Resources/
rsync -va build/export/ ./safari-app/safari-extension\ Extension/Resources/
cp app/manifests/safari-testnet.json safari-app/safari-extension\ Extension/Resources/manifest.json
cp build/modules-bundled/inject.js safari-app/safari-extension\ Extension/Resources/
cp build/modules-bundled/worker.js safari-app/safari-extension\ Extension/Resources/
cp build/modules-bundled/browser.js safari-app/safari-extension\ Extension/Resources/
cp assets/dev_128x128_webstore.png safari-app/safari-extension\ Extension/Resources/