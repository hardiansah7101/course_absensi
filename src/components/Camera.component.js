import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, Modal, TouchableOpacity, View } from "react-native";
import { Camera as ExpoCamera, CameraType } from "expo-camera";
import { ToastShow } from "../helpers/toast.helper";
import { defaultThemeColors } from "../helpers/colors.helper";
import { wp } from "../helpers/size.helper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import * as FaceDetector from "expo-face-detector";

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
    const [onFaceDetected, setOnFaceDetected] = useState(false)

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
                const photo = await cameraRef.current.takePictureAsync()

                setResult(photo)
                setLoading(false)
            } catch (error) {
                ToastShow('Something wrong!')
                setLoading(false)
            }
        }
    }

    const handleSubmit = async () => {
        try {
            const photoResizer = await manipulateAsync(result.uri, [
                {rotate: 0},
                {resize: {
                    width: 180 * 3,
                    height: 240 * 3,
                }},
                
            ], {
                compress: 0.5,
                format: SaveFormat.JPEG,
            })
            const photoName = photoResizer.uri.split('/')[photoResizer.uri.split('/').length - 1]

            const photo = {
                ...photoResizer,
                name: photoName,
                type: `image/jpeg`,
            }

            stateSetResult(photo)
            stateChangeVisible(false)
        } catch (error) {
            console.log(error)
            ToastShow('Something wrong!')
        } finally {
            setResult(null)
        }
    }

    return (
        <Modal visible={stateVisible} animationType="slide" onRequestClose={() => {
            stateChangeVisible(false)
            setResult(null)
        }}>
            <View style={{ flex: 1, backgroundColor: defaultThemeColors.background, paddingVertical: 40 }}>
                <View style={{ borderRadius: 20, overflow: 'hidden', height: wp(120), width: wp(90), alignSelf: "center", elevation: 3, backgroundColor: defaultThemeColors.onSurface }}>
                    {permission?.granted && (
                        <ExpoCamera ref={cameraRef} style={{ flex: 1 }} type={CameraType.front} ratio="4:3" onFacesDetected={res => {
                            setOnFaceDetected(res.faces.length > 0)
                        }} faceDetectorSettings={{
                            mode: FaceDetector.FaceDetectorMode.accurate,
                            detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
                            runClassifications: FaceDetector.FaceDetectorClassifications.none,
                            minDetectionInterval: 100,
                            tracking: true
                        }} />
                    )}
                    {result && (
                        <Image source={{ uri: result.uri }} style={{ height: '100%', width: '100%', position: 'absolute' }} resizeMode="cover" />
                    )}
                </View>
                {result ? (
                    <View>
                        <Button mode="contained" color={defaultThemeColors.notification} style={{ marginHorizontal: wp(10), marginTop: wp(6) }} labelStyle={{ color: defaultThemeColors.surface }} contentStyle={{ paddingVertical: wp(1) }} onPress={() => setResult(null)}>
                            Retake Photo
                        </Button>
                        <Button mode="contained" color={defaultThemeColors.primary} style={{ marginHorizontal: wp(10), marginTop: wp(6) }} labelStyle={{ color: defaultThemeColors.surface }} contentStyle={{ paddingVertical: wp(1) }} onPress={handleSubmit}>
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
                                elevation: 0,
                                borderWidth: wp(5),
                                borderColor: onFaceDetected ? defaultThemeColors.primary : defaultThemeColors.placeholder,
                                backgroundColor: onFaceDetected ? defaultThemeColors.primaryLight2 : defaultThemeColors.backdrop,
                                justifyContent: "center",
                                alignItems: "center"
                            }} onPress={handleTakePhoto} disabled={!onFaceDetected}>
                                <MaterialCommunityIcons name="camera" size={wp(10)} color={onFaceDetected ? defaultThemeColors.primary : defaultThemeColors.placeholder} />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
        </Modal>
    )
}