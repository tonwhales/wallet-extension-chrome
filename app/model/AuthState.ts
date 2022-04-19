import * as React from "react";
import { readKey, writeKey } from "../utils/extensionStorage";
import { WalletReference } from "./WalletReference";

export type AuthState = {
    seed: string,
    session: string,
    reference: WalletReference | null
};

export const AuthStateContext = React.createContext<{ state: AuthState | null, update: (state: AuthState | null) => void }>({ state: null, update: () => { } });

export function useAuthState() {
    return React.useContext(AuthStateContext);
}

export async function readAuthState() {
    let state = await readKey('connection-state');
    if (state) {
        return JSON.parse(state) as AuthState;
    } else {
        return null;
    }
}

export async function writeAuthState(state: AuthState | null) {
    if (state) {
        await writeKey('connection-state', JSON.stringify(state));
    } else {
        await writeKey('connection-state', null);
    }
}