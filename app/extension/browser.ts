//
// Communication Interface
//

import { ExtensionState } from "../model/ExtensionState";
import { parseMessage, serializeMessage } from "./proto/Message";

export class TonXBrowser extends EventTarget {
    readonly apiLevel = 1;
    private _state: ExtensionState = { type: 'initing' };
    private _id = 0;
    private _pending = new Map<number, [(src: any) => void, (src: any) => void]>();

    constructor() {
        super();
        window.addEventListener('message', (msg) => {
            let parsed = parseMessage(msg.data);
            if (parsed && parsed.from === 'extension') {
                if (parsed.pkg.type === 'state') {
                    this._state = parsed.pkg.state;
                    this.dispatchEvent(new Event('state'));
                } else if (parsed.pkg.type === 'response') {
                    let resolver = this._pending.get(parsed.pkg.id);
                    if (resolver) {
                        this._pending.delete(parsed.pkg.id);
                        resolver[0](parsed.pkg.data);
                    }
                } else if (parsed.pkg.type === 'failed') {
                    let resolver = this._pending.get(parsed.pkg.id);
                    if (resolver) {
                        this._pending.delete(parsed.pkg.id);
                        resolver[1](new Error(parsed.pkg.text));
                    }
                }
            }
        });
        window.postMessage(serializeMessage({ magic: 'wallet-extension-magic', from: 'browser', pkg: { type: 'subscribe' } }));
    }

    getState() {
        return this._state;
    }

    request = async (name: string, opts?: any): Promise<any> => {
        let reqOpts: any = opts || {};
        let reqId = this._id++;
        let res = new Promise<any>((resolve, reject) => {
            this._pending.set(reqId, [resolve, reject]);
        })
        window.postMessage(serializeMessage({ magic: 'wallet-extension-magic', from: 'browser', pkg: { type: 'request', name, id: reqId, opts: reqOpts } }));
        return res;
    }
}

//
// Injecting
//

(window as any)['ton-x'] = new TonXBrowser();
export default undefined;