import { createAsyncThunk } from '@reduxjs/toolkit'
import { getLoginData, removeAuthStorage } from '../../helpers/authStorage.helper'
import { callApi } from '../../helpers/request.helper'

export const getThunkUser = createAsyncThunk('user/getThunkUser', async (_, thunkApi) => {
    try {
        const loginData = await getLoginData()
        // console.log(loginData)
        if (loginData) {
            const result = await callApi().get(`user/detail-profile`)
            if (result.success) {
                return {
                    data: result.data,
                    remember: loginData.remember == 1,
                }
            } else {
                await removeAuthStorage()
            }
        }

        return {
            data: null,
            remember: false
        }
    } catch (error) {
        return {
            data: null,
            remember: false
        }
    }
})

export const thunkLogout = createAsyncThunk('user/logout', async (_, thunkApi) => {
    await removeAuthStorage()
    return true
})