export async function readKey(key: string): Promise<string | null> {
    if (typeof global.chrome !== 'undefined') {
        return new Promise<string | null>((resolve) => {
            global.chrome.storage.sync.get(key, (i) => {
                if (i[key]) {
                    resolve(i[key]);
                } else {
                    resolve(null);
                }
            });
        });
    } else {
        let r = localStorage.getItem(key);
        if (r !== undefined) {
            return r;
        } else {
            return null;
        }
    }
}

export async function writeKey(key: string | null): Promise<void> {
    // chrome.storage.sync.set({ 'whales-state-key': seed.toString('base64') }, () => console.log('extension logged', seed.toString('base64')));
}