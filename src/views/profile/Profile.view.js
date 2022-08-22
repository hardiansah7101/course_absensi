import React, { useEffect } from "react";
import { Alert, Image, Platform, Text, View } from "react-native";
import { defaultThemeColors } from "../../helpers/colors.helper";
import { Button, Headline, Subheading } from 'react-native-paper'
import * as Animatable from 'react-native-animatable'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useSelector, useDispatch } from "react-redux";
import { thunkLogout } from "../../redux/action/user.action";
import { counterConstant } from "../../redux/counter/constant.counter";
import { StackActions } from "@react-navigation/native";

export default function Profile({ navigation }) {
    const tabBottomHeight = useBottomTabBarHeight()
    const user = useSelector(state => state.user.data)
    const { loading } = useSelector(state => state.constant)
    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(counterConstant.actions.setLoading(true))
        dispatch(thunkLogout())
        setTimeout(() => {
            dispatch(counterConstant.actions.setLoading(false))
            navigation.dispatch(StackActions.replace('app-firstload'))
        }, 3000)
    }

    const handleLogoutConfirm = () => {
        if (Platform.OS === 'web') {
            confirm('Are you sure?') && handleLogout()
        } else {
            Alert.alert('Logout', 'Are you sure?', [
                {
                    text: 'Continue',
                    onPress: () => {
                        handleLogout()
                    }
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                }
            ])
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: defaultThemeColors.surface, padding: 20, paddingBottom: tabBottomHeight + 20, justifyContent: 'space-between' }}>
            <Animatable.View useNativeDriver animation="fadeInDown" direction="alternate" style={{ backgroundColor: defaultThemeColors.primaryLight2, padding: 20, borderRadius: 20 }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ height: 100, width: 100, borderRadius: 50, overflow: 'hidden', backgroundColor: defaultThemeColors.primaryLight1, marginRight: 20 }}>
                        <Image
                            source={{ uri: user?.photo || 'https://cdn-icons-png.flaticon.com/128/4333/4333609.png' }}
                            style={{ width: 100, height: 100 }}
                            resizeMode="cover"
                        />
                    </View>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <Headline numberOfLines={2}>{user?.fullname}</Headline>
                        <View style={{ marginTop: 10 }}>
                            <Subheading style={{ fontWeight: 'bold' }} numberOfLines={1}>Email</Subheading>
                            <Subheading numberOfLines={1}>{user?.username}</Subheading>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <Subheading style={{ fontWeight: 'bold' }} numberOfLines={1}>Phone</Subheading>
                            <Subheading numberOfLines={1}>{user?.phone_number}</Subheading>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <Subheading style={{ fontWeight: 'bold' }} numberOfLines={1}>Gender</Subheading>
                            <Subheading numberOfLines={1}>{user?.gender}</Subheading>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <Subheading style={{ fontWeight: 'bold' }} numberOfLines={1}>Location</Subheading>
                            <Subheading numberOfLines={1}>{user?.region}</Subheading>
                        </View>

                    </View>
                </View>
            </Animatable.View>
            <View>
                <Animatable.View useNativeDriver animation="fadeInUp" direction="alternate">
                    <Button mode="contained" color={defaultThemeColors.notification} style={{ margin: 5, elevation: 0 }} labelStyle={{ color: defaultThemeColors.surface }} contentStyle={{ paddingVertical: 5 }} onPress={handleLogoutConfirm}>
                        Logout
                    </Button>
                </Animatable.View>
            </View>
        </View>
    )
}