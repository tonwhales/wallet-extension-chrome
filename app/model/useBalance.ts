import axios from 'axios';
import * as React from 'react';
import { delay } from 'teslabot';
import { Address } from 'ton';
import { tonClient } from '../api/client';
import { backoff } from '../utils/time';

export interface PriceState {
    price: {
        usd: number
    }
}

export function useBalance(address?: string) {
    let [price, setPrice] = React.useState<string | null>(null);
    let [priceUSD, setPriceUSD] = React.useState<number | null>(null);
    React.useEffect(() => {
        if (address) {
            let exited = false;
            backoff(async () => {
                while (!exited) {
                    let balance = await tonClient.getBalance(Address.parse(address));
                    setPrice(balance.toString(10));
                    // await delay(5000);
                    let response = await (await axios.get('https://connect.tonhubapi.com/price', { method: 'GET' })).data as PriceState
                    setPriceUSD(response.price.usd);
                    await delay(5000);
                }
            });
            return () => {
                exited = true;
            }
        } else{
            let exited = false;
            backoff(async () => {
                while (!exited) {
                    let response = await (await axios.get('https://connect.tonhubapi.com/price', { method: 'GET' })).data as PriceState
                    setPriceUSD(response.price.usd);
                    await delay(5000);
                }
            });
            return () => {
                exited = true;
            }
        }
    }, [address]);
    return { balance: price, balanceUSD: priceUSD };
}