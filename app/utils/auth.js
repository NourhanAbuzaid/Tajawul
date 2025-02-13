import axios from "axios";
import useAuthStore from "@/store/authStore";

export async function login(email, password) {
  try {
    const response = await axios.post("/api/proxy/signin", { email, password });

    // Extract tokens
    const { token, refreshToken } = response.data;

    if (!token || !refreshToken) {
      throw new Error("Invalid response from server");
    }

    // Store both tokens
    useAuthStore.getState().setTokens(token, refreshToken);

    return true; // ✅ Login successful
  } catch (error) {
    console.error(
      "Login Failed:",
      error.response?.data?.message || error.message
    );
    return false; // ❌ Login failed
  }
}

export async function logout() {
  try {
    // 🔹 Send a logout request through the proxy to invalidate the refresh token
    await axios.post("/api/proxy/logout", {}, { withCredentials: true });

    // 🔹 Clear tokens from Zustand & localStorage
    useAuthStore.getState().clearTokens();

    // 🔹 Redirect to login page
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout failed:", error);
  }
}
