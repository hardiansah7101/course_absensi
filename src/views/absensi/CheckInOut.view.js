import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
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
import { wp } from "../../helpers/size.helper";
import { MapViewLeaflet } from "../../components/Leaflet.component";
import { getDistance } from "geolib";

export default function CheckInOut({ navigation, route }) {
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

    const uploadPhoto = async () => {
        try {
            const payload = new FormData()
            payload.append('file', photo)

            const response = await callApi().post(`v1/upload`, payload, {
                'Content-Type': 'multipart/form-data'
            })
            if (response.success) {
                return response.data.fileDownloadUri
            }
            return null
        } catch (error) {
            ToastShow('Something wrong!')
            return null
        }
    }

    const handleSubmitCheck = async () => {
        setLoading(dispatch, true)
        try {
            if (placeLocation == 'in the office') {
                const distance = getDistance(location, {
                    latitude: -6.2245506,
                    longitude: 106.8403731
                })

                if (distance > 100) {
                    ToastShow('Your location is too far above 100 meters from office!')
                    setLoading(dispatch, false)
                    return
                }
            }

            const dataPhoto = await uploadPhoto()
            if (dataPhoto) {
                const payload = {
                    type: 'check_' + route.params.type,
                    alasan: remark,
                    penugasan: { id: penugasan.id },
                    photoUrl: dataPhoto,
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
                <View style={{ padding: wp(5) }}>
                    <View style={{ height: wp(40), borderRadius: 2, overflow: 'hidden', backgroundColor: 'lightblue', justifyContent: "center" }}>
                        {location ? <MapViewLeaflet latitude={location.latitude} longitude={location.longitude} /> : <ActivityIndicator size={wp(5)} style={{ alignSelf: "center" }} />}
                    </View>
                    <TouchableOpacity activeOpacity={0.7} style={{ alignSelf: "center", marginVertical: wp(1) }} onPress={getLocation}>
                        <Text style={{ fontSize: wp(3), fontWeight: 'bold', color: defaultThemeColors.primary, borderBottomWidth: 1, borderBottomColor: defaultThemeColors.primary, paddingVertical: wp(1) }}>REFRESH LOCATION</Text>
                    </TouchableOpacity>
                    <View style={{ paddingVertical: wp(6) }}>
                        <Title style={{ paddingHorizontal: wp(1), fontSize: wp(4), color: defaultThemeColors.onSurface }}>Location</Title>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: "center", marginTop: wp(1), marginRight: wp(3) }} onPress={() => {
                                setPlaceLocation('in the office')
                            }}>
                                <Checkbox status={placeLocation == 'in the office' ? 'checked' : 'unchecked'} color={defaultThemeColors.primary} uncheckedColor={defaultThemeColors.text} />
                                <Subheading style={{ textAlign: "center", fontSize: wp(3), color: defaultThemeColors.onSurface }}>In the office</Subheading>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: "center", marginTop: wp(1), marginRight: wp(3) }} onPress={() => {
                                setPlaceLocation('outside the office')
                            }}>
                                <Checkbox status={placeLocation == 'outside the office' ? 'checked' : 'unchecked'} color={defaultThemeColors.primary} uncheckedColor={defaultThemeColors.text} />
                                <Subheading style={{ textAlign: "center", fontSize: wp(3), color: defaultThemeColors.onSurface }}>Outside the office</Subheading>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {photo && (
                        <View style={{ marginVertical: wp(5), borderRadius: wp(1), backgroundColor: defaultThemeColors.background, padding: wp(5), alignSelf: "center" }}>
                            <Image source={{ uri: photo.uri }} style={{ height: wp(80), width: wp(60) }} resizeMode="contain" />
                        </View>
                    )}
                    <Button mode="contained" color={defaultThemeColors.notification} style={{ margin: wp(3), elevation: 0 }} labelStyle={{ color: defaultThemeColors.surface, fontSize: wp(3) }} disabled={!location || !placeLocation} contentStyle={{ paddingVertical: wp(1) }} onPress={() => setOnTakePhoto(true)}>
                        {photo ? "Retake Photo" : "Take Photo"}
                    </Button>

                    <TouchableOpacity activeOpacity={0.8} style={{ marginVertical: wp(3) }} onPress={() => setSelectPenugasan(true)} disabled={!location || !placeLocation}>
                        <TextInput
                            label="Select Penugasan"
                            value={penugasan?.deskripsi || ''}
                            editable={false}
                            style={{ backgroundColor: defaultThemeColors.surface, color: defaultThemeColors.onSurface }}
                        />
                    </TouchableOpacity>

                    <TextInput
                        label="Remark"
                        value={remark}
                        onChangeText={setRemark}
                        multiline
                        disabled={!location || !placeLocation}
                        style={{ backgroundColor: defaultThemeColors.surface, color: defaultThemeColors.onSurface, marginVertical: wp(5) }}
                    />
                    <Button mode="contained" color={defaultThemeColors.accent} style={{ margin: wp(3), elevation: 0 }} labelStyle={{ color: defaultThemeColors.surface, fontSize: wp(3) }} disabled={!location || !photo || !penugasan} contentStyle={{ paddingVertical: wp(1) }} onPress={handleSubmitCheck}>
                        Check {route.params.type}
                    </Button>
                </View>
            </ScrollView>

            {/* Select Penugasan */}
            <SelectPenugasan stateOnSelect={[selectPenugasan, setSelectPenugasan]} callbackSetStateData={setPenugasan} />

            {/* Take photo */}
            {onTakePhoto && (
                <Camera stateVisible={onTakePhoto} stateChangeVisible={setOnTakePhoto} stateSetResult={setPhoto} base64={true} />
            )}

            {/* On Submited */}
            <PopupMessage visible={onSubmited} message={`Your Check-${route.params?.type} submited!`} onBtnPress={() => {
                setOnSubmited(false)
                navigation.goBack()
            }} />
        </View>
    )
}