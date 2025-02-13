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

      try {
        const { refreshToken, setTokens, clearTokens } =
          useAuthStore.getState();
        if (!refreshToken) throw new Error("No refresh token available");

        // Refresh the access token
        const response = await axios.post("/api/proxy/refreshToken", {
          refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data;

        setTokens(newAccessToken, newRefreshToken); // ✅ Store new tokens

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token expired, logging out...");
        clearTokens();
        Router.push("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default API;
