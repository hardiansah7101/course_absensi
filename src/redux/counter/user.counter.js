import { createSlice } from '@reduxjs/toolkit'
import { getThunkUser, thunkLogout } from '../action/user.action'

const initialState = {
    loading: true,
    remember: false,
    data: null,
    relogin: false,
}

export const counterUser = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, { payload }) => {
            state.data = payload
        },
        setRelogin: (state) => {
            state.data = true
        },
        resetData: (state) => {
            state.loading = true
            state.remember = false
            state.data = null
            state.relogin = false
        },
        setRelogin: (state, { payload }) => {
            state.relogin = payload
        },
    },
    extraReducers: (builder) => {
        // Case on get thunk user
        builder.addCase(getThunkUser.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getThunkUser.fulfilled, (state, { payload }) => {
            state.loading = false
            state.remember = payload.remember
            state.data = payload.data
        })
        builder.addCase(getThunkUser.rejected, (state, { payload }) => {
            state.loading = false
            state.remember = false
            state.data = null
        })
        
        // Case on logout
        builder.addCase(thunkLogout.pending, (state) => {
            state.loading = true
        })
        builder.addCase(thunkLogout.fulfilled, (state, { payload }) => {
            state.loading = initialState.loading
            state.remember = initialState.remember
            state.data = initialState.data
            state.relogin = initialState.relogin
        })
        builder.addCase(thunkLogout.rejected, (state, { payload }) => {
            state.loading = initialState.loading
            state.remember = initialState.remember
            state.data = initialState.data
            state.relogin = initialState.relogin
        })
    }
})