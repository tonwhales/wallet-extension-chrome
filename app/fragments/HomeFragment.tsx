import * as React from 'react';
import { Text, View } from 'react-native';
import { useAuthState } from '../model/AuthState';
import { useBalance } from '../model/useBalance';
import { Avatar } from './components/Avatar';
import { SimpleButton } from './components/SimpleButton';
import { useNavigation } from './components/SimpleNavigation';
import { ValueComponent } from './components/ValueComponent';
import { SendFragment } from './SendFragment';

export const HomeFragment = React.memo(() => {
    const authState = useAuthState();
    let sessionState = authState.state!;
    let wallet = sessionState.reference!;
    const balance = useBalance(wallet.address);
    const navigation = useNavigation();

    const onSend = React.useCallback(() => {
        navigation.navigate(<SendFragment />);
    }, []);
    // const onReset = React.useCallback(() => {
    //     (async () => {
    //         await writeAuthState(null);
    //         authState.update(null);
    //     })();
    // }, []);

    return (
        <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ flexGrow: 1 }} />
            <View style={{ marginHorizontal: 32 }}>
                <View style={{ alignSelf: 'center', marginBottom: 24 }}>
                    <Avatar id={wallet.address} size={96} />
                </View>
                <Text style={{ height: 24, color: 'white', fontSize: 18, marginVertical: 8, alignSelf: 'center' }}>
                    {balance && (<ValueComponent value={balance} />)}
                    {!balance && <Text>...</Text>}
                </Text>
                <Text style={{ color: 'white', fontSize: 16, fontFamily: 'monospace' }}>{wallet.address.slice(0, 24)}</Text>
                <Text style={{ color: 'white', fontSize: 16, fontFamily: 'monospace' }}>{wallet.address.slice(24)}</Text>
                {/* <View style={{ alignSelf: 'center', marginTop: 64 }}>
                    <SimpleButton title="Disconnect" onPress={onReset} />
                </View> */}
                <View style={{ alignSelf: 'center', marginTop: 64 }}>
                    <SimpleButton title="Send" onPress={onSend} />
                </View>
            </View>
            <View style={{ flexGrow: 1 }} />
        </View >
    );
});