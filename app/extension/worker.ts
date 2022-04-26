import { backoff } from "../utils/time";
import { ExtensionState } from "../model/ExtensionState";
import { delay } from "teslabot";
import { Config } from "../Config";
import { readInternalState, writeInternalState } from "../model/InternalState";
import { getBalance } from "../api/getBalance";
import { Address, Cell, CommentMessage, safeSign } from "ton";
import BN from "bn.js";
import { keyPairFromSeed } from "ton-crypto";
import axios from "axios";
import fetchAdapter from '@vespaiach/axios-fetch-adapter';
import { TonhubConnector } from 'ton-x';

// Public extension state
let state: ExtensionState = { type: 'initing' };
let ports: chrome.runtime.Port[] = [];
function notifyState() {
    for (let p of ports) {
        p.postMessage({ state });
    }
}
const connector = new TonhubConnector({ testnet: Config.testnet, adapter: fetchAdapter });

// Internal states
backoff(async () => {
    while (true) {
        await backoff(async () => {

            // Fetch state
            let internalState = await readInternalState();
            if (!internalState) {
                let ns = await connector.createNewSession({
                    name: Config.testnet ? 'Ton Dev Web Wallet' : 'Tonhub Web',
                    url: Config.testnet ? 'https://test.web.tonhub.com' : 'https://web.tonhub.com'
                });
                internalState = {
                    seed: ns.seed,
                    session: ns.id,
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
                    let newState = await connector.getSessionState(currentIntState.session);

                    // Check if canceled
                    if (newState.state === 'revoked') {
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
                                address: newState.wallet.address,
                                endpoint: newState.wallet.endpoint,
                                appPublicKey: newState.wallet.appPublicKey,
                                walletConfig: newState.wallet.walletConfig,
                                walletType: newState.wallet.walletType,
                                walletSig: newState.wallet.walletSig,
                            }
                        }
                        await writeInternalState(currentIntState);
                        state = { type: 'online', session: currentIntState.session, address: newState.wallet.address };
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
                stateInit = Cell.fromBoc(Buffer.from(args.stateInit, 'base64'))[0];
            }

            // Comment
            let comment: string | null = null;
            if (typeof args.comment === 'string') {
                comment = args.comment;
            }

            // Transact
            let result = await connector.requestTransaction({
                seed: internalState.seed,
                appPublicKey: internalState.wallet.appPublicKey,
                timeout: 5 * 60 * 1000,
                to: address.toFriendly({ testOnly: Config.testnet }),
                value: value.toString(10),
                text: comment,
                stateInit: stateInit ? stateInit.toBoc({ idx: false }).toString('base64') : null,
                payload: data ? data.toBoc({ idx: false }).toString('base64') : null
            });
            if (result.type === 'success') {
                return result.response;
            } else {
                // TODO: Better errors?
                throw Error('Transaction error');
            }
        } else {
            throw Error('Wallet not connected');
        }
    }

    // Transaction
    if (name === 'ton_sign') {
        const internalState = await readInternalState();
        if (internalState && internalState.wallet) {

            // Parse data
            let data: Cell | null = null;
            if (args.dataType === 'hex') {
                data = new Cell();
                data.bits.writeBuffer(Buffer.from(args.data, 'hex'));
            } else if (args.dataType === 'base64') {
                data = new Cell();
                data.bits.writeBuffer(Buffer.from(args.data, 'base64'));
            } else if (args.dataType === 'boc') {
                data = Cell.fromBoc(Buffer.from(args.data, 'base64'))[0];
            } else {
                throw Error('Unknown data type: ' + args.dataType);
            }

            // Text
            let text: string | null = null;
            if (typeof args.text === 'string') {
                text = args.text;
            }

            // Request
            let result = await connector.requestSign({
                seed: internalState.seed,
                appPublicKey: internalState.wallet.appPublicKey,
                timeout: 5 * 60 * 1000,
                text,
                payload: data ? data.toBoc({ idx: false }).toString('base64') : null
            });

            if (result.type === 'success') {
                return result.signature;
            } else {
                // TODO: Better errors?
                throw Error('Transaction error');
            }
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