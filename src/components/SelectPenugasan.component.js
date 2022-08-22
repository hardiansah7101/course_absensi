import React, { useEffect, useState } from "react"
import { ActivityIndicator, FlatList, Modal, Text, TouchableOpacity, View } from "react-native"
import * as Animatable from 'react-native-animatable'
import { Subheading, List } from "react-native-paper"
import { defaultThemeColors } from "../helpers/colors.helper"
import { callApi } from "../helpers/request.helper"
import { hp, wp } from "../helpers/size.helper"
import { ToastShow } from "../helpers/toast.helper"

export default function SelectPenugasan({
    stateOnSelect: [onSelect, setOnSelect],
    callbackSetStateData
}) {
    const [dataPenugasan, setDataPenugasan] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [next, setNext] = useState(false)
    const [loading, setLoading] = useState(false)

    const getDataPenugasan = async () => {
        if (dataPenugasan.length > 0 && !next) return
        setLoading(true)
        try {
            const response = await callApi().get(`v1/penugasan/list?page=${currentPage}&size=2`);
            if (response.success) {
                setDataPenugasan(old => [...old, ...response.data.content])
                setNext(!response.data.last)
            } else {
                ToastShow(response.message)
            }
        } catch (error) {
            ToastShow('Something wrong on get data penugasan!')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getDataPenugasan()
    }, [currentPage])

    return (
        <Modal visible={onSelect} transparent onRequestClose={() => setOnSelect(false)}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(1,1,1,0.2)' }}>
                <TouchableOpacity activeOpacity={0} style={{ position: 'absolute', height: '100%', width: '100%' }} onPress={() => setOnSelect(false)} />
                <Animatable.View useNativeDriver animation="fadeInUp" duration={200}>
                    <View style={{ width: wp(80), elevation: 1, maxHeight: hp(80), borderRadius: 20, backgroundColor: 'white', overflow: 'hidden' }}>
                        <Subheading style={{ margin: 10, borderBottomWidth: 1, textAlign: "center", fontWeight: 'bold', paddingVertical: 5 }}>Select Penugasan</Subheading>
                        <FlatList
                            data={dataPenugasan}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={({ item }) => (
                                <List.Item
                                    onPress={() => {
                                        callbackSetStateData(item)
                                        setOnSelect(false)
                                    }}
                                    title={item.deskripsi}
                                />
                            )}
                            ListFooterComponent={next && (
                                <View style={{ paddingVertical: 20, alignItems: "center" }}>
                                    {loading ? <ActivityIndicator /> : (
                                        <TouchableOpacity activeOpacity={0.7} onPress={() => setCurrentPage(currentPage + 1)}>
                                            <Text style={{ color: defaultThemeColors.primary, fontSize: 15 }}>Load more...</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}
                        />
                    </View>
                </Animatable.View>
            </View>
        </Modal>
    )
}