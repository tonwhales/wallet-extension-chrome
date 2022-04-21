import * as React from 'react';
import { Pressable, Text } from 'react-native';
import { IS_TESTNET } from '../../api/client';

export const SimpleButton = React.memo((props: { title: string, onPress: () => void, color: string, disabled?: boolean, secondary?: boolean }) => {
    return (
        <Pressable
            onPress={props.onPress}
            disabled={props.disabled}
            style={(e) => ({
                opacity: e.pressed ? 0.6 : 1,
                backgroundColor: props.disabled ? '#333333' : props.color,
                paddingHorizontal: 32,
                height: 48,
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all .2s'
            })}
        >
            <span style={{ color: !props.disabled ? 'white' : '#666666', fontSize: 18, lineHeight: '20px', fontWeight: '700', transition: 'color .2s' }} >{props.title}</span>
        </Pressable>
    )
});