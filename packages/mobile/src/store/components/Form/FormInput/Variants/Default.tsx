import React, { FC } from 'react';
import { View, Text } from 'react-native';
import TextInput from '../../../ui/Input/Input';
import { TextInputProps } from '../../../ui/Input/types';

const DefaultTextInput: FC<TextInputProps> = (props) => {
    return <View>
        <Text style={props.styles?.placeholder}>{props.placeholder}</Text>
        <View style={props.styles?.inputContainer}>
            <TextInput
                styles={props.styles?.input}
                isInvalid={props.isInvalid}
                onChangeText={props.onChangeText}
                value={props.value}
            />
        </View>
    </View>
}

export default DefaultTextInput