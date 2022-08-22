import AsyncStorage from "@react-native-async-storage/async-storage"

export const STORAGE_DATA_LOGIN = 'STORAGE_DATA_LOGIN'
export const STORAGE_DATA_USER = 'STORAGE_DATA_USER'

export const storeLoginData = async (authLogin) => {
    try {
        await AsyncStorage.setItem(STORAGE_DATA_LOGIN, JSON.stringify(authLogin))
        return true
    } catch (error) {
        return false        
    }
}

export const getLoginData = async () => {
    try {
        const authLogin = await AsyncStorage.getItem(STORAGE_DATA_LOGIN)
        return JSON.parse(authLogin)
    } catch (error) {
        return null
    }
}

export const storeDataUser = async (user) => {
    try {
        await AsyncStorage.setItem(STORAGE_DATA_USER, JSON.stringify(user))
        return true
    } catch (error) {
        return false
    }
}

export const getDataUser = async () => {
    try {
        const dataUser = await AsyncStorage.getItem(STORAGE_DATA_USER)
        return JSON.parse(dataUser)
    } catch (error) {
        return null
    }
}

export const removeAuthStorage = async () => {
    try {
        await AsyncStorage.multiRemove([
            // STORAGE_AUTH_TOKEN,
            // STORAGE_REFRESH_TOKEN,
            STORAGE_DATA_LOGIN,
            STORAGE_DATA_USER
        ])
        return true
    } catch (error) {
        return false
    }
}