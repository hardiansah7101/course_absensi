import { getLoginData, removeAuthStorage } from "./authStorage.helper"
import axios from 'axios'
import { API_URL } from "../configs/baseurl.config"
import { store } from "../redux/store"
import { counterUser } from "../redux/counter/user.counter"

export const errorResponse = async (error) => {
    console.log(error)
    return {
        success: false,
        status: error?.response?.status || 500,
        message: error?.response?.message || error?.response?.data?.message || error?.response?.data?.error || error?.response?.data?.status || 'Something went wrong!'
    }
}

export const successResponse = async (response) => {
    return {
        success: parseInt(response.data?.status || 200) == 200,
        status: parseInt(response.data?.status || 200),
        message: (response.data.message && typeof response.data.message == 'object' ? response.data.message.error || response.data.message.status : response.data.message) || null,
        data: response.data.data || response.data,
    }
}

export const reloginResponse = async () => {
    store.dispatch(counterUser.actions.setRelogin(true))
    return await errorResponse({
        response: {
            status: 401,
            message: 'Unauthorized'
        }
    })
}

export const callApi = () => {

    const refreshToken = async (method, data) => {
        try {
            const loginData = await getLoginData()
            if (loginData.remember == 0) {
                return await reloginResponse()
            }
            // if (!loginData.refresh_token) {
            //     return await reloginResponse()
            // }

            const response = await axios.post(`${API_URL}/oauth/token`, {
                // grant_type: 'refresh_token',
                // client_id: 'my-client-apps',
                // client_secret: 'password',
                // refreshToken: loginData.refresh_token
                username: loginData.email,
                password: loginData.password,
                grant_type: 'password',
                client_id: 'my-client-web',
                client_secret: loginData.password,
            })

            if (response.data) {
                const storeLoginData = await storeLoginData({
                    ...loginData,
                    access_token: response.data.access_token,
                    refresh_token: response.data.refresh_token,
                    scope: response.data.scope,
                    token_type: response.data.token_type,
                    expires_in: response.data.expires_in,
                })
                if (storeLoginData) {
                    if (method == 'post') {
                        return await post(data.url, data.payload, data.optionalHeader, data.optionalConfig)
                    } else if (method == 'get') {
                        return await get(data.url, data.optionalHeader, data.optionalConfig)
                    } else {
                        return await errorResponse()
                    }
                } else {
                    return await reloginResponse()
                }
            }

        } catch (error) {
            // if (error?.response?.data?.error && error.response.data.error == 'invalid_grant') {
            //     return await reloginResponse()
            // }
            if (error?.response?.data?.error && error.response.data.error == 'invalid_client') {
                return await reloginResponse()
            }
            return await errorResponse(error)
        }
    }

    const post = async (url, payload, optionalHeader = {}, optionalConfig = {}) => {
        const apiUrl = `${API_URL}/${url}`;
        console.log(apiUrl)
        try {
            const loginData = await getLoginData()
            const headers = {
                Authorization: loginData ? `${loginData.token_type} ${loginData.access_token}` : null,
                ...optionalHeader
            }
            const config = {
                headers,
                ...optionalConfig
            }

            const response = await axios.post(apiUrl, payload, config)
            
            return await successResponse(response)
        } catch (error) {
            if (error?.response?.data?.error && error.response.data.error == 'invalid_token') {
                return await refreshToken('post', { url, payload, optionalHeader, optionalConfig })
            }
            return await errorResponse(error)
        }
    }

    const get = async (url, optionalHeader = {}, optionalConfig = {}) => {
        const apiUrl = `${API_URL}/${url}`;
        console.log(apiUrl)
        try {
            const loginData = await getLoginData()
            const headers = {
                Authorization: loginData ? `${loginData.token_type} ${loginData.access_token}` : null,
                ...optionalHeader
            }
            const config = {
                headers,
                ...optionalConfig
            }

            const response = await axios.get(apiUrl, config)
            
            // return await reloginResponse()

            return await successResponse(response)
        } catch (error) {
            if (error?.response?.data?.error && error.response.data.error == 'invalid_token') {
                return await refreshToken('post', { url, payload, optionalHeader, optionalConfig })
            }
            return await errorResponse(error)
        }
    }

    return { post, get }
}