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
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const { accessToken, refreshToken, clearTokens } = useAuthStore.getState();

    if (!accessToken) {
      console.warn("No access token available, logging out locally.");
      clearTokens();
      return;
    }
    console.log(accessToken);

    // Try refreshing the token if accessToken is expired
    try {
      await axios.post(
        `${baseUrl}/Auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` }, // Correctly pass headers here
        }
      );
    } catch (logoutError) {
      if (logoutError.response?.status === 401) {
        console.warn("Access token expired, attempting refresh...");

        // Try refreshing the token before retrying logout
        try {
          const refreshResponse = await axios.post(
            `${baseUrl}/Auth/refreshToken`,
            {
              refreshToken,
            }
          );
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            refreshResponse.data;

          useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);

          // Retry logout with the new access token
          await axios.post(
            `${baseUrl}/Auth/logout`,
            {}, // Empty body
            {
              headers: { Authorization: `Bearer ${newAccessToken}` }, // Correctly pass headers here
            }
          );
        } catch (refreshError) {
          console.error("Refresh token also expired, logging out...");
          clearTokens();
          return;
        }
      } else {
        throw logoutError; // Handle other errors
      }
    }

    // If logout API succeeds, clear stored tokens
    clearTokens();
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout failed:", error);
  }
}
