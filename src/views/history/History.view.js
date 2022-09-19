import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Linking, Modal, Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ListDataHistory } from "../../components/ListDataHistory.component";
import { defaultThemeColors } from "../../helpers/colors.helper";
import { callApi } from "../../helpers/request.helper";
import { ToastShow } from "../../helpers/toast.helper";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { wp } from "../../helpers/size.helper";
import { useDispatch } from "react-redux";
import { setLoading as setLoadingPage } from "../../helpers/constant.helper";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function History() {
    const tabBottomHeight = useBottomTabBarHeight()
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const [refreshing, setRefreshing] = useState(false)

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(0)
    const [next, setNext] = useState(false)

    const [onSelectDate, setOnSelectDate] = useState(false)
    const [dateFrom, setDateFrom] = useState(new Date())
    const [dateTo, setDateTo] = useState(new Date())

    const [dateType, setDateType] = useState(null)

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity activeOpacity={0.8} style={{ paddingHorizontal: wp(2), flexDirection: 'row', alignItems: "center" }} onPress={() => setOnSelectDate(true)}>
                    <MaterialCommunityIcons name="printer" color={defaultThemeColors.surface} />
                    <Text style={{ color: defaultThemeColors.surface, fontWeight: "bold", paddingHorizontal: wp(1) }}>Print Report</Text>
                </TouchableOpacity>
            )
        })
    }, [])

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

    const handleExportReport = async () => {
        setLoadingPage(dispatch, true)
        try {
            const response = await callApi().get(`v1/absensi/reporting?dateFrom=${moment(dateFrom).format('YYYY-M-DD')}&dateto=${moment(dateTo).format('YYYY-M-DD')}`)
            if (response.success) {
                Linking.openURL(response.data)
            } else {
                ToastShow(response.message)
            }
        } catch (error) {
            console.log(error)
            ToastShow('Something wrong!')
        } finally {
            setLoadingPage(dispatch, false)
            setOnSelectDate(false)
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
        <View style={{ flex: 1, backgroundColor: defaultThemeColors.surface, paddingBottom: tabBottomHeight + wp(2) }}>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={data}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View>
                        <ListDataHistory data={item} />
                    </View>
                )}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListFooterComponent={next && (
                    <View style={{ paddingVertical: 20, alignItems: "center" }}>
                        {loading ? <ActivityIndicator /> : (
                            <TouchableOpacity activeOpacity={0.7} onPress={() => setCurrentPage(currentPage + 1)}>
                                <Text style={{ color: defaultThemeColors.primary, fontSize: wp(3) }}>Load more...</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            />
            <Modal visible={onSelectDate} transparent animationType="slide" onRequestClose={() => setOnSelectDate(false)}>
                <View style={{ flex: 1, backgroundColor: 'rgba(1,1,1,0.2)', justifyContent: "center", alignItems: "center" }}>
                    <View style={{ width: wp(90), padding: wp(3), backgroundColor: defaultThemeColors.surface }}>
                        <Text style={{ color: defaultThemeColors.text, textAlign: "center", fontSize: wp(4) }}>Select Date</Text>
                        <View style={{ paddingVertical: wp(4) }}>
                            <View style={styles.datePickerItem}>
                                <Text style={styles.datePickerText}>From</Text>
                                <TouchableOpacity activeOpacity={0.5} style={styles.datePickerButton} onPress={() => setDateType('from')}>
                                    <Text style={styles.datePickerText}>{moment(dateFrom).format('YYYY-MM-DD')}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.datePickerItem}>
                                <Text style={styles.datePickerText}>To</Text>
                                <TouchableOpacity activeOpacity={0.5} style={styles.datePickerButton} onPress={() => setDateType('to')}>
                                    <Text style={styles.datePickerText}>{moment(dateTo).format('YYYY-MM-DD')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity activeOpacity={0.8} style={{ padding: wp(3), marginVertical: wp(1), backgroundColor: defaultThemeColors.primary }} onPress={handleExportReport}>
                            <Text style={{ fontSize: wp(3.6), textAlign: "center", color: defaultThemeColors.surface, fontWeight: 'bold' }}>Export Report</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} style={{ padding: wp(3), marginVertical: wp(1), backgroundColor: defaultThemeColors.notification }} onPress={() => setOnSelectDate(false)}>
                            <Text style={{ fontSize: wp(3.6), textAlign: "center", color: defaultThemeColors.surface, fontWeight: 'bold' }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <DateTimePickerModal
                isVisible={dateType != null}
                mode="date"
                onConfirm={date => {
                    if (dateType == 'from') {
                        setDateFrom(date)
                    } else {
                        setDateTo(date)
                    }
                    setDateType(null)
                }}
                onCancel={() => setDateType(null)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    datePickerItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", marginVertical: wp(1) },
    datePickerButton: { width: wp(50), padding: wp(2), alignItems: 'flex-end', backgroundColor: defaultThemeColors.background },
    datePickerText: { fontSize: wp(4), color: defaultThemeColors.text },
})