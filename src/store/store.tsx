import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
// import notificationReducer from "./notificationSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // notifications: notificationReducer,
    // Add other reducers here as needed
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

