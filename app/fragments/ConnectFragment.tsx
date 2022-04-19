import * as React from 'react';
import { Text, View } from 'react-native';
import QRCode from 'qrcode.react';
import { IS_TESTNET } from '../../api/client';
import { ActivityIndicator } from '../../components/ActivityIndicator';
import { createNewSession } from '../api/createNewSession';
import { AuthState, useAuthState, writeAuthState } from '../model/AuthState';
import { backoff } from '../utils/time';
import { delay } from 'teslabot';
import { getSessionState } from '../api/getSessionState';

const CreateSessionComponent = React.memo(() => {
    const state = useAuthState();
    React.useEffect(() => {
        backoff(async () => {

            // Create session
            let session = await createNewSession(IS_TESTNET);

            // Persist session
            let newState: AuthState = { seed: session.seed, session: session.session, reference: null };
            await writeAuthState(newState);
            state.update(newState);
        });
    }, []);

    return (<ActivityIndicator />);
});

const AwaitConnectionComponent = React.memo(() => {
    const state = useAuthState();
    const session = state.state!.session;
    const seed = state.state!.seed;
    const link = (IS_TESTNET ? 'ton-test://connect/' : 'ton://connect/') + session + '?endpoint=connect.tonhubapi.com';

    React.useEffect(() => {
        let exited = false;

        backoff(async () => {
            if (exited) {
                return;
            }
            while (!exited) {
                let fetchedState = await getSessionState(session);
                if (exited) {
                    return;
                }

                // Refresh session
                if (fetchedState.state === 'ready') {

                    // Apply State
                    const newState: AuthState = {
                        session,
                        seed,
                        reference: {
                            address: fetchedState.wallet!.address,
                            endpoint: fetchedState.wallet!.endpoint,
                            appPublicKey: fetchedState.wallet!.appPublicKey
                        }
                    };
                    await writeAuthState(newState);
                    state.update(newState);
                    return;
                } else if (fetchedState.state === 'not_found') {

                    // Session lost: reset flow
                    await writeAuthState(null);
                    state.update(null);
                    return
                }

                // Retry in 3 seconds
                await delay(3000);
            }
        });

        return () => {
            exited = true;
        }
    }, []);

    return (
        <View style={{ flexGrow: 1, flexBasis: 0, justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch' }}>
            <Text style={{ color: 'white', marginVertical: 8, fontSize: 18, marginHorizontal: 16, textAlign: 'center' }}>Connect Tonhub</Text>
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
    const state = useAuthState();
    if (!state.state) {
        return <CreateSessionComponent />;
    } else {
        return <AwaitConnectionComponent key={state.state.session} />;
    }
});