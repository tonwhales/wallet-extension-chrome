import * as React from "react";
import { WalletReference } from "./WalletReference";

export type AuthState = {
    session: string,
    reference: WalletReference | null
};

export const AuthStateContext = React.createContext<{ state: AuthState | null, update: (state: AuthState | null) => void }>({ state: null, update: () => { } });

export function useAuthState() {
    return React.useContext(AuthStateContext);
}