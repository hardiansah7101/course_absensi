import React from "react";
import { Modal, Text, View } from "react-native";
import { defaultThemeColors } from "../helpers/colors.helper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { wp } from "../helpers/size.helper";
import { Button } from "react-native-paper";

export const PopupMessage = ({
    visible,
    type = 'success',
    message = "Success",
    showBtn = true,
    btnText = 'Okay',
    onBtnPress = () => { }
}) => {
    const color = type == 'success' ? defaultThemeColors.primary : type == 'error' ? defaultThemeColors.error : defaultThemeColors.notification;
    const iconName = type == 'success' ? "check-circle" : type == 'error' ? 'close-circle' : 'alert-circle';
    
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(1,1,1,0.4)' }}>
                <View style={{ width: wp(80), alignItems: "center", backgroundColor: defaultThemeColors.surface, padding: wp(10), borderRadius: 20, elevation: 3 }}>
                    <MaterialCommunityIcons name={iconName} size={wp(20)} color={color} />

                    <Text style={{ fontSize: wp(4), fontWeight: 'bold', marginBottom: wp(10) }}>{message}</Text>
                    
                    {showBtn && (
                        <Button mode="contained" color={color} contentStyle={{ paddingVertical: 5 }} labelStyle={{ color: defaultThemeColors.surface }} onPress={onBtnPress}>
                            {btnText}
                        </Button>
                    )}
                </View>
            </View>
        </Modal>
    )
}