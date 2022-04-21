const testnet = process.env.NEXT_PUBLIC_TON_NETWORK === 'testnet';

export const Config = {
    testnet,
    endpoint: 'https://' + (process.env.NEXT_PUBLIC_TON_ENDPOINT ? process.env.NEXT_PUBLIC_TON_ENDPOINT : (testnet ? 'testnet.tonhubapi.com' : 'mainnet.tonhubapi.com'))
};