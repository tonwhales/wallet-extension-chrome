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

export async function writeKey(key: string, value: string | null): Promise<void> {
    if (typeof global.chrome !== 'undefined') {
        if (!value) {
            new Promise<void>((resolve) => chrome.storage.sync.remove(key, () => resolve()));
        } else {
            new Promise<void>((resolve) => chrome.storage.sync.set({ key: value }, () => resolve()));
        }
    } else {
        if (value) {
            localStorage.setItem(key, value);
        } else {
            localStorage.removeItem(key);
        }
    }
}