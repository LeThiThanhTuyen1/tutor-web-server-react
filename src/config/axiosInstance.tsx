// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { refreshAccessToken } from "@/services/authService";
import axios from "axios";
export const API_BASE_URL = "http://localhost:5171";

const api = axios.create({
  baseURL: "http://localhost:5171/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         console.log("Refreshing access token...");
//         const newAccessToken = await refreshAccessToken();
//         console.log("New Access Token:", newAccessToken);

//         if (!newAccessToken) {
//           throw new Error("No new access token received.");
//         }

//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return api(originalRequest);
//       } catch (err) {
//         console.error("Session expired. Redirecting to login.");
//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("refreshToken");
//         window.location.href = "/auth/login";
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default api;
