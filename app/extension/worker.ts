import { backoff } from "../utils/time";
import { ExtensionState } from "../model/ExtensionState";
import { getSessionState } from "../api/getSessionState";
import { delay } from "teslabot";
import { createNewSession } from '../api/createNewSession';
import { Config } from "../Config";
import { readInternalState, writeInternalState } from "../model/InternalState";
import { parseMessage, serializeMessage } from "./proto/Message";
import { getBalance } from "../api/getBalance";

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