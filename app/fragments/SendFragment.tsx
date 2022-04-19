import * as React from 'react';
import { Text, TextInput, TextStyle, View } from 'react-native';
import { Address, toNano } from 'ton';
import { SimpleButton } from './components/SimpleButton';
import { useNavigation } from './components/SimpleNavigation';
import { ConfirmFragment } from './ConfirmFragment';

const textInputStyle: TextStyle = {
    marginVertical: 8,
    width: 250,
    fontSize: 18,
    color: 'white',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgb(163, 171, 186)',
    paddingVertical: 8,
    paddingHorizontal: 16
};

export const SendFragment = React.memo(() => {
    const navigation = useNavigation();
    const [address, setAddress] = React.useState('');
    const [amount, setAmount] = React.useState('');
    const [comment, setComment] = React.useState('');
    const doSend = React.useCallback(() => {
        try {
            let parsedAddress = Address.parseFriendly(address).address;
            let parsedAmount = toNano(amount);
            navigation.navigate(<ConfirmFragment text={comment} amount={parsedAmount} target={parsedAddress} boc={null} />);
        } catch (e) {
            // TODO: Handle
            console.warn(e);
        }
    }, [address, amount, comment]);

    return (
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>

            <View style={{ marginBottom: 16 }}>
                <Text style={{ color: 'white', fontSize: 18 }}>Send TON</Text>
            </View>

            <TextInput style={textInputStyle} value={address} onChangeText={setAddress} placeholder="Address" />
            <TextInput style={textInputStyle} value={amount} onChangeText={setAmount} placeholder="Amount" />
            <TextInput style={textInputStyle} value={comment} onChangeText={setComment} placeholder="Comment" />

            <View style={{ marginTop: 16 }}>
                <SimpleButton title="Confirm" onPress={doSend} />
            </View>
            <SimpleButton title="Back" onPress={navigation.back} />
        </View>
    );
});