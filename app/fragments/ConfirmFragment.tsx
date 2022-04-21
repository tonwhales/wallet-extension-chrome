import axios from 'axios';
import BN from 'bn.js';
import * as React from 'react';
import { Text, View } from 'react-native';
import { Address, Cell, CommentMessage } from 'ton';
import { keyPairFromSeed, sign } from 'ton-crypto';
import { useAuthState } from '../model/AuthState';
import { backoff } from '../utils/time';
import { SimpleButton } from './components/SimpleButton';
import { useNavigation } from './components/SimpleNavigation';
import Lottie from 'lottie-react';
import { HeaderComponent } from './components/HeaderComponent';
import { IS_TESTNET } from '../api/client';
import { Avatar, avatarColors, avatarImages } from './components/Avatar';
import murmurhash from 'murmurhash';
import { KnownWallets } from '../utils/KnownWallets';
import { KnownAvatar } from '../utils/KnownAvatar';
import { ValueComponent } from './components/ValueComponent';
import { useBalance } from '../model/useBalance';
import { HomeFragment } from './HomeFragment';
import { SendingComponent } from './components/SendingComponent';
import { SentComponent } from './components/SentComponent';
import { PendedComponent } from './components/PendedComponent';
import { ConfirmedComponent } from './components/ConfirmedComponent';
import { CanceledComponent } from './components/CanceledComponent';

export const ConfirmFragment = React.memo((props: { text: string, target: Address, amount: BN, boc: Cell | null }) => {
    const navigation = useNavigation();
    const auth = useAuthState();
    const [state, setState] = React.useState<'sending' | 'sent' | 'pended' | 'confirmed' | 'canceled'>('sending');

    React.useEffect(() => {

        let expires = Math.floor(Date.now() / 1000) + 5 * 60;
        let job = new Cell();
        job.bits.writeBuffer(Buffer.from(auth.state!.reference!.appPublicKey, 'base64'));
        job.bits.writeUint(expires, 32);
        job.bits.writeCoins(0);

        let jobD = new Cell();
        job.refs.push(jobD);
        jobD.bits.writeAddress(props.target);
        jobD.bits.writeCoins(props.amount);
        jobD.bits.writeBit(false); // No hint

        // Comment
        let comment = new Cell();
        new CommentMessage(props.text).writeTo(comment);
        jobD.refs.push(comment);

        // Payload
        if (props.boc) {
            jobD.refs.push(props.boc);
        } else {
            let payload = new Cell();
            jobD.refs.push(payload);
        }

        // Sign
        let hash = job.hash();
        let keypair = keyPairFromSeed(Buffer.from(auth.state!.seed, 'base64'));
        let signature = sign(hash, keypair.secretKey);

        // Create package
        let pkg = new Cell();
        pkg.bits.writeBuffer(signature);
        pkg.bits.writeBuffer(keypair.publicKey);
        pkg.refs.push(job);
        let boc = pkg.toBoc({ idx: false }).toString('base64');

        // Send
        (async () => {
            await backoff(async () => {
                await axios.post('https://connect.tonhubapi.com/connect/command', {
                    job: boc
                });
            });

            // Update state
            setState('confirmed')
        })()
    }, []);

    return (
        <View style={{ flexGrow: 1, alignItems: 'center' }}>
            <HeaderComponent text={state === 'sending' || state === 'sent' || state === 'pended' ? 'Send TON' : state === 'confirmed' ? 'Sent' : state === 'canceled' ? 'Sending canceled' : 'Send TON'} action={navigation.back} />
            {state === 'sending' && <SendingComponent />}
            {state === 'sent' && <SentComponent />}
            {state === 'pended' && <PendedComponent />}
            {state === 'confirmed' && <ConfirmedComponent wallet={props.target} amount={props.amount} />}
            {state === 'canceled' && <CanceledComponent />}
        </View>
    );
});