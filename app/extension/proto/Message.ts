import * as t from 'io-ts';

export const messageCodec = t.type({
    magic: t.literal('wallet-extension-magic'),
    from: t.union([t.literal('browser'), t.literal('extension')]),
    pkg: t.union([t.type({
        type: t.literal('subscribe')
    }), t.type({
        type: t.literal('state'),
        state: t.union([t.type({
            type: t.literal('initing')
        }), t.type({
            type: t.literal('pending'),
            session: t.string,
            link: t.string
        }), t.type({
            type: t.literal('online'),
            session: t.string,
            address: t.string
        })])
    }), t.type({
        type: t.literal('request'),
        id: t.number,
        name: t.string,
        opts: t.unknown
    }), t.type({
        type: t.literal('response'),
        id: t.number,
        data: t.unknown
    }), t.type({
        type: t.literal('failed'),
        id: t.number,
        text: t.string,
    })])
});

export type Message = t.TypeOf<typeof messageCodec>;

export function parseMessage(src: any): Message | null {
    if (messageCodec.is(src)) {
        return src;
    }
    return null;
}

export function serializeMessage(src: Message): any {
    if (messageCodec.is(src)) {
        return src;
    }
    throw Error('Invalid message')
}