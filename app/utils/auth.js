import axios from "axios";
import useAuthStore from "@/store/authStore";

export async function login(email, password) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    if (!baseUrl) {
      throw new Error("API base URL is not defined in environment variables.");
    }

    const response = await axios.post(`${baseUrl}/Auth/signin`, {
      email,
      password,
    });

    // Extract tokens and roles
    const { token, refreshToken, role } = response.data;

    if (!token || !refreshToken || !role) {
      throw new Error("Invalid response from server");
    }

    // Store access token, refresh token, and roles
    useAuthStore.getState().setAuth(token, refreshToken, [role]);

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
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    const { accessToken, refreshToken, clearAuth } = useAuthStore.getState();

    if (!accessToken) {
      console.warn("No access token available, logging out locally.");
      clearAuth();
      return;
    }

    // Attempt logout with current token
    try {
      await axios.post(
        `${baseUrl}/Auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
    } catch (logoutError) {
      if (logoutError.response?.status === 401) {
        console.warn("Access token expired, attempting refresh...");

        // Refresh token
        try {
          const refreshResponse = await axios.post(
            `${baseUrl}/Auth/refreshToken`,
            { refreshToken }
          );

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            refreshResponse.data;

          // Update only tokens, not roles during refresh
          useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);

          // Retry logout
          await axios.post(
            `${baseUrl}/Auth/logout`,
            {},
            {
              headers: { Authorization: `Bearer ${newAccessToken}` },
            }
          );
        } catch (refreshError) {
          console.error("Refresh token also expired, logging out...");
          clearAuth();
          window.location.href = "/login";
          return;
        }
      } else {
        throw logoutError; // Handle other errors
      }
    }

    // Clear all stored auth info
    clearAuth();
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout failed:", error);
  }
}
