import React, { useEffect, useRef, useState } from "react";
import { BackHandler, FlatList, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Card, TextInput, Title, Button, Subheading, List } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { hp, wp } from "../../helpers/size.helper";
import * as Animatable from 'react-native-animatable'
import LoadingPage from "../../components/LoadingPage.component";
import axios from "axios";
import { API_URL } from "../../configs/baseurl.config";
import { ToastShow } from "../../helpers/toast.helper";
import { StackActions } from '@react-navigation/native'
import { storeAuthToken, storeLoginData, storeRefreshToken } from "../../helpers/authStorage.helper";
import { defaultThemeColors } from "../../helpers/colors.helper";
import SelectGender from "../../components/SelectGender.component";
import { useDispatch } from "react-redux";

export default function Register({ navigation }) {
    const dispatch = useDispatch()
    
    const refViewTitle = useRef()
    const refViewName = useRef()
    const refViewEmail = useRef()
    const refViewDomicile = useRef()
    const refViewPhoneNumber = useRef()
    const refViewGender = useRef()
    const refViewPassword = useRef()
    const refViewPasswordConfirm = useRef()
    // const refViewInterest = useRef()
    const refViewSubmit = useRef()

    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [domicile, setDomicile] = useState('')
    const [gender, setGender] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')

    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

    const [modalSelectGender, setModalSelectGender] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [errorMessage, setErrorMessage] = useState(null)

    const handleAnimatedOut = () => {
        refViewTitle.current?.fadeOutUp(500)
        refViewName.current?.fadeOutLeft(500)
        refViewEmail.current?.fadeOutRight(500)
        refViewDomicile.current?.fadeOutLeft(500)
        refViewGender.current?.fadeOutRight(500)
        refViewPhoneNumber.current?.fadeOutLeft(500)
        refViewPassword.current?.fadeOutRight(500)
        refViewPasswordConfirm.current?.fadeOutLeft(500)
        refViewSubmit.current?.fadeOutDown(500)
    }

    const handleBack = (top = false) => {
        handleAnimatedOut()
        setTimeout(() => {
            navigation.goBack()
            if (top) {
                console.log(top)
                dispatch(counterUser.actions.resetData())
                navigation.dispatch(StackActions.replace('app-firstload'))
            }
        }, 500)
    }

    useEffect(() => {
        const unsubscribe = BackHandler.addEventListener("hardwareBackPress", () => {
            handleBack()
            return true;
        })

        return () => unsubscribe.remove()
    }, [])

    const handleSignUp = async () => {
        if (email == '' || name == '' || phoneNumber == '' || domicile == '' || gender == '' || password == '' || passwordConfirm == '') {
            setErrorMessage('Masukkan data dengan lengkap!')
            ToastShow('Masukkan data dengan lengkap!')
            return
        } else if (password != passwordConfirm) {
            setErrorMessage('Konfirmasi password salah!')
            ToastShow('Konfirmasi password salah!')
            return
        }

        setErrorMessage(null)
        setIsLoading(true)
        try {
            const response = await axios.post(`${API_URL}/register`, {
                email: email,
                name: name,
                phone_number: phoneNumber,
                domicile: domicile,
                gender: gender,
                password: password,
                interest: 'Backend | QA',
            });

            setIsLoading(false)
            if (response.data.status == '200') {
                ToastShow('Register success!')

                const loginData = response.data.data

                await storeLoginData({
                    email,
                    password,
                    access_token: loginData.access_token,
                    refresh_token: loginData.refresh_token,
                    scope: loginData.scope,
                    token_type: loginData.token_type,
                    expires_in: loginData.expires_in,
                    remember: false
                })
                handleBack(true)
            } else {
                setErrorMessage(response.data.message)
                ToastShow(response.data.message)
            }
        } catch (error) {
            console.log(error)
            setErrorMessage('Terjadi kesalahan saat mengirim data ke server')
            ToastShow('Terjadi kesalahan saat mengirim data ke server')
            setIsLoading(false)
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: defaultThemeColors.primary }}>
            <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Animatable.View useNativeDriver ref={refViewTitle} animation="fadeInDown" direction="alternate">
                        <Title style={{ textAlign: "center", marginTop: hp(5), color: defaultThemeColors.backdrop }}>Register</Title>
                    </Animatable.View>
                    <Card style={{ margin: 20, backgroundColor: 'transparent' }} elevation={0}>
                        <Card.Content>
                            {errorMessage && (
                                <View style={{ paddingVertical: 20 }}>
                                    <Text style={{ color: defaultThemeColors.error, fontWeight: 'bold' }}>{errorMessage}</Text>
                                </View>
                            )}
                            <Animatable.View useNativeDriver ref={refViewName} animation="fadeInLeft" direction="alternate" style={{ paddingVertical: 10 }}>
                                <TextInput
                                    label="Full Name"
                                    value={name}
                                    onChangeText={setName}
                                    style={{ backgroundColor: 'white' }}
                                />
                            </Animatable.View>
                            <Animatable.View useNativeDriver ref={refViewEmail} animation="fadeInRight" direction="alternate" style={{ paddingVertical: 10 }}>
                                <TextInput
                                    label="Email"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    style={{ backgroundColor: 'white' }}
                                />
                            </Animatable.View>
                            <Animatable.View useNativeDriver ref={refViewDomicile} animation="fadeInLeft" direction="alternate" style={{ paddingVertical: 10 }}>
                                <TextInput
                                    label="Domicile"
                                    value={domicile}
                                    onChangeText={setDomicile}
                                    multiline
                                    style={{ backgroundColor: 'white' }}
                                />
                            </Animatable.View>
                            <Animatable.View useNativeDriver ref={refViewGender} animation="fadeInRight" direction="alternate" style={{ paddingVertical: 10 }}>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => setModalSelectGender(true)}>
                                    <TextInput
                                        label="Gender"
                                        value={gender}
                                        editable={false}
                                        style={{ backgroundColor: 'white' }}
                                        right={<TextInput.Icon name="chevron-down" disabled />}
                                    />
                                </TouchableOpacity>
                            </Animatable.View>
                            <Animatable.View useNativeDriver ref={refViewPhoneNumber} animation="fadeInLeft" direction="alternate" style={{ paddingVertical: 10 }}>
                                <TextInput
                                    label="Phone Number"
                                    keyboardType="phone-pad"
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                    style={{ backgroundColor: 'white' }}
                                />
                            </Animatable.View>
                            <Animatable.View useNativeDriver ref={refViewPassword} animation="fadeInRight" direction="alternate" style={{ paddingVertical: 10 }}>
                                <TextInput
                                    label="Password"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                    style={{ backgroundColor: 'white' }}
                                    right={<TextInput.Icon name={!showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
                                />
                            </Animatable.View>
                            <Animatable.View useNativeDriver ref={refViewPasswordConfirm} animation="fadeInLeft" direction="alternate" style={{ paddingVertical: 10 }}>
                                <TextInput
                                    label="Password Confirm"
                                    secureTextEntry={!showPasswordConfirm}
                                    value={passwordConfirm}
                                    onChangeText={setPasswordConfirm}
                                    style={{ backgroundColor: 'white' }}
                                    right={<TextInput.Icon name={!showPasswordConfirm ? "eye-off" : "eye"} onPress={() => setShowPasswordConfirm(!showPasswordConfirm)} />}
                                />
                            </Animatable.View>

                            <Animatable.View useNativeDriver ref={refViewSubmit} animation="fadeInUp" direction="alternate" style={{ paddingVertical: 10 }}>
                                <Button mode="contained" color={defaultThemeColors.backdrop} style={{ margin: 5, marginTop: 20, elevation: 0 }} contentStyle={{ paddingVertical: 5 }} onPress={handleSignUp}>
                                    Sign Up
                                </Button>
                                <Subheading style={{ textAlign: "center", marginTop: 10, color: defaultThemeColors.backdrop }}>Already have account?</Subheading>
                                <Button style={{ alignSelf: "center" }} labelStyle={{ color: defaultThemeColors.backdrop }} onPress={() => handleBack()}>
                                    Sign In
                                </Button>
                            </Animatable.View>
                        </Card.Content>
                    </Card>
                </ScrollView>
                <SelectGender stateOnSelect={[modalSelectGender, setModalSelectGender]} callbackSetStateData={setGender} />
                <LoadingPage isLoading={isLoading} />
            </SafeAreaView>
        </View>
    )
}