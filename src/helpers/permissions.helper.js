import * as Location from 'expo-location';

export const requestPermissionLocation = async () => {
    try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            return {
                success: false,
                message: 'Permission to access location was denied!' 
            };
        }
        return {
            success: true,
            message: 'Permission granted' 
        };
    } catch (error) {
        return {
            success: false,
            message: 'Something wrong to access permission!' 
        };
    }
}