import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { defaultThemeColors } from "../helpers/colors.helper";
import { wp } from "../helpers/size.helper";
import moment from "moment";
import { MaterialCommunityIcons } from "@expo/vector-icons"

export const ListDataHistory = ({
    data,
}) => {
    const navigation = useNavigation()

    return (
        <TouchableOpacity activeOpacity={0.8} style={{ paddingHorizontal: wp(5), paddingVertical: wp(2) }} onPress={() => navigation.navigate('app-history-detail', { data })}>
            <View style={{ borderBottomWidth: 1, borderBottomColor: defaultThemeColors.backdrop, flexDirection: 'row', alignItems: "center", paddingBottom: wp(1) }}>
                <View style={{ height: wp(8), width: wp(8), borderRadius: wp(4), backgroundColor: defaultThemeColors.primary, justifyContent: "center", alignItems: "center" }}>
                    <MaterialCommunityIcons name="application-edit-outline" color={defaultThemeColors.surface} size={wp(4)} />
                </View>
                <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: wp(2) }}>
                    <Text style={{ fontSize: wp(3), fontWeight: 'bold' }}>{moment(data.date).format('DD/MM/YYYY')}</Text>
                    <Text style={{ fontSize: wp(3) }}>Your {data.type.replace('_', ' ').toUpperCase()} has been submited!</Text>
                </View>
                <Text style={{ fontWeight: 'bold', fontSize: wp(3), color: defaultThemeColors.primary, alignSelf: 'flex-end' }}>{data.type.replace('_', ' ').toUpperCase()}</Text>
            </View>
        </TouchableOpacity>
    )
}