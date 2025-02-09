import axios from "axios";
import useAuthStore from "@/store/authStore";
import Router from "next/router";

const API = axios.create({
  baseURL: "/api/proxy", // ✅ Proxying all requests through Next.js API
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach token
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

// Response Interceptor: Handle 401 errors
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent loop

      try {
        const { refreshToken, setTokens, clearTokens } =
          useAuthStore.getState();
        if (!refreshToken) throw new Error("No refresh token available");

        // Refresh token using the proxy API
        const response = await axios.post("/api/proxy/refreshToken", {
          refreshToken,
        });

        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;

        // Update tokens
        setTokens(newAccessToken, newRefreshToken);

        // Retry request with new token
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
