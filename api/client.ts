import { TonClient } from 'ton';

export const IS_TESTNET = process.env.NEXT_PUBLIC_IS_TESTNET === 'true';
export const CLIENT_ENDPOINT = 'https://' + (process.env.NEXT_PUBLIC_ENDPOINT ? process.env.NEXT_PUBLIC_ENDPOINT : (IS_TESTNET ? 'testnet.tonhubapi.com' : 'mainnet.tonhubapi.com'));
export const tonClient = new TonClient({ endpoint: `${CLIENT_ENDPOINT}/jsonRPC` });