import React from "react";
import { Image } from 'react-native';
import { KnownWallet } from "./KnownWallets";

export const KnownAvatar = React.memo((props: { size: number, wallet: KnownWallet }) => {
    return (
        <img
            style={{
                width: props.size,
                height: props.size,
                borderRadius: props.size / 2,
                overflow: 'hidden'
            }}
            src={props.wallet.ic.replace('_next', 'next')}
        />
        // <div style={{
        //     backgroundImage: `url(${props.wallet.ic})`,
        //     width: props.size,
        //     height: props.size,
        //     borderRadius: props.size / 2,
        //     overflow: 'hidden'
        // }}>

        // </div>
    );
});