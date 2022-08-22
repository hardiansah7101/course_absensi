import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, Modal, TouchableOpacity, View } from "react-native";
import { Camera as ExpoCamera, CameraType } from "expo-camera";
import { ToastShow } from "../helpers/toast.helper";
import { defaultThemeColors } from "../helpers/colors.helper";
import { wp } from "../helpers/size.helper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "react-native-paper";

export const Camera = ({
    stateVisible,
    stateChangeVisible,
    stateSetResult,
    base64 = false
}) => {
    const [loading, setLoading] = useState(false)

    const [permission, requestPermission] = ExpoCamera.useCameraPermissions();
    const cameraRef = useRef()

    const [result, setResult] = useState(null)

    const handleRequestPermission = async () => {
        try {
            await requestPermission()
        } catch (error) {
            ToastShow('Something Wrong!')
        }
    }

    useEffect(() => {
        if (!permission?.granted) {
            handleRequestPermission()
        }
    }, [permission])

    const handleTakePhoto = async () => {
        if (cameraRef.current) {
            setLoading(true)
            try {
                const photo = await cameraRef.current.takePictureAsync({ base64 })
                
                setResult(photo)
                setLoading(false)
            } catch (error) {
                ToastShow('Something wrong!')
                setLoading(false)
            }
        }
    }

    const handleSubmit = () => {
        const photoName = result.uri.split('/')[result.uri.split('/').length - 1]

        const photo = {
            uri: result.uri,
            name: photoName,
            type: `image/jpeg`,
            base64: result.base64 || null
        }
        stateSetResult(photo)
        stateChangeVisible(false)
        setResult(null)
    }

    return (
        <Modal visible={stateVisible} animationType="slide" onRequestClose={() => {
            stateChangeVisible(false)
            setResult(null)
        }}>
            <View style={{ flex: 1, backgroundColor: defaultThemeColors.background, paddingVertical: 40 }}>
                <View style={{ borderRadius: 20, overflow: 'hidden', height: wp(120), width: wp(90), alignSelf: "center", elevation: 3, backgroundColor: defaultThemeColors.onSurface }}>
                    {!result && permission?.granted && (
                        <ExpoCamera ref={cameraRef} style={{ flex: 1 }} type={CameraType.front} ratio="4:3" />
                    )}
                    {result && (
                        <Image source={{ uri: result.uri }} style={{ flex: 1 }} resizeMode="cover" />
                    )}
                </View>
                {result ? (
                    <View>
                        <Button mode="contained" color={defaultThemeColors.notification} style={{ marginHorizontal: wp(10), marginTop: wp(6) }} labelStyle={{ color: defaultThemeColors.surface }} contentStyle={{ paddingVertical: 5 }} onPress={() => setResult(null)}>
                            Retake Photo
                        </Button>
                        <Button mode="contained" color={defaultThemeColors.primary} style={{ marginHorizontal: wp(10), marginTop: wp(6) }} labelStyle={{ color: defaultThemeColors.surface }} contentStyle={{ paddingVertical: 5 }} onPress={handleSubmit}>
                            Submit
                        </Button>
                    </View>
                ) : (
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        {loading ? <ActivityIndicator /> : (
                            <TouchableOpacity activeOpacity={0.7} style={{
                                height: wp(30),
                                width: wp(30),
                                overflow: 'hidden',
                                borderRadius: wp(15),
                                elevation: 3,
                                borderWidth: wp(5),
                                borderColor: defaultThemeColors.primary,
                                backgroundColor: defaultThemeColors.primaryLight2,
                                justifyContent: "center",
                                alignItems: "center"
                            }} onPress={handleTakePhoto}>
                                <MaterialCommunityIcons name="camera" size={wp(10)} color={defaultThemeColors.primary} />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
        </Modal>
    )
}