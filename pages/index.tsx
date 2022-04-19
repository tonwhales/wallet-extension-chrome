import * as React from 'react';
import { NextPage } from "next";
import { backoff, delay } from '@openland/patterns';
import axios from 'axios';
import { getSecureRandomBytes, keyPairFromSeed, sign } from 'ton-crypto'
import Cookies from 'js-cookie';
import QRCode from 'qrcode.react';
import { Address, Cell, toNano } from 'ton';
import { useAuth } from '../components/AuthProvider';
import { ActivityIndicator } from '../components/ActivityIndicator';
import { getConnectState } from '../api/getConnectState';
import { toUrlSafe } from '../utils/toUrlSafe';
import { IS_TESTNET } from '../api/client';
import { ValueComponent } from '../components/ValueComponent';

type FormData = { address: string, amount: number };

const CreateSessionComponent = React.memo(() => {
    let auth = useAuth();
    let temp: {
        address: string,
        endPoint: string,
        appPublicKey: string
    } | null = null
    React.useEffect(() => {
        let exited = false;
        chrome.storage.sync.get('whales-profile', (v) => { console.log(v['whales-profile'], 'logged from storage'); temp = v['whales-profile'] });
        console.log(temp, 'temp');
        backoff(async () => {
            if (exited) {
                return;
            }
            let seed = await getSecureRandomBytes(32);
            let keyPair = keyPairFromSeed(seed);
            let key = toUrlSafe(keyPair.publicKey.toString('base64'));
            let session = await axios.post('https://connect.tonhubapi.com/connect/init', {
                key,
                testnet: IS_TESTNET,
                name: IS_TESTNET ? 'TEST Ton Whales' : 'Ton Whales',
                url: IS_TESTNET ? 'https://test.tonwhales.com' : 'https://tonwhales.com'
            });
            if (!session.data.ok) {
                throw Error('Unable to create state');
            }
            if (temp) {
                chrome.storage.sync.set({ 'whales-state-key': seed.toString('base64') }, () => console.log('extension logged', seed.toString('base64')));
                Cookies.set('whales-state', key, { expires: 356 });
                auth.handler({ session: key, wallet: { address: temp.address, endpoint: temp.endPoint, appPublicKey: temp.appPublicKey } });
                return
            }
            if (exited) {
                return;
            }

            // Persist session
            // localStorage.setItem('whales-state-key', seed.toString('base64'));
            chrome.storage.sync.set({ 'whales-state-key': seed.toString('base64') }, () => console.log('extension logged', seed.toString('base64')));
            Cookies.set('whales-state', key, { expires: 356 });
            auth.handler({ session: key, wallet: null });
        });
        return () => {
            exited = true;
        }
    }, []);


    return (
        <div style={{ display: 'flex', alignSelf: 'center', justifyContent: 'center', backgroundColor: '#222225', width: '300px', height: '60px', padding: '10px 0' }}>
            <ActivityIndicator />
        </div>
    );
});

