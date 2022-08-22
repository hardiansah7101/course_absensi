import { createSlice } from '@reduxjs/toolkit'

export const counterConstant = createSlice({
    name: "constant",
    initialState: {
        loading: false,
    },
    reducers: {
        setLoading: (state, { payload }) => {
            state.loading = payload == true
        },
    }
})