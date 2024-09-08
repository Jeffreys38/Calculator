import {Text, TouchableOpacity, TextStyle, StyleProp, View} from "react-native";

type ButtonConfig = {
    value: string,
    textColor: StyleProp<TextStyle>,
    btnStyle: StyleProp<TextStyle>,
    hint?: string,
    onPress: () => void
}

export function Button(buttonConfig: ButtonConfig) {
    return (
        <TouchableOpacity style={[
            buttonConfig.btnStyle,
            {position: 'relative'}
        ]} onPress={buttonConfig.onPress}>
            <Text style={[
                {
                    color: 'red',
                    position: 'absolute',
                    top: -15
                }
            ]}>
                {buttonConfig.hint}
            </Text>
            <Text style={[buttonConfig.textColor]}>
                {buttonConfig.value}
            </Text>
        </TouchableOpacity>
    )
}