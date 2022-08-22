import React, { useState } from "react";
import { Image, Linking, Modal, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { defaultThemeColors } from "../../helpers/colors.helper";
import { wp } from "../../helpers/size.helper";
import moment from "moment";
import { Button } from "react-native-paper";
import { useSelector } from "react-redux";
import { ToastShow } from "../../helpers/toast.helper";

export default function HistoryDetail({ route: { params: { data } } }) {
    const user = useSelector(state => state.user.data)
    const [showPhoto, setShowPhoto] = useState(false)

    const handleLocationOpenMaps = () => {
        if (!data.latitude || !data.longitude) return

        const mapsSchema = Platform.select({
            ios: `maps:0,0?q=`,
            android: `geo:0,0?q=`,
        })
        const mapsUrl = Platform.select({
            ios: `${mapsSchema}${user.fullname}@${data.latitude},${data.longitude}`,
            android: `${mapsSchema}${data.latitude},${data.longitude}(${user.fullname})`
        })

        try {
            Linking.openURL(mapsUrl)
        } catch (error) {
            ToastShow('Something wrong!')
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: defaultThemeColors.surface }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ margin: wp(5), borderRadius: 10, backgroundColor: defaultThemeColors.background, padding: wp(3), elevation: 3 }}>
                    <View style={{ marginBottom: wp(5) }}>
                        <Text style={{ fontSize: wp(3.6), fontWeight: 'bold' }}>Request ID</Text>
                        <Text style={{ fontSize: wp(3.6) }}>{data.id}</Text>
                    </View>
                    <View style={{ marginBottom: wp(5) }}>
                        <Text style={{ fontSize: wp(3.6), fontWeight: 'bold' }}>Request Date</Text>
                        <Text style={{ fontSize: wp(3.6) }}>{moment(data.date).format('DD MMMM YYYY')}   -   {moment(data.date).locale('en').format('HH:mm:ss A')}</Text>
                    </View>
                    <View style={{ marginBottom: wp(5) }}>
                        <Text style={{ fontSize: wp(3.6), fontWeight: 'bold' }}>Type</Text>
                        <Text style={{ fontSize: wp(3.6) }}>{data.type.replace('_', ' ').toUpperCase()}</Text>
                    </View>
                    <View style={{ marginBottom: wp(5) }}>
                        <Text style={{ fontSize: wp(3.6), fontWeight: 'bold' }}>Purpose</Text>
                        <Text style={{ fontSize: wp(3.6) }}>{data.penugasan?.deskripsi || '-'}</Text>
                    </View>
                    <View style={{ marginBottom: wp(5) }}>
                        <Text style={{ fontSize: wp(3.6), fontWeight: 'bold' }}>Remarks</Text>
                        <Text style={{ fontSize: wp(3.6) }}>{data.alasan || '-'}</Text>
                    </View>
                    {data.photourl && (
                        <View style={{ marginBottom: wp(5) }}>
                            <Text style={{ fontSize: wp(3.6), fontWeight: 'bold' }}>Photo Preview</Text>
                            <TouchableOpacity activeOpacity={0.8} style={{ padding: wp(2), alignSelf: 'flex-start' }} onPress={() => setShowPhoto(true)}>
                                <Text style={{ fontSize: wp(3.6), color: defaultThemeColors.primary, borderBottomWidth: 1, borderBottomColor: defaultThemeColors.primary }}>Click To Open Photo Preview</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {data.latitude && data.longitude && (
                        <View style={{ marginBottom: wp(5) }}>
                            <Text style={{ fontSize: wp(3.6), fontWeight: 'bold' }}>Location</Text>
                            <TouchableOpacity activeOpacity={0.8} style={{ padding: wp(2), alignSelf: 'flex-start' }} onPress={handleLocationOpenMaps}>
                                <Text style={{ fontSize: wp(3.6), color: defaultThemeColors.primary, borderBottomWidth: 1, borderBottomColor: defaultThemeColors.primary }}>Click To Open Location In Maps</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Modal Photo */}
            <Modal visible={showPhoto} transparent onRequestClose={() => setShowPhoto(false)}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(1,1,1,0.3)' }}>
                    <View style={{ width: wp(90), alignItems: "center", padding: wp(2), backgroundColor: defaultThemeColors.surface, borderRadius: 10, height: wp(110) }}>
                        <View style={{ flex: 1, width: '100%' }}>
                            {data.photourl && (
                                <Image source={{ uri: data.photourl }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                            )}
                        </View>
                        <Button mode="outlined" color={defaultThemeColors.notification} style={{ marginTop: wp(2) }} onPress={() => setShowPhoto(false)}>
                            Close
                        </Button>
                    </View>
                </View>
            </Modal>
        </View>
    )
}