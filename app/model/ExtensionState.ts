export type ExtensionState = {
    type: 'initing'
} | {
    type: 'pending',
    session: string,
    link: string
} | {
    type: 'online',
    session: string,
    address: string
};