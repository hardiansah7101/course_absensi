import React, { useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Card, TextInput, Title, Button, Subheading, Checkbox } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { hp, wp } from "../../helpers/size.helper";
import LoadingPage from "../../components/LoadingPage.component";
import { ToastShow } from "../../helpers/toast.helper";
import axios from "axios";
import { API_URL } from "../../configs/baseurl.config";
import { StackActions } from '@react-navigation/native'
import { storeLoginData } from "../../helpers/authStorage.helper";
import { useDispatch } from "react-redux";
import { counterUser } from "../../redux/counter/user.counter";
import { defaultThemeColors } from "../../helpers/colors.helper";
import { GoogleSigninButton, GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { googleSigninConfig } from "../../configs/googleSignin.config";

export default function Login({ navigation, route }) {
    const dispatch = useDispatch()

    const [remember, setRemember] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    const handleSaveDataAuth = async (loginData, googleToken = null) => {
        const storeLogin = await storeLoginData({
            email,
            password,
            google_token: googleToken,
            access_token: loginData.access_token,
            refresh_token: loginData.refresh_token,
            scope: loginData.scope,
            token_type: loginData.token_type,
            expires_in: loginData.expires_in,
            remember: googleToken ? 1 : remember ? 1 : 0
        })
        setErrorMessage(null)
        setIsLoading(false)
        if (storeLogin) {
            ToastShow('LogIn successfully!')
            dispatch(counterUser.actions.resetData())

            navigation.dispatch(StackActions.replace('app-firstload'))
        } else {
            setErrorMessage('Failed to store login data!')
            ToastShow('Failed to store login data!')
            if (googleToken) {
                await GoogleSignin.signOut()
            }
        }
    }

    const handleLogIn = async () => {
        if (email == '' || password == '') {
            setErrorMessage('Enter email and password!')
            ToastShow('Enter email and password!')
            return
        }
        setErrorMessage(null)
        setIsLoading(true)
        try {
            const response = await axios.post(`${API_URL}/login-user`, { email, password })
            if (parseInt(response.data.status) == 200) {
                ToastShow('Login successfuly!')
                await handleSaveDataAuth(response.data.data)
            } else {
                ToastShow(response.data.message)
                setIsLoading(false)
            }
        } catch (error) {
            console.log(error)
            setErrorMessage('Something went wrong!')
            ToastShow('Something went wrong!')
            setIsLoading(false)
        }
    }

    const handleLoginGoogle = async () => {
        setIsLoading(true)
        try {
            GoogleSignin.configure(googleSigninConfig);
            await GoogleSignin.hasPlayServices();
            await GoogleSignin.signIn();
            if (await GoogleSignin.isSignedIn()) {
                const token = await GoogleSignin.getTokens()
                const payload = new FormData()
                payload.append('accessToken', token.accessToken)
                const response = await axios.post(`${API_URL}/login-user/signin_google`, payload, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                if (parseInt(response.data.status) == 200) {
                    ToastShow('Login successfuly!')
                    await handleSaveDataAuth(response.data, token.accessToken)
                } else {
                    await GoogleSignin.signOut()
                    ToastShow(response.data.message)
                    setIsLoading(false)
                }
            } else {
                ToastShow('Failed to login!')
                setIsLoading(false)
            }
        } catch (error) {
            console.log(error)
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
                ToastShow('operation (e.g. sign in) is in progress already!')
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
                ToastShow('Play services not available or outdated!')
            } else {
                // some other error happened
                ToastShow('Something wrong! ' + error)
            }
            if (await GoogleSignin.isSignedIn()) {
                await GoogleSignin.signOut()
            }
            setIsLoading(false)
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: defaultThemeColors.primary }}>
            <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ paddingTop: hp(25), paddingBottom: hp(10) }}>
                        <Title style={{ textAlign: "center", color: defaultThemeColors.surface, fontSize: wp(5) }}>LOGIN</Title>
                        <Card style={{ margin: wp(5), backgroundColor: 'transparent' }} elevation={0}>
                            <Card.Content>
                                {errorMessage && (
                                    <View style={{ paddingVertical: wp(5) }}>
                                        <Text style={{ color: defaultThemeColors.error, fontWeight: 'bold' }}>{errorMessage}</Text>
                                    </View>
                                )}
                                <View style={{ margin: wp(1) }}>
                                    <TextInput
                                        style={styles.textInput}
                                        label="Email"
                                        keyboardType="email-address"
                                        value={email}
                                        onChangeText={setEmail}
                                        left={<TextInput.Icon color={defaultThemeColors.onSurface} name="email" />}
                                    />
                                </View>
                                <View style={{ margin: wp(1) }}>
                                    <TextInput
                                        style={styles.textInput}
                                        label="Password"
                                        secureTextEntry={!showPassword}
                                        value={password}
                                        onChangeText={setPassword}
                                        left={<TextInput.Icon color={defaultThemeColors.onSurface} name="key" />}
                                        right={<TextInput.Icon color={defaultThemeColors.onSurface} name={!showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
                                    />
                                    <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center" }}>
                                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: "center", marginTop: wp(1) }} onPress={() => setRemember(!remember)}>
                                            <Checkbox status={remember ? 'checked' : 'unchecked'} color={defaultThemeColors.text} uncheckedColor={defaultThemeColors.text} />
                                            <Subheading style={{ textAlign: "center", color: defaultThemeColors.text, fontSize: wp(3) }}>Remember me</Subheading>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => navigation.navigate('app-forgot-password')}>
                                            <Subheading style={{ textAlign: "center", color: defaultThemeColors.text, fontSize: wp(3) }}>Forgot password?</Subheading>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <Button mode="contained" color={defaultThemeColors.backdrop} style={{ margin: wp(1), marginTop: wp(5), elevation: 0 }} contentStyle={{ paddingVertical: wp(1) }} labelStyle={{ fontSize: wp(3) }} onPress={handleLogIn}>
                                    Sign In
                                </Button>
                                <Subheading style={{ textAlign: "center", marginTop: wp(5), color: defaultThemeColors.backdrop, fontSize: wp(3) }}>Don't have account?</Subheading>
                                <Button style={{ alignSelf: "center" }} labelStyle={{ color: defaultThemeColors.surface, fontSize: wp(3) }} onPress={() => navigation.navigate('app-register')}>
                                    Sign Up
                                </Button>
                                <Subheading style={{ textAlign: "center", marginTop: wp(5), color: defaultThemeColors.backdrop, fontSize: wp(3) }}>Or</Subheading>
                                <GoogleSigninButton
                                    style={{ width: 192, height: 48, alignSelf: "center" }}
                                    size={GoogleSigninButton.Size.Wide}
                                    color={GoogleSigninButton.Color.Dark}
                                    onPress={handleLoginGoogle}
                                />
                            </Card.Content>
                        </Card>
                    </View>
                </ScrollView>
                <LoadingPage isLoading={isLoading} />
            </SafeAreaView>
        </View >
    )
}

const styles = StyleSheet.create({
    textInput: { backgroundColor: defaultThemeColors.surface, color: defaultThemeColors.onSurface },

})