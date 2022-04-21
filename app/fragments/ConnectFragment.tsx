import * as React from 'react';
import { Text, View } from 'react-native';
import QRCode from 'qrcode.react';
import { Config } from '../Config';
import { useExtensionState } from '../ExtensionStateContext';

const AwaitConnectionComponent = React.memo(() => {
    const state = useExtensionState();
    if (state.type !== 'pending') {
        throw Error('Unexpected');
    }
    const link = state.link;
    return (
        <View style={{ flexGrow: 1, flexBasis: 0, justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch' }}>
            <Text style={{ color: 'white', marginVertical: 8, fontSize: 18, marginHorizontal: 16, textAlign: 'center' }}>{Config.testnet ? 'Connect Ton Dev Wallet' : 'Connect Tonhub'}</Text>
            <Text style={{ color: 'white', marginVertical: 8, fontSize: 16, marginHorizontal: 16, textAlign: 'center' }}>Scan QR code to begin</Text>
            <QRCode
                size={256}
                value={link}
                includeMargin={true}
                renderAs="svg"
                bgColor='#222225'
                fgColor='#fff'
            />
        </View>
    );
});

export const ConnectFragment = React.memo(() => {
    return <AwaitConnectionComponent />;
});