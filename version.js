const fs = require('fs');

// Read version
const version = JSON.parse(fs.readFileSync(__dirname + '/package.json', 'utf-8')).version;

// Patch version
let mainfests = [
    '/app/manifests/chrome-testnet.json',
    '/app/manifests/chrome-mainnet.json'
];
for (let m of mainfests) {
    let body = JSON.parse(fs.readFileSync(__dirname + m));
    body.version = version;
    fs.writeFileSync(__dirname + m, JSON.stringify(body, null, 4));
}