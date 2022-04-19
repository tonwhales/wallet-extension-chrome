import * as React from 'react';
import { delay } from 'teslabot';
import { getSessionState } from '../api/getSessionState';
import { useAuthState, writeAuthState } from '../model/AuthState';
import { backoff } from '../utils/time';

export const AppFragment = React.memo(() => {
    const state = useAuthState();
    const session = state.state!.session;
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

                // Session lost: reset flow
                if (fetchedState.state !== 'ready') {
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

    return null;
});