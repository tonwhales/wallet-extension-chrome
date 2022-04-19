import { backoff } from '@openland/patterns';
import * as React from 'react';
import { delay } from 'teslabot';
import { Address, fromNano, toNano } from 'ton';
import { tonClient } from '../api/client';

export function useBalance(address: string) {
    let [price, setPrice] = React.useState<string | null>(null);
    React.useEffect(() => {
        let exited = false;
        backoff(async () => {
            while (!exited) {
                let balance = await tonClient.getBalance(Address.parse(address));
                setPrice(fromNano(balance));
                await delay(5000);
            }
        });
        return () => {
            exited = true;
        }
    }, [address]);
    return price;
}