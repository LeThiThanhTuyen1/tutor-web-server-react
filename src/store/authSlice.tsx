import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { AuthState } from "@/types/auth-state-type"

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<any>) {
      state.isAuthenticated = true
      state.user = action.payload
      state.error = null
    },
    logout(state) {
      state.isAuthenticated = false
      state.user = null
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload
      state.isLoading = false
    },
    updateUser: (state, action: PayloadAction<any>) => {
      if (state.user) {
        console.log("Updating user in Redux:", action.payload)

        const updatedUser = {
          ...state.user,
          ...action.payload,
          image: action.payload.image || state.user.image,
        }
        state.user = updatedUser
      }
    },
  },
})

export const { login, logout, setLoading, setError, updateUser } = authSlice.actions
export default authSlice.reducer

