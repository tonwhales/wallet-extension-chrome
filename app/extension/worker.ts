import { backoff } from "../utils/time";
import { ExtensionState } from "../model/ExtensionState";
import { getSessionState } from "../api/getSessionState";
import { delay } from "teslabot";
import { createNewSession } from '../api/createNewSession';
import { Config } from "../Config";
import { readInternalState, writeInternalState } from "../model/InternalState";
import { getBalance } from "../api/getBalance";
import { Address, Cell, CommentMessage } from "ton";
import BN from "bn.js";
import { keyPairFromSeed, sign } from "ton-crypto";
import axios from "axios";
import fetchAdapter from '@vespaiach/axios-fetch-adapter';

// Public extension state
let state: ExtensionState = { type: 'initing' };
let ports: chrome.runtime.Port[] = [];
function notifyState() {
    for (let p of ports) {
        p.postMessage({ state });
    }
}

// Internal states
backoff(async () => {
    while (true) {
        await backoff(async () => {

            // Fetch state
            let internalState = await readInternalState();
            if (!internalState) {
                let ns = await createNewSession(Config.testnet);
                internalState = {
                    seed: ns.seed,
                    session: ns.session,
                    wallet: null
                };
                await writeInternalState(internalState);
            }

            // Update internal state
            if (internalState.wallet) {
                state = { type: 'online', session: internalState.session, address: internalState.wallet.address };
                notifyState();
            } else {
                state = { type: 'pending', session: internalState.session, link: (Config.testnet ? 'ton-test://connect/' : 'ton://connect/') + internalState.session + '?endpoint=connect.tonhubapi.com' };
                notifyState();
            }

            // Check state
            let currentIntState = internalState;
            await backoff(async () => {
                while (true) {
                    let newState = await getSessionState(currentIntState.session);

                    // Check if canceled
                    if (newState.state === 'not_found') {
                        state = { type: 'initing' };
                        notifyState();
                        await writeInternalState(null);
                        return;
                    }

                    // Check if became ready
                    if (newState.state === 'ready' && !currentIntState.wallet) {
                        currentIntState = {
                            seed: currentIntState.seed,
                            session: currentIntState.session,
                            wallet: {
                                address: newState.wallet!.address,
                                endpoint: newState.wallet!.endpoint,
                                appPublicKey: newState.wallet!.appPublicKey,
                                walletConfig: newState.wallet!.walletConfig,
                                walletType: newState.wallet!.walletType,
                                walletSig: newState.wallet!.walletSig,
                            }
                        }
                        await writeInternalState(currentIntState);
                        state = { type: 'online', session: currentIntState.session, address: newState.wallet!.address };
                        notifyState();
                    }

                    // Continue
                    await delay(5000);
                }
            });
        });
    }
});

async function handleBrowserRequest(name: string, args: any): Promise<any> {

    // Request accounts
    if (name === 'ton_requestAccounts') {
        let internalState = await readInternalState();
        if (internalState && internalState.wallet) {
            return [internalState.wallet.address];
        } else {
            return [];
        }
    }

    // Request wallets
    if (name === 'ton_requestWallets') {
        let internalState = await readInternalState();
        if (internalState && internalState.wallet) {
            return [{
                address: internalState.wallet.address,
                walletType: internalState.wallet.walletType,
                walletConfig: internalState.wallet.walletConfig,
                walletSig: internalState.wallet.walletSig
            }];
        } else {
            return [];
        }
    }

    // Balance
    if (name === 'ton_getBalance') {
        let internalState = await readInternalState();
        if (internalState && internalState.wallet) {
            const address = internalState.wallet.address;
            let balance = await backoff(() => getBalance(address));
            return balance.toString();
        }
    }

    // Transaction
    if (name === 'ton_sendTransaction') {
        const internalState = await readInternalState();
        if (internalState && internalState.wallet) {

            // Parse address
            let address = Address.parseFriendly(args.to).address;

            // Value
            let value = new BN(args.value, 10);

            // Parse data
            let data: Cell | null = null;
            if (typeof args.data === 'string') {
                if (args.dataType === 'hex') {
                    data = new Cell();
                    data.bits.writeBuffer(Buffer.from(args.data, 'hex'));
                } else if (args.dataType === 'base64') {
                    data = new Cell();
                    data.bits.writeBuffer(Buffer.from(args.data, 'base64'));
                } else if (args.dataType === 'boc') {
                    data = Cell.fromBoc(Buffer.from(args.data, 'base64'))[0];
                }
            }

            // StateInit
            let stateInit: Cell | null = null;
            if (typeof args.stateInit === 'string') {
                data = Cell.fromBoc(Buffer.from(args.stateInit, 'base64'))[0];
            }

            // Comment
            let comment: string = '';
            if (typeof args.comment === 'string') {
                comment = args.comment;
            }

            // Send
            let expires = Math.floor(Date.now() / 1000) + 5 * 60;
            let job = new Cell();
            job.bits.writeBuffer(Buffer.from(internalState.wallet.appPublicKey, 'base64'));
            job.bits.writeUint(expires, 32);
            job.bits.writeCoins(0);

            let jobD = new Cell();
            job.refs.push(jobD);
            jobD.bits.writeAddress(address);
            jobD.bits.writeCoins(value);

            // Comment
            let commentCell = new Cell();
            new CommentMessage(comment).writeTo(commentCell);
            jobD.refs.push(commentCell);

            // Payload
            if (data) {
                jobD.bits.writeBit(true);
                jobD.refs.push(data);
            } else {
                jobD.bits.writeBit(false);
            }

            // StateInit
            if (stateInit) {
                jobD.bits.writeBit(true);
                jobD.refs.push(stateInit);
            } else {
                jobD.bits.writeBit(false);
            }

            // Sign
            let hash = job.hash();
            let keypair = keyPairFromSeed(Buffer.from(internalState.seed, 'base64'));
            let signature = sign(hash, keypair.secretKey);

            // Create package
            let pkg = new Cell();
            pkg.bits.writeBuffer(signature);
            pkg.bits.writeBuffer(keypair.publicKey);
            pkg.refs.push(job);
            let boc = pkg.toBoc({ idx: false }).toString('base64');

            // Post package
            await backoff(async () => {
                await axios.post('https://connect.tonhubapi.com/connect/command', {
                    job: boc
                }, { adapter: fetchAdapter, timeout: 5000 });
            });

            return true;
        } else {
            throw Error('Wallet not connected');
        }
    }

    throw Error('Unknown request: ' + name);
}

// State listener
chrome.runtime.onConnect.addListener((port) => {
    if (port.name === 'state') {

        // State
        let connected = true;
        port.postMessage({ type: 'state', state });
        ports.push(port);
        port.onDisconnect.addListener(() => {
            connected = false;
            ports = ports.filter((v) => v !== port);
        });

        // Commands
        port.onMessage.addListener((msg) => {
            let src = (msg as any);
            let name: string = src.name;
            let opts: any = src.opts;
            let id: number = src.id;
            (async () => {
                try {
                    let response = await handleBrowserRequest(name, opts);
                    if (connected) {
                        port.postMessage({ type: 'response', id, data: response });
                    }
                } catch (e) {
                    if (connected) {
                        port.postMessage({ type: 'failure', id, text: '' + e });
                    }
                }
            })();
        });
    } else {
        port.disconnect();
    }
});


// // Work around for typescript compiler
export default undefined;