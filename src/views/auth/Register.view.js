import React, { useEffect, useRef, useState } from "react";
import { BackHandler, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Card, TextInput, Title, Button, Subheading } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { hp, wp } from "../../helpers/size.helper";
import LoadingPage from "../../components/LoadingPage.component";
import axios from "axios";
import { API_URL } from "../../configs/baseurl.config";
import { ToastShow } from "../../helpers/toast.helper";
import { StackActions } from '@react-navigation/native'
import { storeLoginData } from "../../helpers/authStorage.helper";
import { defaultThemeColors } from "../../helpers/colors.helper";
import SelectGender from "../../components/SelectGender.component";
import { useDispatch } from "react-redux";

export default function Register({ navigation }) {
    const dispatch = useDispatch()

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

                dispatch(counterUser.actions.resetData())
                navigation.dispatch(StackActions.replace('app-firstload'))
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
                    <Title style={{ textAlign: "center", marginTop: hp(5), color: defaultThemeColors.surface, fontSize: wp(5) }}>Register</Title>
                    <Card style={{ margin: wp(5), backgroundColor: 'transparent' }} elevation={0}>
                        <Card.Content>
                            {errorMessage && (
                                <View style={{ paddingVertical: wp(5) }}>
                                    <Text style={{ color: defaultThemeColors.error, fontWeight: 'bold' }}>{errorMessage}</Text>
                                </View>
                            )}
                            <View style={{ paddingVertical: wp(2) }}>
                                <TextInput
                                    label="Full Name"
                                    value={name}
                                    onChangeText={setName}
                                    style={styles.textInput}
                                />
                            </View>
                            <View style={{ paddingVertical: wp(2) }}>
                                <TextInput
                                    label="Email"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    style={styles.textInput}
                                />
                            </View>
                            <View style={{ paddingVertical: wp(2) }}>
                                <TextInput
                                    label="Domicile"
                                    value={domicile}
                                    onChangeText={setDomicile}
                                    multiline
                                    style={styles.textInput}
                                />
                            </View>
                            <View style={{ paddingVertical: wp(2) }}>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => setModalSelectGender(true)}>
                                    <TextInput
                                        label="Gender"
                                        value={gender}
                                        editable={false}
                                        style={styles.textInput}
                                        right={<TextInput.Icon name="chevron-down" disabled />}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ paddingVertical: wp(2) }}>
                                <TextInput
                                    label="Phone Number"
                                    keyboardType="phone-pad"
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                    style={styles.textInput}
                                />
                            </View>
                            <View style={{ paddingVertical: wp(2) }}>
                                <TextInput
                                    label="Password"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                    style={styles.textInput}
                                    right={<TextInput.Icon color={defaultThemeColors.surface} name={!showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
                                />
                            </View>
                            <View style={{ paddingVertical: wp(2) }}>
                                <TextInput
                                    label="Password Confirm"
                                    secureTextEntry={!showPasswordConfirm}
                                    value={passwordConfirm}
                                    onChangeText={setPasswordConfirm}
                                    style={styles.textInput}
                                    right={<TextInput.Icon color={defaultThemeColors.surface} name={!showPasswordConfirm ? "eye-off" : "eye"} onPress={() => setShowPasswordConfirm(!showPasswordConfirm)} />}
                                />
                            </View>

                            <View style={{ paddingVertical: wp(2) }}>
                                <Button mode="contained" color={defaultThemeColors.backdrop} style={{ margin: wp(1), marginTop: wp(5), elevation: 0 }} contentStyle={{ paddingVertical: wp(1) }} labelStyle={{ fontSize: wp(3) }} onPress={handleSignUp}>
                                    Sign Up
                                </Button>
                                <Subheading style={{ textAlign: "center", marginTop: wp(2), color: defaultThemeColors.backdrop, fontSize: wp(3) }}>Already have account?</Subheading>
                                <Button style={{ alignSelf: "center" }} labelStyle={{ color: defaultThemeColors.surface, fontSize: wp(3) }} onPress={() => handleBack()}>
                                    Sign In
                                </Button>
                            </View>
                        </Card.Content>
                    </Card>
                </ScrollView>
                <SelectGender stateOnSelect={[modalSelectGender, setModalSelectGender]} callbackSetStateData={setGender} />
                <LoadingPage isLoading={isLoading} />
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    textInput: { backgroundColor: defaultThemeColors.surface, color: defaultThemeColors.onSurface },

})