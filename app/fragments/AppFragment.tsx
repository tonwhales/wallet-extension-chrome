import * as React from 'react';
import { useDetectLogout } from '../model/useDetectLogout';
import { DarkTheme, NavigationContainer, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeFragment } from './HomeFragment';
import { IS_TESTNET } from '../api/client';

const Stack = createNativeStackNavigator();
const theme: Theme = {
    ...DarkTheme
}

export const AppFragment = React.memo(() => {
    useDetectLogout();
    return (
        <NavigationContainer theme={theme}>
            <Stack.Navigator>
                <Stack.Screen
                    name="Home"
                    component={HomeFragment}
                    options={{ title: IS_TESTNET ? 'Ton Dev Web Wallet' : 'Tonhub Web Wallet' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
});