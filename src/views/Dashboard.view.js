import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { defaultThemeColors } from "../helpers/colors.helper";
import { useSelector } from "react-redux";
import { randomHello } from "../helpers/sentence.helper";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";
import { ButtonCheckInOut } from "../components/Button.component";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { wp } from "../helpers/size.helper";

const helloText = randomHello()

export default function Dashboard({ navigation }) {
    const tabBottomHeight = useBottomTabBarHeight()
    const isFocused = useIsFocused()
    const user = useSelector(state => state.user.data)

    const [dayToday, setDayToday] = useState(null)
    const [timeToday, setTimeToday] = useState(null)

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
        <View style={{ flex: 1, backgroundColor: defaultThemeColors.surface, padding: wp(3), paddingBottom: tabBottomHeight + wp(3) }}>
            <View style={{ backgroundColor: defaultThemeColors.primaryLight2, padding: wp(3), borderRadius: wp(3) }}>
                <Text style={{ fontSize: wp(5), fontWeight: 'bold', color: defaultThemeColors.onSurface }}>Hello, {user?.fullname + '...'}</Text>
                <Text style={{ fontSize: wp(3), color: defaultThemeColors.onSurface }}>{helloText}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: wp(3), paddingHorizontal: wp(3) }}>
                <Text style={{ fontSize: wp(4) }}>{dayToday}</Text>
                <Text style={{ fontSize: wp(4) }}>{timeToday}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: wp(3), height: wp(20) }}>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <ButtonCheckInOut materialIconName="application-edit-outline" title="Check In" onPress={() => navigation.navigate('app-check-in-out', { type: 'in' })} />
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <ButtonCheckInOut materialIconName="application-edit-outline" title="Check Out" onPress={() => navigation.navigate('app-check-in-out', { type: 'out' })} />
                    </View>
                </View>
            </View>
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: defaultThemeColors.primaryLight3, padding: wp(3), borderRadius: wp(3) }}>
                    <FlatList
                        data={[]}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <></>
                        )}
                    />
                </View>
            </View>
        </View>
    )
}