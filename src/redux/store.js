import { configureStore } from '@reduxjs/toolkit'
import { counterConstant } from './counter/constant.counter'
import { counterUser } from './counter/user.counter'

export const store = configureStore({
  reducer: {
    constant: counterConstant.reducer,
    user: counterUser.reducer,
  },
})