import * as React from 'react';
import { useAuthState } from './model/AuthState';

export const App = React.memo(() => {
    const state = useAuthState();

    // Connect
    if (!state.state) {
        return null;
    }

    // Ready
    return null;
});