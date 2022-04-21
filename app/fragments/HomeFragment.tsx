import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import { IS_TESTNET } from '../api/client';
import { useAuthState, writeAuthState } from '../model/AuthState';
import { useBalance } from '../model/useBalance';
import { Avatar } from './components/Avatar';
import { HeaderComponent } from './components/HeaderComponent';
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
    const [label, setLabel] = React.useState(false)
    const [labelRemover, setLabelRemover] = React.useState(false)

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
        <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'space-between' }}>
            <HeaderComponent text={'Tonhub'} />
            <View style={{ marginHorizontal: 32, justifyContent: 'center' }}>
                <View style={{ alignSelf: 'center', marginBottom: 24 }}>
                    <Avatar id={wallet.address} size={96} />
                </View>
                <Text style={{ lineHeight: 36, color: 'white', fontSize: 30, fontWeight: '700', marginBottom: 8, marginTop: 16, alignSelf: 'center' }}>
                    {balance && balance.balance && (<ValueComponent value={balance.balance} />)}
                    {!balance.balance && <Text>...</Text>}
                </Text>
                <Text style={{ lineHeight: 20, fontWeight: '500', color: 'white', fontSize: 16, marginBottom: 20, alignSelf: 'center' }}>
                    {balance && balance.balance && balance.balanceUSD && (<ValueComponent value={balance.balance} usd={balance.balanceUSD} />)}
                    {!balance.balanceUSD && <Text>...</Text>}
                </Text>
                <div className={`wallet ${label ? 'active' : ''}`} style={{ display: 'flex', flexDirection: 'column' }}
                    data-remover={labelRemover ? 'v' : 'h'}
                    onClick={() => {
                        navigator.clipboard.writeText(wallet.address);
                        setLabel(true);
                        setLabelRemover(true)
                        setTimeout(() => {
                            setLabel(false)
                        }, 1000);
                        setTimeout(() => {
                            setLabelRemover(false)
                        }, 1210);
                    }}>
                    <span>{wallet.address.slice(0, 24)}</span>
                    <span>{wallet.address.slice(24)}</span>
                </div>
                <View style={{ marginTop: 40, marginHorizontal: 20 }}>
                    <SimpleButton title="Send" onPress={onSend} color={IS_TESTNET ? '#F1A03A' : 'rgb(26, 149, 224)'} />
                </View>
            </View>
            <View style={{ alignSelf: 'center', marginBottom: 16 }}>
                <Pressable
                    onPress={async () => {
                        await writeAuthState(null);
                        authState.update(null)
                    }}
                    style={(e) => ({
                        opacity: e.pressed ? 1 : 0.6,
                        backgroundColor: 'transparent',
                        height: 20,
                        borderRadius: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                    })}
                >
                    <Text style={{ color: 'white', fontSize: 18 }} selectable={false}>Disconnect</Text>
                </Pressable>
            </View>
        </View >
    );
});