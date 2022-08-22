import React, { useEffect, useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Card, TextInput, Title, Button, Subheading, Checkbox } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from 'react-native-animatable'
import { useIsFocused } from '@react-navigation/native'
import { hp } from "../../helpers/size.helper";
import LoadingPage from "../../components/LoadingPage.component";
import { ToastShow } from "../../helpers/toast.helper";
import axios from "axios";
import { API_URL } from "../../configs/baseurl.config";
import { StackActions } from '@react-navigation/native'
import { storeLoginData } from "../../helpers/authStorage.helper";
import { useDispatch } from "react-redux";
import { counterUser } from "../../redux/counter/user.counter";
import { defaultThemeColors } from "../../helpers/colors.helper";

export default function Login({ navigation, route }) {
    const isFocused = useIsFocused()
    const dispatch = useDispatch()

    const refViewTitle = useRef()
    const refViewEmail = useRef()
    const refViewPassword = useRef()
    const refViewSubmit = useRef()
    const refBtnSubmit = useRef()

    const [remember, setRemember] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    const handleAnimatedIn = () => {
        refViewTitle.current?.fadeInDown(1000)
        refViewEmail.current?.fadeInLeft(1000)
        refViewPassword.current?.fadeInRight(1000)
        refViewSubmit.current?.fadeInUp(1000)
    }

    const handleAnimatedOut = () => {
        refViewTitle.current?.fadeOutUp(500)
        refViewEmail.current?.fadeOutLeft(500)
        refViewPassword.current?.fadeOutRight(500)
        refViewSubmit.current?.fadeOutDown(500)
    }

    useEffect(() => {
        isFocused && handleAnimatedIn()
    }, [isFocused])

    const handleSaveDataAuth = async (loginData) => {
        const storeLogin = await storeLoginData({
            email,
            password,
            access_token: loginData.access_token,
            refresh_token: loginData.refresh_token,
            scope: loginData.scope,
            token_type: loginData.token_type,
            expires_in: loginData.expires_in,
            remember: remember ? 1 : 0
        })
        setErrorMessage(null)
        setIsLoading(false)
        if (storeLogin) {
            ToastShow('LogIn successfully!')
            dispatch(counterUser.actions.resetData())
            handleAnimatedOut()
            setTimeout(() => {
                navigation.dispatch(StackActions.replace('app-firstload'))
            }, 500)
        } else {
            setErrorMessage('Failed to store login data!')
            ToastShow('Failed to store login data!')
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

    return (
        <View style={{ flex: 1, backgroundColor: defaultThemeColors.primary }}>
            <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ paddingTop: hp(25), paddingBottom: hp(10) }}>
                        <Animatable.View useNativeDriver animation="fadeInDown" ref={refViewTitle} direction="alternate">
                            <Title style={{ textAlign: "center", color: defaultThemeColors.backdrop }}>LOGIN</Title>
                        </Animatable.View>
                        <Card style={{ margin: 20, backgroundColor: 'transparent' }} elevation={0}>
                            <Card.Content>
                                {errorMessage && (
                                    <View style={{ paddingVertical: 20 }}>
                                        <Text style={{ color: defaultThemeColors.error, fontWeight: 'bold' }}>{errorMessage}</Text>
                                    </View>
                                )}
                                <Animatable.View useNativeDriver animation="fadeInLeft" ref={refViewEmail} direction="alternate" style={{ margin: 5 }}>
                                    <TextInput
                                        style={{ backgroundColor: defaultThemeColors.surface }}
                                        label="Email"
                                        value={email}
                                        onChangeText={setEmail}
                                        left={<TextInput.Icon name="email" />}
                                    />
                                </Animatable.View>
                                <Animatable.View useNativeDriver animation="fadeInRight" ref={refViewPassword} direction="alternate" style={{ margin: 5 }}>
                                    <TextInput
                                        style={{ backgroundColor: defaultThemeColors.surface }}
                                        label="Password"
                                        secureTextEntry={!showPassword}
                                        value={password}
                                        onChangeText={setPassword}
                                        left={<TextInput.Icon name="key" />}
                                        right={<TextInput.Icon name={!showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
                                    />
                                    <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: "center", marginTop: 5 }} onPress={() => {
                                            setRemember(!remember)
                                        }}>
                                            <Checkbox status={remember ? 'checked' : 'unchecked'} color={defaultThemeColors.text} uncheckedColor={defaultThemeColors.text} />
                                            <Subheading style={{ textAlign: "center", color: defaultThemeColors.text }}>Remember me</Subheading>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ marginTop: 10 }} onPress={() => {
                                            handleAnimatedOut()
                                            setTimeout(() => {
                                                navigation.navigate('app-forgot-password')
                                            }, 500)
                                        }}>
                                            <Subheading style={{ textAlign: "center", color: defaultThemeColors.text }}>Forgot password?</Subheading>
                                        </TouchableOpacity>
                                    </View>
                                </Animatable.View>
                                <Animatable.View useNativeDriver animation="fadeInUp" ref={refViewSubmit} direction="alternate">
                                    <Animatable.View useNativeDriver ref={refBtnSubmit} direction="alternate">
                                        <Button mode="contained" color={defaultThemeColors.backdrop} style={{ margin: 5, marginTop: 20, elevation: 0 }} contentStyle={{ paddingVertical: 5 }} onPress={() => {
                                            refBtnSubmit.current?.pulse(300).then(() => {
                                                handleLogIn()
                                            })
                                        }}>
                                            Sign In
                                        </Button>
                                    </Animatable.View>
                                    <Subheading style={{ textAlign: "center", marginTop: 10, color: defaultThemeColors.backdrop }}>Don't have account?</Subheading>
                                    <Button style={{ alignSelf: "center" }} labelStyle={{ color: defaultThemeColors.backdrop }} onPress={() => {
                                        handleAnimatedOut()
                                        setTimeout(() => {
                                            navigation.navigate('app-register')
                                        }, 500)
                                    }}>
                                        Sign Up
                                    </Button>
                                </Animatable.View>
                            </Card.Content>
                        </Card>
                    </View>
                </ScrollView>
                <LoadingPage isLoading={isLoading} />
            </SafeAreaView>
        </View>
    )
}