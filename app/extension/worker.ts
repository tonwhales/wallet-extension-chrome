import { backoff } from "../utils/time";
import { ExtensionState } from "../model/ExtensionState";
import { getSessionState } from "../api/getSessionState";
import { delay } from "teslabot";
import { createNewSession } from '../api/createNewSession';
import { Config } from "../Config";
import { readInternalState, writeInternalState } from "../model/InternalState";

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

// State listener
chrome.runtime.onConnect.addListener((port) => {
    console.warn(port);
    if (port.name === 'state') {
        port.postMessage({ state });
        ports.push(port);
        port.onDisconnect.addListener(() => {
            ports = ports.filter((v) => v !== port);
        });
    } else {
        port.disconnect();
    }
});


// // Work around for typescript compiler
export default undefined;