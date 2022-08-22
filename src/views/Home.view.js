import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { defaultThemeColors } from "../helpers/colors.helper";
// import { useSelector } from "react-redux";
import Dashboard from "./Dashboard.view";
import Profile from "./profile/Profile.view";
import History from "./history/History.view";

const Tab = createBottomTabNavigator()

export default function Home() {
    // const user = useSelector(state => state.user.data)

    return (
        <Tab.Navigator initialRouteName="tab-dashboard" screenOptions={defaultTabOption}>
            <Tab.Screen name="tab-dashboard" component={Dashboard} options={{
                title: 'DASHBOARD',
                tabBarIcon: ({ focused, size }) => (
                    <MaterialCommunityIcons name="home-circle" color={tabIconColor(focused)} size={tabIconSize(focused, size)} />
                )
            }} />
            <Tab.Screen name="tab-history" component={History} options={{
                title: 'HISTORY',
                tabBarIcon: ({ focused, size }) => (
                    <MaterialCommunityIcons name="history" color={tabIconColor(focused)} size={tabIconSize(focused, size)} />
                )
            }} />
            <Tab.Screen name="tab-profile" component={Profile} options={{
                title: 'PROFILE',
                tabBarIcon: ({ focused, size }) => (
                    <MaterialCommunityIcons name="account-circle" color={tabIconColor(focused)} size={tabIconSize(focused, size)} />
                )
            }} />
        </Tab.Navigator>
    )
}

const defaultTabOption = {
    headerShadowVisible: false,
    headerTintColor: defaultThemeColors.surface,
    headerStyle: {
        backgroundColor: defaultThemeColors.primary
    },
    headerTitleStyle: {
        fontWeight: 'bold'
    },
    tabBarStyle: {
        position: 'absolute',
        borderTopWidth: 0,
        marginBottom: 5,
        elevation: 0,
        marginHorizontal: 10,
        backgroundColor: defaultThemeColors.primary,
        borderRadius: 20,
        elevation: 5,
    },
    tabBarShowLabel: false,
}

const tabIconColor = (focused) => focused ? defaultThemeColors.surface : defaultThemeColors.backdrop
const tabIconSize = (focused, size) => focused ? size * 1.35 : size