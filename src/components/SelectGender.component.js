import React from "react"
import { FlatList, Modal, TouchableOpacity, View } from "react-native"
import * as Animatable from 'react-native-animatable'
import { Subheading, List } from "react-native-paper"
import { hp, wp } from "../helpers/size.helper"

export default function SelectGender({
    stateOnSelect: [onSelect, setOnSelect],
    callbackSetStateData
}) {
    return (
        <Modal visible={onSelect} transparent onRequestClose={() => setOnSelect(false)}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(1,1,1,0.2)' }}>
                <TouchableOpacity activeOpacity={0} style={{ position: 'absolute', height: '100%', width: '100%' }} onPress={() => setOnSelect(false)} />
                <Animatable.View useNativeDriver animation="fadeInUp" duration={200}>
                    <View style={{ width: wp(80), elevation: 1, maxHeight: hp(80), borderRadius: 20, backgroundColor: 'white', overflow: 'hidden' }}>
                        <Subheading style={{ margin: 10, borderBottomWidth: 1, textAlign: "center", fontWeight: 'bold', paddingVertical: 5 }}>Select Gender</Subheading>
                        <FlatList
                            data={['Laki-laki', 'Perempuan']}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={({ item }) => (
                                <List.Item
                                    onPress={() => {
                                        callbackSetStateData(item)
                                        setOnSelect(false)
                                    }}
                                    title={item}
                                    left={props => <List.Icon {...props} icon={item == 'Laki-laki' ? "human-male" : 'human-female'} />}
                                />
                            )}
                        />
                    </View>
                </Animatable.View>
            </View>
        </Modal>
    )
}