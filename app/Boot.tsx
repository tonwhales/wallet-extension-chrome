import * as React from 'react';
import { ActivityIndicator } from '../components/ActivityIndicator';
import { AuthState, AuthStateContext, readAuthState } from './model/AuthState';
import { backoff } from './utils/time';
import { App } from './App';
import { View } from 'react-native';

export const Boot = React.memo((props: { children?: any }) => {

    // State
    const [authState, setAuthState] = React.useState<undefined | null | AuthState>(undefined);
    React.useEffect(() => {
        backoff(async () => {
            console.log('Loading auth state');
            let state = await readAuthState();
            console.log('Loading auth state: ' + !!state);
            setAuthState(state);
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
        <View style={{ width: 350, height: 566 /* Golden Ratio */, backgroundColor: '#222225', alignItems: 'stretch', flexDirection: 'column' }}>
            {/* {!authState && (
                <ActivityIndicator />
            )} */}
            {(authState !== undefined) && (
                <AuthStateContext.Provider value={stateCache}>
                    <App />
                </AuthStateContext.Provider>
            )}
        </View>
    );
});