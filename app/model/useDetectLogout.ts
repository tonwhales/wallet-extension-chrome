import * as React from 'react';
import { delay } from 'teslabot';
import { getSessionState } from '../api/getSessionState';
import { backoff } from '../utils/time';
import { useAuthState, writeAuthState } from "./AuthState";

export function useDetectLogout() {
    const state = useAuthState();
    const session = state.state!.session;
    React.useEffect(() => {
        let exited = false;

        backoff(async () => {
            if (exited) {
                return;
            }
            while (!exited) {
                console.log('Check session: ' + session);
                let fetchedState = await getSessionState(session);
                if (exited) {
                    return;
                }
                console.warn(fetchedState);

                // Session lost: reset flow
                if (fetchedState.state !== 'ready' || fetchedState.revoked) {
                    await writeAuthState(null);
                    state.update(null);
                    return
                }

                // Retry in 3 seconds
                await delay(15000);
            }
        });

        return () => {
            exited = true;
        }
    }, []);
}