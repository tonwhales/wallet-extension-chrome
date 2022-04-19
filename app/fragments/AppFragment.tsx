import * as React from 'react';
import { Text, View } from 'react-native';
import { useAuthState } from '../model/AuthState';
import { useDetectLogout } from '../model/useDetectLogout';

export const AppFragment = React.memo(() => {
    useDetectLogout();
    const authState = useAuthState();
    let sessionState = authState.state!;
    let wallet = sessionState.reference!;

    return (
        <View style={{ flexGrow: 1, alignItems: 'stretch', justifyContent: 'center' }}>
            <View style={{ marginHorizontal: 32 }}>
                <Text style={{ color: 'white', fontSize: 16 }}>{wallet.address.slice(0, 24)}</Text>
                <Text style={{ color: 'white', fontSize: 16 }}>{wallet.address.slice(24)}</Text>
            </View>
        </View>
    );
});