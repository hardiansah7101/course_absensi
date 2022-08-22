import { Platform, ToastAndroid } from "react-native";

export const ToastShow = (text) => {
    if (Platform.OS == 'android') {
        ToastAndroid.show(text, ToastAndroid.LONG)
    }
}