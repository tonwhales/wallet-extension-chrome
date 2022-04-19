import * as React from 'react';
import { Pressable, Text } from 'react-native';

export const SimpleButton = React.memo((props: { title: string, onPress: () => void }) => {
    return (
        <Pressable
            onPress={props.onPress}
            style={(e) => ({
                opacity: e.pressed ? 0.6 : 1,
                backgroundColor: 'rgb(26, 149, 224)',
                paddingHorizontal: 32,
                height: 48,
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center'
            })}
        >
            <Text style={{ color: 'white', fontSize: 18 }} selectable={false}>{props.title}</Text>
        </Pressable>
    )
});