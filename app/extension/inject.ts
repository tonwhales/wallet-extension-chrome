import { ExtensionState } from "../model/ExtensionState";
import { parseMessage, serializeMessage } from "./proto/Message";

// Inject
function injectScript(file_path: string, tag: string) {
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file_path);
    node.appendChild(script);
}
injectScript(chrome.runtime.getURL('browser.js'), 'body');

// Subscribe to state
let port: chrome.runtime.Port;
let state: ExtensionState = { type: 'initing' };
function postState() {
    window.postMessage(serializeMessage({
        magic: 'wallet-extension-magic',
        from: 'extension',
        pkg: {
            type: 'state',
            state
        }
    }));
}

function reopenPort() {
    port = chrome.runtime.connect({ name: 'state' });
    port.onMessage.addListener((e) => {
        let type = (e as any).type;
        if (type === 'state') {
            state = (e as any).state;
            postState();
        } else if (type === 'response') {
            window.postMessage(serializeMessage({
                magic: 'wallet-extension-magic',
                from: 'extension',
                pkg: {
                    type: 'response',
                    id: (e as any).id,
                    data: (e as any).data
                }
            }));
        } else if (type === 'failure') {
            window.postMessage(serializeMessage({
                magic: 'wallet-extension-magic',
                from: 'extension',
                pkg: {
                    type: 'failed',
                    id: (e as any).id,
                    text: (e as any).text
                }
            }));
        }
    });
    port.onDisconnect.addListener(() => {
        reopenPort();
    });
}
reopenPort();

// Listener
window.addEventListener('message', (msg) => {
    let parsed = parseMessage(msg.data);
    if (parsed && parsed.from === 'browser') {
        if (parsed.pkg.type === 'subscribe') {
            postState();
        } else if (parsed.pkg.type === 'request') {
            port.postMessage({ type: 'request', id: parsed.pkg.id, name: parsed.pkg.name, opts: parsed.pkg.opts });
        }
    }
});

export default undefined;