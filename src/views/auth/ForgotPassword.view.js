import axios from "axios";
import React, { useRef, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Card, TextInput, Title, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../configs/baseurl.config";
import { defaultThemeColors } from "../../helpers/colors.helper";
import { setLoading } from "../../helpers/constant.helper";
import { ToastShow } from "../../helpers/toast.helper";
import OTPTextInput from "react-native-otp-textinput";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LoadingPage from "../../components/LoadingPage.component";
import { wp } from "../../helpers/size.helper";

export default function ForgotPassword({ navigation }) {
    const dispatch = useDispatch()
    const { loading } = useSelector(state => state.constant)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')

    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

    const [onVerifyOtp, setOnVerifyOtp] = useState(false)
    const [onUpdatePassword, setOnUpdatePassword] = useState(false)
    const otpRef = useRef()

    const handleSendEmail = async () => {
        if (email == '') {
            ToastShow('Input your email first!')
            return
        }
        setLoading(dispatch, true)
        try {
            const response = await axios.post(`${API_URL}/forget-password/send`, { email })
            if (response.data?.status == '200') {
                setOnVerifyOtp(true)
            } else {
                ToastShow(response.data.message)
            }
            setLoading(dispatch, false)
        } catch (error) {
            console.log(error)
            setLoading(dispatch, false)
            ToastShow('Something went wrong!')
        }
    }

    const handleOtpConfirm = async (otp) => {
        setLoading(dispatch, true)
        try {
            const response = await axios.post(`${API_URL}/forget-password/validate`, { email, otp })
            if (response.data?.status == '200') {
                otpRef.current?.clear()
                setOnUpdatePassword(true)
                setTimeout(() => {
                    setLoading(dispatch, false)
                    setOnVerifyOtp(false)
                }, 1000)
            } else {
                otpRef.current?.clear()
                ToastShow(response.data.message)
                setLoading(dispatch, false)
            }
        } catch (error) {
            console.log(error)
            setLoading(dispatch, false)
            ToastShow('Something went wrong!')
        }
    }

    const handleResendOtp = async () => {

    }

    const handleUpdatePassword = async () => {
        if (password == '' || passwordConfirm == '') {
            ToastShow('Enter your password!')
            return
        } else if (password != passwordConfirm) {
            ToastShow('Password confirmation is wrong!')
            return
        }
        setLoading(dispatch, true)
        try {
            const response = await axios.post(`${API_URL}/forget-password/change-password`, { email, newPassword: password, confirmNewPassword: passwordConfirm })
            if (response.data?.status == '200') {
                ToastShow('Password updated!')
                setLoading(dispatch, false)
                setOnUpdatePassword(false)
                navigation.goBack();
            } else {
                ToastShow(response.data.message)
                setLoading(dispatch, false)
            }
        } catch (error) {
            console.log(error)
            setLoading(dispatch, false)
            ToastShow('Something went wrong!')
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: defaultThemeColors.primary }}>
            <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
                <Title style={{ textAlign: "center", color: defaultThemeColors.surface, fontSize: wp(5) }}>Masukkan email kamu</Title>
                <Card style={{ margin: wp(5), backgroundColor: 'transparent' }} elevation={0}>
                    <Card.Content>
                        <TextInput
                            label="Email"
                            style={{ margin: wp(1), backgroundColor: defaultThemeColors.surface, color: defaultThemeColors.onSurface }}
                            value={email}
                            onChangeText={setEmail}
                            left={<TextInput.Icon color={defaultThemeColors.onSurface} name="email" />}
                        />
                        <Button mode="contained" color={defaultThemeColors.backdrop} style={{ margin: wp(1), marginTop: wp(5), elevation: 0 }} contentStyle={{ paddingVertical: wp(1) }} labelStyle={{ fontSize: wp(3) }} onPress={handleSendEmail}>
                            Send
                        </Button>
                        <Button style={{ alignSelf: "center" }} labelStyle={{ color: defaultThemeColors.surface, fontSize: wp(3) }} onPress={() => navigation.goBack()}>
                            Back
                        </Button>
                    </Card.Content>
                </Card>
            </SafeAreaView>

            {/* Modal confirm otp */}
            <Modal visible={onVerifyOtp} animationType="slide" onRequestClose={() => setOnVerifyOtp(false)}>
                <View style={{ flex: 1, backgroundColor: defaultThemeColors.primary, justifyContent: "center" }}>
                    <Title style={{ textAlign: "center", color: defaultThemeColors.surface, fontSize: wp(5) }}>Enter OTP Code</Title>
                    <Card style={{ margin: wp(5), backgroundColor: 'transparent' }} elevation={0}>
                        <Card.Content>
                            <OTPTextInput
                                ref={otpRef}
                                inputCount={4}
                                handleTextChange={otp => otp.length == 4 && handleOtpConfirm(otp)}
                            />

                            <Text style={{ textAlign: "center", marginTop: wp(5), fontSize: wp(3), color: defaultThemeColors.backdrop }}>OTP code not send?</Text>
                            <Button style={{ alignSelf: "center" }} labelStyle={{ color: defaultThemeColors.surface, fontSize: wp(3) }} onPress={handleResendOtp}>
                                Resend OTP
                            </Button>
                        </Card.Content>
                    </Card>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => setOnVerifyOtp(false)} style={{ position: "absolute", margin: wp(10), top: 0 }}>
                        <MaterialCommunityIcons name="arrow-left" size={wp(7)} color={defaultThemeColors.surface} />
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* Modal update password */}
            <Modal visible={onUpdatePassword} animationType="slide" onRequestClose={() => setOnUpdatePassword(false)}>
                <View style={{ flex: 1, backgroundColor: defaultThemeColors.primary, justifyContent: "center" }}>
                    <Title style={{ textAlign: "center", color: defaultThemeColors.surface, fontSize: wp(5) }}>Update password</Title>
                    <Card style={{ margin: wp(5), backgroundColor: 'transparent' }} elevation={0}>
                        <Card.Content>
                            <View style={{ paddingVertical: wp(1) }}>
                                <TextInput
                                    label="New Password"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                    style={styles.textInput}
                                    right={<TextInput.Icon color={defaultThemeColors.onSurface} name={!showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />}
                                />
                            </View>
                            <View style={{ paddingVertical: wp(1) }}>
                                <TextInput
                                    label="Password Confirm"
                                    secureTextEntry={!showPasswordConfirm}
                                    value={passwordConfirm}
                                    onChangeText={setPasswordConfirm}
                                    style={styles.textInput}
                                    right={<TextInput.Icon color={defaultThemeColors.onSurface} name={!showPasswordConfirm ? "eye-off" : "eye"} onPress={() => setShowPasswordConfirm(!showPasswordConfirm)} />}
                                />
                            </View>
                            <Button mode="contained" color={defaultThemeColors.backdrop} style={{ margin: wp(1), marginVertical: wp(5), elevation: 0 }} contentStyle={{ paddingVertical: wp(1) }} labelStyle={{ fontSize: wp(3) }} onPress={handleUpdatePassword}>
                                Update Password
                            </Button>
                        </Card.Content>
                    </Card>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => setOnUpdatePassword(false)} style={{ position: "absolute", margin: wp(10), top: 0 }}>
                        <MaterialCommunityIcons name="arrow-left" size={wp(7)} color={defaultThemeColors.surface} />
                    </TouchableOpacity>
                </View>
            </Modal>

            <LoadingPage isLoading={loading} />
        </View>
    )
}

const styles = StyleSheet.create({
    textInput: { backgroundColor: defaultThemeColors.surface, color: defaultThemeColors.onSurface },

})