import React, { useEffect, useRef } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { StackActions } from '@react-navigation/native'
import * as Animatable from 'react-native-animatable'
import { defaultThemeColors } from "../helpers/colors.helper";
import { getThunkUser } from "../redux/action/user.action";

export default function Firstload({ navigation }) {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)

    const refTitle = useRef()
    const refLoading = useRef()

    const handleAnimatedOut = () => {
        refTitle.current?.fadeOutUp(500)
        refLoading.current?.fadeOutDown(500)
    }

    useEffect(() => {
        setTimeout(() => {
            dispatch(getThunkUser())
        }, 2000)
    }, [])

    const handleOpenPage = (route) => {
        handleAnimatedOut()
        setTimeout(() => {
            navigation.dispatch(StackActions.replace(route))
        }, 800)
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
                <Animatable.View useNativeDriver ref={refTitle} animation="fadeInDown" direction="alternate">
                    <Text style={{ textAlign: "center", color: defaultThemeColors.surface, fontSize: 30 }}>ABSENSI</Text>
                </Animatable.View>
            </View>
            <Animatable.View useNativeDriver ref={refLoading} animation="fadeInUp" direction="alternate">
                <View style={{ alignItems: "center", paddingBottom: 100 }}>
                    <ActivityIndicator color={defaultThemeColors.surface} size={30} />
                    <Text style={{ color: defaultThemeColors.surface, marginTop: 5 }}>Please wait...</Text>
                </View>
            </Animatable.View>
        </View>
    )
}