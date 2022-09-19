import React, { useEffect, useRef } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { StackActions } from '@react-navigation/native'
import { defaultThemeColors } from "../helpers/colors.helper";
import { getThunkUser } from "../redux/action/user.action";

export default function Firstload({ navigation }) {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)

    useEffect(() => {
        setTimeout(() => {
            dispatch(getThunkUser())
        }, 2000)
    }, [])

    const handleOpenPage = (route) => {
        navigation.dispatch(StackActions.replace(route))
    }

    useEffect(() => {
        if (!user.loading && user.data) {
            handleOpenPage('app-home')
        } else if (!user.loading && !user.data) {
            handleOpenPage('app-login')
        }
    }, [user])

    return (
        <View style={{ flex: 1, backgroundColor: defaultThemeColors.primary }}>
            <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
                <Text style={{ textAlign: "center", color: defaultThemeColors.surface, fontSize: 30 }}>ABSENSI</Text>
            </View>
            <View style={{ alignItems: "center", paddingBottom: 100 }}>
                <ActivityIndicator color={defaultThemeColors.surface} size={30} />
                <Text style={{ color: defaultThemeColors.surface, marginTop: 5 }}>Please wait...</Text>
            </View>
        </View>
    )
}