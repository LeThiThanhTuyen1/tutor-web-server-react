import api from "@/config/axiosInstance"
import { AxiosError } from "axios"

export const register = async (userData: any) => {
  try {
    const response = await api.post("/auth/register", userData)
    return { succeeded: true, message: response.data }
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return {
        succeeded: false,
        message: error.response.data?.message || "Sign up failed!",
      }
    }
    return { succeeded: false, message: "An unexpected error occurred!" }
  }
}

export const verifyCode = async (email: string, code: string) => {
  try {
    const response = await api.post("/auth/verify", { email, code })
    return { succeeded: true, message: response.data }
  } catch (error) {
    return {
      succeeded: false,
      message: "Invalid or expired verification code.",
    }
  }
}

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { email, password })

    if (response.data.succeeded) {
      localStorage.setItem("accessToken", response.data.data.accessToken)
      localStorage.setItem("refreshToken", response.data.data.refreshToken)

      const userProfile = await getProfile()
      if (userProfile) {
        return { succeeded: true, user: userProfile }
      } else {
        return {
          succeeded: false,
          message: "Failed to retrieve user profile!",
        }
      }
    }

    return { succeeded: false, message: response.data.message }
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response) {
      return {
        succeeded: false,
        message: error.response.data?.message || "Login failed!",
      }
    }
    return { succeeded: false, message: "An unexpected error occurred!" }
  }
}

export const getProfile = async () => {
  try {
    const response = await api.get("/auth/profile")
    return response.data
  } catch (error) {
    throw new Error("Failed to fetch profile")
  }
}

export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken")
    const accessToken = localStorage.getItem("accessToken")

    if (!refreshToken) throw new Error("No refresh token available.")

    const response = await api.post("/auth/refresh", {
      accessToken: accessToken,
      refreshToken: refreshToken,
    })

    if (response.data) {
      const { accessToken, refreshToken: newRefreshToken } = response.data
      localStorage.setItem("accessToken", accessToken)
      localStorage.setItem("refreshToken", newRefreshToken)

      return accessToken
    }
  } catch (error) {
    console.error("Failed to refresh token", error)
    throw error
  }
}

export async function forgotPassword(email: string) {
  try {
    const response = await api.post("/auth/forgot-password", { email })

    return {
      succeeded: true,
      message: response.data || "Verification code sent to your email.",
    }
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return {
        succeeded: false,
        message: error.response.data || "Email does not exist.",
      }
    }
    return {
      succeeded: false,
      message: "An error occurred. Please try again later.",
    }
  }
}

export async function resetPassword(email: string, resetCode: string, newPassword: string) {
  try {
    const response = await api.post("/auth/reset-password", {
      email,
      resetCode,
      newPassword,
    })

    return {
      succeeded: true,
      message: response.data || "Password reset successfully.",
    }
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return {
        succeeded: false,
        message: error.response.data || "Invalid or expired reset code.",
      }
    }
    return {
      succeeded: false,
      message: "An error occurred. Please try again later.",
    }
  }
}

export async function updateProfile(profileData: any) {
  try {
    const response = await api.put("/auth/update-profile", profileData)
    console.log(response)
    return {
      succeeded: true,
      message: response.data || "Profile updated successfully.",
    }
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return {
        succeeded: false,
        message: error.response.data || "Failed to update profile.",
      }
    }
    return {
      succeeded: false,
      message: "An error occurred. Please try again later.",
    }
  }
}

export async function changePassword(oldPassword: string, newPassword: string, confirmNewPassword: string) {
  try {
    const response = await api.post("/auth/change-password", {
      oldPassword,
      newPassword,
      confirmNewPassword,
    })

    return {
      succeeded: true,
      message: response.data.message || "Password changed successfully.",
      errors: response.data.errors || [],
    }
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return {
        succeeded: false,
        message: error.response.data.message || "Failed to change password.",
        errors: error.response.data.errors || [],
      }
    }
    return {
      succeeded: false,
      message: "An error occurred. Please try again later.",
      errors: [],
    }
  }
}

export async function uploadProfileImage(file: File) {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await api.post("/auth/upload-profile-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    console.log("Upload response:", response.data) 

    return {
      succeeded: true,
      message: response.data.message || "Profile image uploaded successfully.",
      profileImage: response.data.profileImage || response.data.image,
    }
  } catch (error) {
    console.error("Upload error:", error)
    if (error instanceof AxiosError && error.response) {
      return {
        succeeded: false,
        message: error.response.data?.message || "Failed to upload profile image.",
      }
    }
    return {
      succeeded: false,
      message: "An error occurred. Please try again later.",
    }
  }
}

