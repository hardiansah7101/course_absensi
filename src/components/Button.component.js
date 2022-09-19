import React from "react";
import { Text, View } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { defaultThemeColors } from "../helpers/colors.helper";
import { wp } from "../helpers/size.helper";

export const ButtonCheckInOut = ({
    materialIconName,
    title,
    description,
    disable = false,
    onPress
}) => {
    return (
        <View style={{ flex: 1, margin: wp(1), borderRadius: wp(4), overflow: 'hidden', backgroundColor: defaultThemeColors.primaryLight1 }}>
            <TouchableRipple style={{ flex: 1, padding: wp(4), }} onPress={onPress} disabled={disable} >
                <View style={{ flex: 1, flexDirection: 'row', alignItems: "center" }}>
                    <MaterialCommunityIcons name={materialIconName} size={wp(10)} color={defaultThemeColors.onSurface} />
                    <View style={{ flex: 1, paddingLeft: wp(3) }}>
                        <Text style={{ fontSize: wp(4), fontWeight: 'bold', color: defaultThemeColors.onSurface }}>{title}</Text>
                        {description && (
                            <Text style={{ fontSize: wp(4), color: defaultThemeColors.onSurface }}>{description}</Text>
                        )}
                    </View>
                </View>
            </TouchableRipple>
        </View>
    )
}