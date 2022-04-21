import * as React from 'react';
import { Text, TextInput, TextStyle, View } from 'react-native';
import { Address, toNano } from 'ton';
import { HeaderComponent } from './components/HeaderComponent';
import { SimpleButton } from './components/SimpleButton';
import { useNavigation } from './components/SimpleNavigation';
import { ConfirmFragment } from './ConfirmFragment';

const textInputStyle: TextStyle = {
    width: 270,
    fontSize: 16,
    lineHeight: 20,
    color: 'white',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: ' #181818'
};

export const SendFragment = React.memo(() => {
    const navigation = useNavigation();
    const [address, setAddress] = React.useState('');
    const [amount, setAmount] = React.useState('');
    const [comment, setComment] = React.useState('');
    const [error, setError] = React.useState<null | string>(null);
    const doSend = React.useCallback(() => {
        setError(null)
        try {
            let parsedAddress = Address.parseFriendly(address).address;
            let parsedAmount = toNano(amount);
            navigation.navigate(<ConfirmFragment text={comment} amount={parsedAmount} target={parsedAddress} boc={null} />);
            setError(null)
        } catch (e) {
            // TODO: Handle
            setError('Wrong wallet address')
            console.warn(e);
        }
    }, [address, amount, comment, error, setError]);

    return (
        <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'space-between' }}>
            <HeaderComponent text={'Send TON'} action={navigation.back} />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flexGrow: 1, gap: '16px', position: 'relative' }}>
                {error && <div className='error' style={{ backgroundColor: 'rgba(192, 46, 46, 0.8)', borderRadius: '8px', padding: '6px 10px', color: '#fff', fontSize: '14px', lineHeight: '18px', position: 'absolute', top: '40px', left: '15%' }}>
                    {error}
                </div>}
                <TextInput style={textInputStyle} value={address} onChangeText={setAddress} placeholder="Address" />
                <TextInput style={textInputStyle} value={amount} onChangeText={setAmount} placeholder="Amount" />
                <TextInput style={textInputStyle} value={comment} onChangeText={setComment} placeholder="Comment" />

                <View style={{ marginTop: 40, width: '100%', paddingHorizontal: 31 }}>
                    <SimpleButton title="Confirm" onPress={doSend} disabled={address.length <= 0 || amount.length <= 0} />
                </View>
            </div>
        </View>
    );
});