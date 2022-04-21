import BN from "bn.js"
import React from "react"
import { View, Text } from "react-native"
import { Address } from "ton"
import { Config } from "../../Config"
import { useBalance } from "../../model/useBalance"
import { KnownAvatar } from "../../utils/KnownAvatar"
import { KnownWallets } from "../../utils/KnownWallets"
import { HomeFragment } from "../HomeFragment"
import { Avatar } from "./Avatar"
import { SimpleButton } from "./SimpleButton"
import { useNavigation } from "./SimpleNavigation"
import { ValueComponent } from "./ValueComponent"

export const ConfirmedComponent = React.memo((props: { wallet: Address, amount: BN }) => {

    const balance = useBalance()
    const navigation = useNavigation();

    let known = props.wallet ? KnownWallets[props.wallet.toFriendly({ testOnly: Config.testnet })] : undefined;

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: '130px' }}>
            <div style={{ width: '170px', marginBottom: '15px', display: 'flex', justifyContent: 'center' }}>
                {!known && (<Avatar id={props.wallet.toFriendly()} size={80} />)}
                {known && <KnownAvatar size={80} wallet={known} />}
            </div>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Text style={{ lineHeight: 36, color: 'white', fontSize: 30, fontWeight: '700', marginBottom: 8, alignSelf: 'center' }}>
                    -<ValueComponent value={props.amount.toString(10)} />
                </Text>
                <Text style={{ lineHeight: 20, fontWeight: '500', color: 'white', fontSize: 16, alignSelf: 'center' }}>
                    -<ValueComponent value={props.amount.toString(10)} usd={balance.balanceUSD} />
                </Text>
                <View style={{ width: 210, marginTop: 120 }}>
                    <SimpleButton title={'Close'} onPress={() => navigation.navigate(<HomeFragment />)} />
                </View>
            </div>
        </View>
    )
})