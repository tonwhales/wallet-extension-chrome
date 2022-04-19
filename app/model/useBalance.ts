import * as React from 'react';
import { delay } from 'teslabot';
import { Address } from 'ton';
import { tonClient } from '../api/client';
import { backoff } from '../utils/time';

export function useBalance(address: string) {
    let [price, setPrice] = React.useState<string | null>(null);
    React.useEffect(() => {
        let exited = false;
        backoff(async () => {
            while (!exited) {
                let balance = await tonClient.getBalance(Address.parse(address));
                setPrice(balance.toString(10));
                await delay(5000);
            }
        });
        return () => {
            exited = true;
        }
    }, [address]);
    return price;
}