import axios from 'axios';
import BN from 'bn.js';
import * as React from 'react';
import { Text, View } from 'react-native';
import { Address, Cell, CommentMessage } from 'ton';
import { keyPairFromSeed, sign } from 'ton-crypto';
import { useNavigation } from './components/SimpleNavigation';
import Lottie from 'lottie-react';
import { HeaderComponent } from './components/HeaderComponent';
import { backoff } from '../utils/time';

export const ConfirmFragment = React.memo((props: { text: string, target: Address, amount: BN, boc: Cell | null }) => {
    const navigation = useNavigation();
    // const auth = useAuthState();
    // const [state, setState] = React.useState<'sending' | 'sent' | 'confirmed' | 'canceled'>('sending');

    // React.useEffect(() => {

    //     let expires = Math.floor(Date.now() / 1000) + 5 * 60;
    //     let job = new Cell();
    //     job.bits.writeBuffer(Buffer.from(auth.state!.reference!.appPublicKey, 'base64'));
    //     job.bits.writeUint(expires, 32);
    //     job.bits.writeCoins(0);

    //     let jobD = new Cell();
    //     job.refs.push(jobD);
    //     jobD.bits.writeAddress(props.target);
    //     jobD.bits.writeCoins(props.amount);
    //     jobD.bits.writeBit(false); // No hint

    //     // Comment
    //     let comment = new Cell();
    //     new CommentMessage(props.text).writeTo(comment);
    //     jobD.refs.push(comment);

    //     // Payload
    //     if (props.boc) {
    //         jobD.refs.push(props.boc);
    //     } else {
    //         let payload = new Cell();
    //         jobD.refs.push(payload);
    //     }

    //     // Sign
    //     let hash = job.hash();
    //     let keypair = keyPairFromSeed(Buffer.from(auth.state!.seed, 'base64'));
    //     let signature = sign(hash, keypair.secretKey);

    //     // Create package
    //     let pkg = new Cell();
    //     pkg.bits.writeBuffer(signature);
    //     pkg.bits.writeBuffer(keypair.publicKey);
    //     pkg.refs.push(job);
    //     let boc = pkg.toBoc({ idx: false }).toString('base64');

    //     // Send
    //     (async () => {
    //         await backoff(async () => {
    //             await axios.post('https://connect.tonhubapi.com/connect/command', {
    //                 job: boc
    //             });
    //         });

    //         // Update state
    //         setState('sent');
    //     })()
    // }, []);

    return (
        <View style={{ flexGrow: 1, alignItems: 'center' }}>
            <HeaderComponent text={'Confirmation'} action={navigation.back} />
            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: '100px' }}>
                <div style={{ width: '170px', marginBottom: '15px' }}>
                    <Lottie
                        animationData={require('../fragments/components/images/AnimatedSticker.json')}
                        loop={true}
                    />
                </div>
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Text style={{ color: 'white', fontSize: 16, lineHeight: 20 }}>Transaction created!</Text>
                    <Text style={{ color: 'white', fontSize: 16, lineHeight: 20 }}>Сonfirm it in the Tonhub App</Text>
                </div>
            </View>
        </View>
    );
});