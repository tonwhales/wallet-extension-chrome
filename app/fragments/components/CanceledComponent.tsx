import React from "react"
import { View, Text } from "react-native"
import { HomeFragment } from "../HomeFragment";
import { SimpleButton } from "./SimpleButton";
import { useNavigation } from "./SimpleNavigation";

export const CanceledComponent = React.memo(() => {

    const navigation = useNavigation();

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: '130px' }}>
        <div style={{ width: '170px', marginBottom: '15px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#581C1C', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.28571 0L0 4.28571L10.7143 15L0 25.7143L4.28571 30L15 19.2857L25.7143 30L30 25.7143L19.2857 15L30 4.28571L25.7143 0L15 10.7143L4.28571 0Z" fill="#FE0101" />
                </svg>
            </div>
        </div>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <Text style={{ color: 'white', fontSize: 16, lineHeight: 20 }}>Transaction</Text>
            <Text style={{ color: 'white', fontSize: 16, lineHeight: 20 }}>has been canceled</Text>
            <View style={{ width: 210, marginTop: 120 }}>
                <SimpleButton title={'Close'} onPress={() => navigation.navigate(<HomeFragment />)} color={'#333333'} />
            </View>
        </div>
    </View>
    )
})