import axios from "axios";
import fetchAdapter from '@vespaiach/axios-fetch-adapter';
import { toUrlSafe } from "../utils/toUrlSafe";
import { Config } from "../Config";
import BN from "bn.js";

export async function getBalance(address: string) {
    let ex = (await axios.get(Config.endpoint + '/getAddressBalance?address=' + toUrlSafe(address), { adapter: fetchAdapter, timeout: 5000 })).data;
    if (!ex.ok) {
        throw Error('Unable to get balance');
    }
    return new BN(ex.value);
}