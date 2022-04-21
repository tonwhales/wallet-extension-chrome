import React from "react"
import { View, Text } from "react-native"
import Lottie from 'lottie-react';

export const SentComponent = React.memo(() => {

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: '100px' }}>
            <div style={{ width: '170px', marginBottom: '15px', display: 'flex', justifyContent: 'center' }}>
                <Lottie
                    animationData={require('../components/images/AnimatedSticker.json')}
                    loop={true}
                />
            </div>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Text style={{ color: 'white', fontSize: 16, lineHeight: 20 }}>Transaction created!</Text>
                <Text style={{ color: 'white', fontSize: 16, lineHeight: 20 }}>Сonfirm it in the Tonhub App</Text>
            </div>
        </View>
    )
})