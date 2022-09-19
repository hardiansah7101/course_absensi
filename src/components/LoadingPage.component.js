import React from "react";
import { ActivityIndicator, Modal, View } from "react-native";
import { Text } from "react-native-paper";

export default function LoadingPage({ isLoading, text = 'Please Wait' }) {
    return (
        <Modal visible={isLoading} transparent>
            <View style={{ flex: 1, backgroundColor: 'rgba(1,1,1,0.15)', justifyContent: "center", alignItems: "center" }}>
                <View style={{ backgroundColor: 'white', paddingTop: 30, paddingHorizontal: 20, borderRadius: 20, elevation: 5, overflow: 'hidden', alignItems: "center" }}>
                    <View style={{ flexDirection: 'row' }}>
                        <ActivityIndicator size={40} />
                    </View>
                    <Text style={{ paddingVertical: 20, color: 'black', textShadowColor: 'white', textShadowRadius: 1, textShadowOffset: { width: 1, height: 1 }, fontSize: 20 }}>{text}</Text>
                </View>
            </View>
        </Modal>
    )
}