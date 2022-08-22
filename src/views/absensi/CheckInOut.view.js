import React, { useEffect, useState } from "react";
import { AppState, Image, ScrollView, TouchableOpacity, View } from "react-native";
import { defaultThemeColors } from "../../helpers/colors.helper";
import { requestPermissionLocation } from "../../helpers/permissions.helper";
import { ToastShow } from "../../helpers/toast.helper";
import * as Location from 'expo-location';
import MapView, { Marker } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, Checkbox, Subheading, TextInput, Title } from "react-native-paper";
import { Camera } from "../../components/Camera.component";
import { useDispatch } from "react-redux";
import { setLoading } from "../../helpers/constant.helper";
import { callApi } from "../../helpers/request.helper";
import SelectPenugasan from "../../components/SelectPenugasan.component";
import { PopupMessage } from "../../components/Popup.component";

export default function CheckInOut({ navigation, route }) {
    const [status] = Location.useForegroundPermissions();
    const dispatch = useDispatch()
    const [selectPenugasan, setSelectPenugasan] = useState(false)

    const [location, setLocation] = useState(null)
    const [photo, setPhoto] = useState(null)
    const [penugasan, setPenugasan] = useState(null)
    const [remark, setRemark] = useState('')
    const [placeLocation, setPlaceLocation] = useState(null)

    const [onTakePhoto, setOnTakePhoto] = useState(false)
    const [onSubmited, setOnSubmited] = useState(false)

    const getLocation = async () => {
        setLocation(null)
        const granted = await requestPermissionLocation()
        if (granted.success) {
            try {
                const location = await Location.getCurrentPositionAsync()
                if (location.mocked) {
                    ToastShow('Your location mocked detected!')
                } else {
                    setLocation({
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude
                    })
                }
            } catch (error) {
                ToastShow('Something Wrong!')
            }
        } else {
            ToastShow(granted.message)
        }
    }

    useEffect(() => {
        getLocation()
    }, [])

    const handleSubmitCheck = async () => {
        setLoading(dispatch, true)
        try {
            const payload = {
                type: 'check_' + route.params.type,
                alasan: remark,
                penugasan: { id: penugasan.id },
                photourl: photo.base64,
                place_location: placeLocation,
                latitude: location.latitude,
                longitude: location.longitude,
            }

            const response = await callApi().post(`v1/absensi/save`, payload)

            if (response.success) {
                ToastShow('Your check in submited!')
                setOnSubmited(true)
            } else {
                ToastShow(response.message)
            }

            setLoading(dispatch, false)
        } catch (error) {
            ToastShow('Something wrong!')
            setLoading(dispatch, false)
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: defaultThemeColors.surface }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ padding: 20 }}>
                    <View style={{ height: 200, borderRadius: 20, overflow: 'hidden', backgroundColor: 'lightblue' }}>
                        <MapView
                            style={{ flex: 1 }}
                            region={{
                                latitude: location?.latitude ?? -6.200000,
                                longitude: location?.longitude ?? 106.816666,
                                latitudeDelta: location?.latitude ? 0.0022 : 0.04,
                                longitudeDelta: location?.longitude ? 0.0001 : 0.02,
                            }} zoomEnabled={false} scrollEnabled={false} zoomTapEnabled={false} >
                            {location && (
                                <Marker coordinate={location} >
                                    <MaterialCommunityIcons name="tooltip-account" color={defaultThemeColors.primary} size={40} />
                                </Marker>
                            )}
                        </MapView>
                    </View>
                    <View style={{ paddingVertical: 30 }}>
                        <Title style={{ paddingHorizontal: 5 }}>Location</Title>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: "center", marginTop: 5, marginRight: 10 }} onPress={() => {
                                setPlaceLocation('in the office')
                            }}>
                                <Checkbox status={placeLocation == 'in the office' ? 'checked' : 'unchecked'} color={defaultThemeColors.primary} uncheckedColor={defaultThemeColors.text} />
                                <Subheading style={{ textAlign: "center", color: defaultThemeColors.text }}>In the office</Subheading>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: "center", marginTop: 5, marginRight: 10 }} onPress={() => {
                                setPlaceLocation('outside the office')
                            }}>
                                <Checkbox status={placeLocation == 'outside the office' ? 'checked' : 'unchecked'} color={defaultThemeColors.primary} uncheckedColor={defaultThemeColors.text} />
                                <Subheading style={{ textAlign: "center", color: defaultThemeColors.text }}>Outside the office</Subheading>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {photo && (
                        <View style={{ marginVertical: 20, borderRadius: 5, backgroundColor: defaultThemeColors.background, padding: 20, alignSelf: "center" }}>
                            <Image source={{ uri: photo.uri }} style={{ height: 240, width: 180 }} resizeMode="contain" />
                        </View>
                    )}
                    <Button mode="contained" color={defaultThemeColors.notification} style={{ margin: 10, elevation: 0 }} labelStyle={{ color: defaultThemeColors.surface }} disabled={!location || !placeLocation} contentStyle={{ paddingVertical: 5 }} onPress={() => setOnTakePhoto(true)}>
                        {photo ? "Retake Photo" : "Take Photo"}
                    </Button>

                    <TouchableOpacity activeOpacity={0.8} style={{ marginVertical: 10 }} onPress={() => setSelectPenugasan(true)} disabled={!location || !placeLocation}>
                        <TextInput
                            label="Select Penugasan"
                            value={penugasan?.deskripsi || ''}
                            editable={false}
                            style={{ backgroundColor: 'white' }}
                        />
                    </TouchableOpacity>

                    <TextInput
                        label="Remark"
                        value={remark}
                        onChangeText={setRemark}
                        multiline
                        disabled={!location || !placeLocation}
                        style={{ backgroundColor: 'white', marginVertical: 20 }}
                    />
                    <Button mode="contained" color={defaultThemeColors.accent} style={{ margin: 10, elevation: 0 }} labelStyle={{ color: defaultThemeColors.surface }} disabled={!location || !photo || !penugasan} contentStyle={{ paddingVertical: 5 }} onPress={handleSubmitCheck}>
                        Check {route.params.type}
                    </Button>
                </View>
            </ScrollView>

            {/* Select Penugasan */}
            <SelectPenugasan stateOnSelect={[selectPenugasan, setSelectPenugasan]} callbackSetStateData={setPenugasan} />

            {/* Take photo */}
            <Camera stateVisible={onTakePhoto} stateChangeVisible={setOnTakePhoto} stateSetResult={setPhoto} base64={true} />

            {/* On Submited */}
            <PopupMessage visible={onSubmited} message={`Your Check-${route.params?.type} submited!`} onBtnPress={() => {
                setOnSubmited(false)
                navigation.goBack()
            }} />
        </View>
    )
}