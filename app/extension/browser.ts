//
// Communication Interface
//

export class TonXBrowser {
    readonly apiLevel = 1;
    execute = async (src: any): Promise<any> => {
        return src;
    }
}

//
// Injecting
//

(window as any)['ton-x'] = new TonXBrowser();
export default undefined;