import axios from "axios";
import useAuthStore from "@/store/authStore";
import Router from "next/router";

const API = axios.create({
  baseURL: "/api/proxy",
  headers: { "Content-Type": "application/json" },
});

// Attach access token
API.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired access token
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log("Access token expired. Attempting to refresh token..."); // Debug: Log token refresh attempt

      try {
        const { refreshToken, setTokens, clearTokens } =
          useAuthStore.getState();
        if (!refreshToken) {
          console.error("No refresh token available. Logging out..."); // Debug: Log if no refresh token is available
          throw new Error("No refresh token available");
        }

        // Refresh the access token
        const response = await axios.post("/api/proxy/refreshToken", {
          refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data;

        console.log("New accessToken:", newAccessToken); // Debug: Log the new access token
        console.log("New refreshToken:", newRefreshToken); // Debug: Log the new refresh token

        setTokens(newAccessToken, newRefreshToken); // Store new tokens

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token expired, logging out...", refreshError); // Debug: Log if refresh token is also expired
        clearTokens();
        Router.push("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default API;
