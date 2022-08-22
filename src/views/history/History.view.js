import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { ListDataHistory } from "../../components/ListDataHistory.component";
import { defaultThemeColors } from "../../helpers/colors.helper";
import { callApi } from "../../helpers/request.helper";
import { ToastShow } from "../../helpers/toast.helper";
import * as Animatable from 'react-native-animatable'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'

export default function History() {
    const tabBottomHeight = useBottomTabBarHeight()
    const [refreshing, setRefreshing] = useState(false)

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(0)
    const [next, setNext] = useState(false)

    const getDataHistory = async () => {
        if (data.length > 0 && !next) return
        setLoading(true)
        try {
            const response = await callApi().get(`v1/absensi/list?page=${currentPage}&size=10`)
            if (response.success) {
                setData(currentPage == 0 ? response.data.content : old => [...old, ...response.data.content])
                setNext(!response.data.last)
            } else {
                ToastShow(response.message)
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
            ToastShow('Somethng wrong!')
            setLoading(false)
        }
    }

    useEffect(() => {
        getDataHistory()
    }, [currentPage])

    const onRefresh = () => {
        setRefreshing(true)
        setData([])
        setNext(false)
        setTimeout(() => {
            if (currentPage == 0) getDataHistory()
            else setCurrentPage(0)
            setRefreshing(false)
        }, 2000)
    };

    return (
        <View style={{ flex: 1, backgroundColor: defaultThemeColors.surface, paddingBottom: tabBottomHeight + 20 }}>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={data}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <Animatable.View useNativeDriver animation={index % 2 == 0 ? 'fadeInLeft' : 'fadeInRight'} direction="alternate" iterationDelay={100}>
                        <ListDataHistory data={item} />
                    </Animatable.View>
                )}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
    )
}