import { readKey, writeKey } from "../utils/extensionStorage";

export type InternalState = {
    seed: string,
    session: string,
    wallet: {
        address: string,
        endpoint: string,
        appPublicKey: string,
        walletConfig: string,
        walletType: string,
        walletSig: string
    } | null;
};

export async function readInternalState() {
    let state = await readKey('internal-state');
    if (state) {
        return JSON.parse(state) as InternalState;
    } else {
        return null;
    }
}

export async function writeInternalState(state: InternalState | null) {
    if (state) {
        await writeKey('internal-state', JSON.stringify(state));
    } else {
        await writeKey('internal-state', null);
    }
}