import React from "react";
import { Text, View } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { defaultThemeColors } from "../helpers/colors.helper";

export const ButtonCheckInOut = ({
    materialIconName,
    title,
    description,
    disable = false,
    onPress
}) => {
    return (
        <View style={{ flex: 1, margin: 5, borderRadius: 20, overflow: 'hidden', backgroundColor: defaultThemeColors.primaryLight1 }}>
            <TouchableRipple style={{ flex: 1, padding: 20, }} onPress={onPress} disabled={disable} >
                <View style={{ flex: 1, flexDirection: 'row', alignItems: "center" }}>
                    <MaterialCommunityIcons name={materialIconName} size={50} color={defaultThemeColors.placeholder} />
                    <View style={{ flex: 1, paddingLeft: 15 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: defaultThemeColors.placeholder }}>{title}</Text>
                        {description && (
                            <Text style={{ fontSize: 20, color: defaultThemeColors.placeholder }}>{description}</Text>
                        )}
                    </View>
                </View>
            </TouchableRipple>
        </View>
    )
}

export const ButtonItemHistory = ({
    materialIconName = null,
    title,
    description,
    disable = false,
    onPress
}) => {
    return (
        <View style={{ flex: 1, margin: 5, borderRadius: 20, overflow: 'hidden', backgroundColor: defaultThemeColors.primaryLight1 }}>
            <TouchableRipple style={{ flex: 1, padding: 20, }} onPress={onPress} disabled={disable} >
                <View style={{ flex: 1, flexDirection: 'row', alignItems: "center" }}>
                    <MaterialCommunityIcons name={materialIconName} size={50} color={defaultThemeColors.placeholder} />
                    <View style={{ flex: 1, paddingLeft: 15 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: defaultThemeColors.placeholder }}>{title}</Text>
                        {description && (
                            <Text style={{ fontSize: 20, color: defaultThemeColors.placeholder }}>{description}</Text>
                        )}
                    </View>
                </View>
            </TouchableRipple>
        </View>
    )
}