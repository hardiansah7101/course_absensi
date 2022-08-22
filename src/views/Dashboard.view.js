import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { defaultThemeColors } from "../helpers/colors.helper";
import { useSelector } from "react-redux";
import { randomHello } from "../helpers/sentence.helper";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";
import { ButtonCheckInOut } from "../components/Button.component";
import * as Animatable from 'react-native-animatable'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'

const helloText = randomHello()

export default function Dashboard({ navigation }) {
    const tabBottomHeight = useBottomTabBarHeight()
    const isFocused = useIsFocused()
    const user = useSelector(state => state.user.data)

    const [dayToday, setDayToday] = useState(null)
    const [timeToday, setTimeToday] = useState(null)


    useEffect(() => {
        // removeAuthStorage()
        // console.log(user)
    }, [])

    useEffect(() => {
        if (isFocused) {
            setDayToday(`${moment().format('dddd, DD MMMM yyyy')}`)
            setTimeToday(`${moment().locale('en').format('hh:mm:ss A')}`)
            const interval = setInterval(() => {
                setDayToday(`${moment().format('dddd, DD MMMM yyyy')}`)
                setTimeToday(`${moment().locale('en').format('hh:mm:ss A')}`)
            }, 1000)

            return () => {
                clearInterval(interval)
            }
        }
    }, [isFocused])

    return (
        <View style={{ flex: 1, backgroundColor: defaultThemeColors.surface, padding: 20, paddingBottom: tabBottomHeight + 20 }}>
            <Animatable.View useNativeDriver animation="fadeInDown" direction="alternate" style={{ backgroundColor: defaultThemeColors.primaryLight2, padding: 20, borderRadius: 20 }}>
                <Text style={{ fontSize: 28, fontWeight: 'bold', color: defaultThemeColors.placeholder }}>Hello, {user?.fullname + '...'}</Text>
                <Text style={{ fontSize: 20, color: defaultThemeColors.placeholder }}>{helloText}</Text>
            </Animatable.View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20, paddingHorizontal: 10 }}>
                <Animatable.Text useNativeDriver animation="fadeIn" direction="alternate" duration={2000} style={{ fontSize: 16 }}>{dayToday}</Animatable.Text>
                <Animatable.Text useNativeDriver animation="fadeIn" direction="alternate" duration={2000} style={{ fontSize: 16 }}>{timeToday}</Animatable.Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 20, height: 100 }}>
                <View style={{ flex: 1 }}>
                    <Animatable.View style={{ flex: 1 }} useNativeDriver animation="fadeInLeft" direction="alternate">
                        <ButtonCheckInOut materialIconName="application-edit-outline" title="Check In" onPress={() => navigation.navigate('app-check-in-out', { type: 'in' })} />
                    </Animatable.View>
                </View>
                <View style={{ flex: 1 }}>
                    <Animatable.View style={{ flex: 1 }} useNativeDriver animation="fadeInRight" direction="alternate">
                        <ButtonCheckInOut materialIconName="application-edit-outline" title="Check Out" onPress={() => navigation.navigate('app-check-in-out', { type: 'out' })} />
                    </Animatable.View>
                </View>
            </View>
            <View style={{ flex: 1 }}>
                <Animatable.View animation="fadeInUp" direction="alternate" style={{ flex: 1, backgroundColor: defaultThemeColors.primaryLight3, padding: 20, borderRadius: 20 }}>
                    <FlatList
                        data={[]}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <></>
                        )}
                    />
                </Animatable.View>
            </View>
        </View>
    )
}