import * as React from 'react';
import { Text, View } from 'react-native';
import { useAuthState, writeAuthState } from '../model/AuthState';
import { useBalance } from '../model/useBalance';
import { useDetectLogout } from '../model/useDetectLogout';
import { Avatar } from './components/Avatar';
import { SimpleButton } from './components/SimpleButton';

export const AppFragment = React.memo(() => {
    useDetectLogout();
    const authState = useAuthState();
    let sessionState = authState.state!;
    let wallet = sessionState.reference!;
    const balance = useBalance(wallet.address);
    const onReset = React.useCallback(() => {
        (async () => {
            await writeAuthState(null);
            authState.update(null);
        });
    }, []);

    return (
        <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ flexGrow: 1 }} />
            <View style={{ marginHorizontal: 32 }}>
                <View style={{ alignSelf: 'center', marginBottom: 24 }}>
                    <Avatar id={wallet.address} size={96} />
                </View>
                <Text style={{ color: 'white', fontSize: 16, fontFamily: 'monospace' }}>{wallet.address.slice(0, 24)}</Text>
                <Text style={{ color: 'white', fontSize: 16, fontFamily: 'monospace' }}>{wallet.address.slice(24)}</Text>
                <View style={{ alignSelf: 'center', marginTop: 64 }}>
                    <SimpleButton title="Disconnect" onPress={onReset} />
                </View>
            </View>
            <View style={{ flexGrow: 1 }} />
        </View>
    );
});