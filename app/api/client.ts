import { TonClient } from 'ton';
import { Config } from '../Config';
export const tonClient = new TonClient({ endpoint: `${Config.endpoint}/jsonRPC` });