set -e

# Prepare
rm -fr build
mkdir -p build

# Build plugin
NEXT_TON_NETWORK=testnet
NEXT_TON_ENDPOINT=testnet.tonhubapi.com
next build
next export -o build/export/
mv build/export/_next build/export/next
rm build/export/404.html
rm build/export/404.html.html
sed -i '' -e "s/\\/_next/\\.\\/next/g" build/export/index.html

# Pack extension
mkdir -p build/chrome-testnet
rsync -va build/export/ ./build/chrome-testnet
cp manifest.json build/chrome-testnet/