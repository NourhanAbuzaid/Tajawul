import axios from "axios";

const API_URL = "/api/proxy/signin";

export async function login(email, password) {
  try {
    const response = await axios.post(API_URL, { email, password });

    // Extract tokens
    const { token, refreshToken } = response.data;

    if (!token || !refreshToken) {
      throw new Error("Invalid response from server");
    }

    // Store tokens in localStorage
    localStorage.setItem("authToken", token);
    localStorage.setItem("refreshToken", refreshToken);

    return true; // ✅ Login successful
  } catch (error) {
    console.error(
      "Login Failed:",
      error.response?.data?.message || error.message
    );
    return false; // ❌ Login failed
  }
}

export function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login"; // Redirect user after logout
}
