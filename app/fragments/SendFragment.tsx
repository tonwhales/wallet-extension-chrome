import * as React from 'react';
import { View } from 'react-native';
import { SimpleButton } from './components/SimpleButton';
import { useNavigation } from './components/SimpleNavigation';

export const SendFragment = React.memo(() => {
    const navigation = useNavigation();
    return (
        <View>
            <SimpleButton title="Back" onPress={navigation.back} />
        </View>
    );
});