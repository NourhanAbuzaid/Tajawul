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
    const { accessToken, clearTokens } = useAuthStore.getState();
    if (!accessToken) return; // ✅ Prevents unnecessary API calls

    await axios.post(
      "/api/proxy/logout",
      { token: accessToken }, // ✅ Send only the access token
      { headers: { Authorization: `Bearer ${accessToken}` } } // ✅ Attach token in headers
    );

    clearTokens(); // ✅ Clears tokens from Zustand & localStorage
    // 🔹 Redirect to login page
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout failed:", error);
  }
}
