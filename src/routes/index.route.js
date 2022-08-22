import { NavigationContainer, useNavigation, StackActions, useRoute } from "@react-navigation/native";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import React, { Fragment, useEffect } from "react";
import routeList from "./list.route";
import { useSelector, useDispatch } from "react-redux";
import { Alert, Platform } from "react-native";
import { removeAuthStorage } from "../helpers/authStorage.helper";
import { counterUser } from "../redux/counter/user.counter";
import LoadingPage from "../components/LoadingPage.component";
import { defaultThemeColors } from "../helpers/colors.helper";

const Stack = createStackNavigator()

function StackNavigator() {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const constant = useSelector((state) => state.constant)

    const handleNeedRelogin = async () => {
        await removeAuthStorage()
        dispatch(counterUser.actions.resetData())
        navigation.dispatch(StackActions.popToTop())
        navigation.dispatch(StackActions.replace('app-firstload'))
    }

    const confirmRelogin = async () => {
        if (Platform.OS === 'web') {
            alert("You need re-login to continue access this application!")
            await handleNeedRelogin();
        } else {
            Alert.alert("", "You need re-login to continue access this application!", [
                {
                    text: 'OK',
                    onPress: async () => {
                        await handleNeedRelogin()
                    }
                }
            ])
        }
    }

    useEffect(() => {
        console.log(user)
        if (user.relogin) {
            confirmRelogin()
        }
    }, [user.relogin])

    return (
        <Fragment>
            <Stack.Navigator initialRouteName="app-firstload" screenOptions={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
            }}>
                <Stack.Screen name="app-firstload" component={routeList.Firstload} />

                {/* Auth */}
                <Stack.Screen name="app-login" component={routeList.Login} />
                <Stack.Screen name="app-register" component={routeList.Register} />
                <Stack.Screen name="app-forgot-password" component={routeList.ForgotPassword} />
                <Stack.Screen name="app-relogin-password" component={routeList.ReLoginPassword} />

                {/* Home */}
                <Stack.Screen name="app-home" component={routeList.Home} />

                <Stack.Group screenOptions={{
                    headerShown: true,
                    headerShadowVisible: false,
                    headerTintColor: defaultThemeColors.surface,
                    headerStyle: {
                        backgroundColor: defaultThemeColors.primary
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold'
                    },
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                }}>
                    <Stack.Screen name="app-check-in-out" component={routeList.CheckInOut} options={({ route }) => ({
                        title: ("Check " + route.params.type).toUpperCase()
                    })} />
                    <Stack.Screen name="app-history-detail" component={routeList.HistoryDetail} options={({ route }) => ({
                        title: ("Detail " + route.params.data.type.replace('_', ' ')).toUpperCase()
                    })} />
                </Stack.Group>

            </Stack.Navigator>
            <LoadingPage isLoading={constant.loading} />
        </Fragment>
    )
}

export default function Route() {
    return (
        <NavigationContainer>
            <StackNavigator />
        </NavigationContainer>
    )
}