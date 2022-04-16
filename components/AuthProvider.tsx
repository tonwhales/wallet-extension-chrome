import * as React from 'react';

export type WalletReference = {
    address: string,
    endpoint: string,
    appPublicKey: string,
};

const ctx = React.createContext<{
    state: { session: string, wallet: WalletReference | null } | null,
    handler: (state: { session: string, wallet: WalletReference | null } | null) => void
}>(null as any);

export const AuthProvider = (props: { handler: (state: { session: string, wallet: WalletReference | null } | null) => void, state: { session: string, wallet: WalletReference | null } | null, children?: any }) => {
    const value = React.useMemo(() => {
        return { state: props.state, handler: props.handler };
    }, [props.handler, props.state]);
    return (
        <ctx.Provider value={value}>
            {props.children}
        </ctx.Provider>
    )
};

export function useAuth() {
    return React.useContext(ctx);
}