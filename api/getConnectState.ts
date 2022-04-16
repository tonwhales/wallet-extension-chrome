import axios from "axios";

export async function getConnectState(src: string) {
    let ex = (await axios.get('https://connect.tonhubapi.com/connect/' + src)).data;
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
        updated: number
    };
}