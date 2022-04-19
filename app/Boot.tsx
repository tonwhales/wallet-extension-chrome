import * as React from 'react';
import { ActivityIndicator } from '../components/ActivityIndicator';
import { AuthState, AuthStateContext } from './model/AuthState';
import { readKey } from './utils/extensionStorage';
import { backoff } from './utils/time';
import { App } from './App';

export const Boot = React.memo((props: { children?: any }) => {

    // State
    const [authState, setAuthState] = React.useState<undefined | null | AuthState>(undefined);
    React.useEffect(() => {
        backoff(async () => {
            let state = await readKey('connection-state');
            if (state) {
                setAuthState(JSON.parse(state) as AuthState);
            } else {
                setAuthState(null);
            }
        });
    }, []);
    const stateCache = React.useMemo<{ update: (state: AuthState | null) => void, state: AuthState | null }>(() => {
        return {
            update: (e: AuthState | null) => setAuthState(e),
            state: authState!
        }
    }, [authState]);

    // Render
    return (
        <>
            {authState && (
                <ActivityIndicator />
            )}
            {!authState && (
                <AuthStateContext.Provider value={stateCache}>
                    <App />
                </AuthStateContext.Provider>
            )}
        </>
    );
});