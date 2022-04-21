
import { getSecureRandomBytes, keyPairFromSeed } from "ton-crypto";
import axios from 'axios'
import fetchAdapter from '@vespaiach/axios-fetch-adapter';
import { toUrlSafe } from "../utils/toUrlSafe";

export async function createNewSession(testnet: boolean) {

    // Generate new session
    let seed = await getSecureRandomBytes(32);
    let keyPair = keyPairFromSeed(seed);
    let key = toUrlSafe(keyPair.publicKey.toString('base64'));
    let session = await axios.post('https://connect.tonhubapi.com/connect/init', {
        key,
        testnet: testnet,
        name: testnet ? 'Ton Dev Web Wallet' : 'Tonhub Web',
        url: testnet ? 'https://test.web.tonhub.com' : 'https://web.tonhub.com'
    }, { timeout: 5000, adapter: fetchAdapter });
    if (!session.data.ok) {
        throw Error('Unable to create state');
    }

    return { seed: seed.toString('base64'), session: key };
}