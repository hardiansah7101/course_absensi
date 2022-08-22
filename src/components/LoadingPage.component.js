import React from "react";
import { Modal, View } from "react-native";
import { Text } from "react-native-paper";
import * as Animatable from 'react-native-animatable'

export default function LoadingPage({ isLoading, text = 'Please Wait' }) {
    return (
        <Modal visible={isLoading} transparent>
            <View style={{ flex: 1, backgroundColor: 'rgba(1,1,1,0.15)', justifyContent: "center", alignItems: "center" }}>
                <View style={{ backgroundColor: 'white', paddingTop: 30, paddingHorizontal: 20, borderRadius: 20, elevation: 5, overflow: 'hidden', alignItems: "center" }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Animatable.View style={{ marginHorizontal: 3 }} useNativeDriver animation="bounce" iterationCount="infinite">
                            <View style={{ height: 15, width: 15, backgroundColor: 'black' }} />
                        </Animatable.View>
                        <Animatable.View style={{ marginHorizontal: 3 }} useNativeDriver animation="bounce" iterationCount="infinite">
                            <View style={{ height: 15, width: 15, backgroundColor: 'black' }} />
                        </Animatable.View>
                        <Animatable.View style={{ marginHorizontal: 3 }} useNativeDriver animation="bounce" iterationCount="infinite">
                            <View style={{ height: 15, width: 15, backgroundColor: 'black' }} />
                        </Animatable.View>
                    </View>
                    <Text style={{ paddingVertical: 20, color: 'black', textShadowColor: 'white', textShadowRadius: 1, textShadowOffset: { width: 1, height: 1 }, fontSize: 20 }}>{text}</Text>
                </View>
            </View>
        </Modal>
    )
}