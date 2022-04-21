import * as React from 'react';
import { App } from './App';
import { View } from 'react-native';
import { ExtensionState } from './model/ExtensionState';
import { ExtensionStateContext } from './ExtensionStateContext';

export const Boot = React.memo(() => {

    // State
    const [extensionState, setExtensionState] = React.useState<null | ExtensionState>(null);
    React.useEffect(() => {
        let exited = false;
        let port: chrome.runtime.Port | null = null;

        function reconnect() {
            if (exited) {
                return;
            }
            port = chrome.runtime.connect({ name: 'state' })
            port.onMessage.addListener((e) => {
                setExtensionState((e as any).state as ExtensionState);
            });
            port.onDisconnect.addListener(() => {
                if (exited) {
                    return;
                }
                port = null;
                setTimeout(() => {
                    reconnect();
                }, 1000);
            })
        }
        reconnect();

        return () => {
            exited = true;
            if (port) {
                let p = port!;
                port = null;
                p.disconnect();
            }
        }
    }, []);

    // Render
    return (
        <View style={{ width: 350, height: 566 /* Golden Ratio */, backgroundColor: '#222225', alignItems: 'stretch', flexDirection: 'column' }}>
            {/* {!authState && (
                <ActivityIndicator />
            )} */}
            {!!extensionState && (
                <ExtensionStateContext.Provider value={extensionState}>
                    <App />
                </ExtensionStateContext.Provider>
            )}
        </View>
    );
});