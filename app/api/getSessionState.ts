import axios from "axios";
import fetchAdapter from '@vespaiach/axios-fetch-adapter';

export async function getSessionState(src: string) {
    let ex = (await axios.get('https://connect.tonhubapi.com/connect/' + src, { adapter: fetchAdapter, timeout: 5000 })).data;
    return ex as {
        state: 'not_found'
    } | {
        state: 'initing' | 'ready',
        wallet: {
            address: string,
            endpoint: string,
            walletConfig: string,
            walletType: string,
            walletSig: string,
            appPublicKey: string
        } | null,
        name: string,
        url: string,
        testnet: boolean,
        created: number,
        updated: number,
        revoked: boolean
    };
}