import * as React from 'react';
import { useAuthState } from './model/AuthState';
import { ConnectFragment } from './fragments/ConnectFragment';
import { AppFragment } from './fragments/AppFragment';

export const App = React.memo(() => {
    const state = useAuthState();

    // Connect
    if (!state.state || !state.state.reference) {
        return (
            <ConnectFragment />
        );
    }

    // Ready
    return <AppFragment />;
});