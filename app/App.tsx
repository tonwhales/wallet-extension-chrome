import * as React from 'react';
import { ConnectFragment } from './fragments/ConnectFragment';
import { AppFragment } from './fragments/AppFragment';
import { useExtensionState } from './ExtensionStateContext';
import { ActivityIndicator } from './fragments/components/ActivityIndicator';

export const App = React.memo(() => {
    const state = useExtensionState();

    // When Initing
    if (state.type === 'initing') {
        return <ActivityIndicator />;
    }

    // Connect
    if (state.type === 'pending') {
        return (
            <ConnectFragment />
        );
    }

    // Ready
    return <AppFragment />;
});