const ConnectComponent = React.memo(() => {
    let auth = useAuth();
    const link = (IS_TESTNET ? 'ton-test://connect/' : 'ton://connect/') + auth.state!.session + '?endpoint=connect.tonhubapi.com';

    React.useEffect(() => {
        let exited = false;

        backoff(async () => {
            if (exited) {
                return;
            }
            while (!exited) {
                let state = await getConnectState(auth.state!.session);
                if (exited) {
                    return;
                }

                // Refresh session
                if (state.state === 'ready') {

                    chrome.storage.sync.set({
                        'whales-profile': {
                            address: state.wallet!.address,
                            endpoint: state.wallet!.endpoint,
                            appPublicKey: state.wallet!.appPublicKey
                        }
                    }, () => console.log('extension logged'));
                    Cookies.set('whales-state', auth.state!.session, { expires: 356 });
                    auth.handler({
                        session: auth.state!.session,
                        wallet: {
                            address: state.wallet!.address,
                            endpoint: state.wallet!.endpoint,
                            appPublicKey: state.wallet!.appPublicKey
                        }
                    });
                    return;
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
        <div style={{ display: 'flex', flexDirection: 'column', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', backgroundColor: '#222225', padding: '15px', color: '#fff', width: '300px' }}>
            <span style={{ fontSize: '15px' }}>Awaiting connection...</span>
            {/* <ActivityIndicator /> */}
            <div style={{ marginTop: 16 }}>
                <span style={{ fontSize: '15px' }}>Scan this QR Code with {IS_TESTNET ? 'Ton Development Wallet' : 'Tonhub'}</span>
            </div>
            <div style={{ marginTop: 16 }}>
                <QRCode
                    size={256}
                    value={link}
                    renderAs="svg"
                    bgColor='#222225'
                    fgColor='#fff'
                />
            </div>
        </div>
    );
});

const WalletComponent = React.memo(() => {

    async function fetchBalance(url?: string): Promise<number> {
        if (url && url.length > 0) {
            try {
                let response = await fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${url}`, { headers: { 'X-API-Key': '4ec5fe67a679d83f732963bc164539bb09b623ffecbef2aa14817540d56974b5' } });
                let data: any = await response.json();

                if (data !== undefined && data.result !== undefined) {
                    return data.result
                }
            } catch (e) {
            }
            return await fetchBalance(url)
        }
        return 0
    }
    let auth = useAuth();
    let address = Address.parse(auth.state!.wallet!.address);
    let friendly = address.toFriendly()
    let endpoint = auth.state!.wallet!.endpoint;
    let cuttedFriendly = friendly.slice(0, 6) + '...' + friendly.slice(friendly.length - 6);
    let seed = ''
    console.log(auth.state!.wallet!.endpoint, 'QQQQQQQQQ');

    chrome.storage.sync.get('whales-state-key', (v) => { console.log(v['whales-state-key']); seed = v['whales-state-key'] });

    const [form, setForm] = React.useState<FormData>({ address: '', amount: 0 })

    const handleFieldChange = React.useCallback((field: keyof FormData) => {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            setForm((prevValue) => {
                const newValue = { ...prevValue, ...{ [field]: event.target.value } };
                return newValue;
            });
        }
    }, [setForm]);

    const [balance, setBalance] = React.useState<string | null>(null)

    React.useEffect(() => {
        fetchBalance(friendly)
            .then((v) => {
                setBalance(`${v}`)
            })
    }, [])

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#222225',
        }}>
            <div style={{
                display: 'flex',
                borderBottom: '1px solid #fff',
                padding: '15px',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '350px',
                color: '#fff'
            }}><div style={{
                display: 'flex',
                flexDirection:'column',
                gap:'12px'
            }} >
                    <div style={{ display: 'flex' }}>
                        <span style={{ width: '100px' }}>Your wallet:</span>
                        <span>{cuttedFriendly}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems:'center' }}>
                        <span style={{ width: '100px' }}>Balance:</span>
                        <span>{balance ? <ValueComponent value={balance}/> : '...'}</span>
                    </div>
                </div>
                <button
                    // style={{
                    //     backgroundColor: 1 < 2 ? '#F1A03A' : ''
                    // }}
                    onClick={() => {
                        // Reset session
                        chrome.storage.sync.remove(['whales-state-key', 'whales-profile'], () => { console.log('Disconnected'); });
                        Cookies.remove('whales-state');
                        auth.handler(null);
                    }}>
                    Disconnect
                </button>
            </div>
            <div style={{
                width: '350px',
                padding: '15px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '15px'
            }}>
                <h1>Create transaction</h1>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    color: '#fff'
                }}>
                    <div>Amount:</div>
                    <input type="text" value={form.amount} placeholder="Pass amount of TON" onChange={handleFieldChange('amount')} />
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    color: '#fff'
                }}>
                    <div>To wallet:</div>
                    <input type="text" placeholder="Pass the wallet" value={form.address} onChange={handleFieldChange('address')} />
                </div>

                <button
                    // style={{
                    //     backgroundColor: 1 < 2 ? '#F1A03A' : ''
                    // }}
                    onClick={() => {
                        let expires = Math.floor(Date.now() / 1000) + 5 * 60;
                        let job = new Cell();
                        job.bits.writeBuffer(Buffer.from(auth.state!.wallet!.appPublicKey, 'base64'));
                        job.bits.writeUint(expires, 32);
                        job.bits.writeCoins(0);

                        let jobD = new Cell();
                        job.refs.push(jobD);
                        // jobD.bits.writeAddress(Address.parse('kQBs7t3uDYae2Ap4686Bl4zGaPKvpbauBnZO_WSop1whaLEs'));
                        jobD.bits.writeAddress(Address.parse(form.address));
                        // jobD.bits.writeCoins(toNano(1));
                        jobD.bits.writeCoins(toNano(form.amount));
                        jobD.bits.writeBit(false); // No hint

                        let comment = new Cell();
                        comment.bits.writeBuffer(Buffer.from('Sample transaction'));
                        jobD.refs.push(comment);

                        let payload = new Cell();
                        jobD.refs.push(payload);

                        // Sign
                        let hash = job.hash();
                        // let seed = localStorage.getItem('whales-state-key')!;
                        // let seed=''
                        let keypair = keyPairFromSeed(Buffer.from(seed, 'base64'));
                        let signature = sign(hash, keypair.secretKey);

                        let pkg = new Cell();
                        pkg.bits.writeBuffer(signature);
                        pkg.bits.writeBuffer(keypair.publicKey);
                        pkg.refs.push(job);
                        let s = pkg.toBoc({ idx: false }).toString('base64');
                        console.log(s, 's');
                        console.log(seed, 'seed');

                        //             let dest = ds.readAddress();
                        // if (!dest) {
                        //     return null;
                        // }

                        // // Amount
                        // let amount = ds.readCoins();

                        // // Text
                        // let text: string = parseString(ds.readRef());

                        // // Payload
                        // let payload: Cell = ds.readCell();

                        // // Payload hint
                        // let payloadHint: string | null = null;
                        // if (ds.readBit()) {
                        //     payloadHint = parseString(ds.readRef());
                        // }

                        //                 let key = sc.readBuffer(32);
                        // let expires = sc.readUintNumber(32) * 1000;
                        // let kind = sc.readCoins().toNumber();
                        backoff(async () => {
                            await axios.post('https://connect.tonhubapi.com/connect/command', {
                                job: s
                            });
                        });
                    }}
                >Send
                </button>
            </div>
        </div>
    );
});

const Home: NextPage = () => {
    let auth = useAuth();
    return (
        <>
            {!auth.state && (<CreateSessionComponent />)}
            {auth.state && !auth.state.wallet && (<ConnectComponent />)}
            {auth.state && !!auth.state.wallet && (<WalletComponent />)}
        </>
    );
}

export default Home
