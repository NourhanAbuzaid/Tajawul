import axios from "axios";
import useAuthStore from "@/store/authStore";
import Router from "next/router";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // Use the base URL from environment variables

const API = axios.create({
  baseURL: baseUrl, // Use the base URL here
  headers: { "Content-Type": "application/json" },
});

// Attach access token and refresh if about to expire
API.interceptors.request.use(
  async (config) => {
    const { accessToken, refreshToken, setTokens, clearTokens } =
      useAuthStore.getState();

    if (accessToken) {
      // Decode the access token to check its expiry time
      const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
      const expiryTime = decodedToken.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();

      console.log("Token expiry time:", new Date(expiryTime).toLocaleString());
      console.log("Current time:", new Date(currentTime).toLocaleString());

      // If the token is about to expire (e.g., within 5 minutes), refresh it
      if (expiryTime - currentTime < 5 * 60 * 1000) {
        console.log("Token is about to expire. Refreshing...");

        try {
          const response = await axios.post(`${baseUrl}/Auth/refreshToken`, {
            refreshToken,
          });

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            response.data;

          console.log("New access token:", newAccessToken);
          console.log("New refresh token:", newRefreshToken);

          setTokens(newAccessToken, newRefreshToken); // Update tokens in store
          config.headers.Authorization = `Bearer ${newAccessToken}`; // Update request headers
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError);
          clearTokens(); // Clear tokens if refresh fails
          Router.push("/login"); // Redirect to login
        }
      } else {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
