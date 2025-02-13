import { logout } from "@/utils/auth";
import axios from "axios";

export async function POST(req) {
  try {
    // Extract dynamic route from URL
    const pathname = req.nextUrl.pathname;
    const proxyRoute = pathname.split("/").pop(); // Get the last segment of the path

    // Define the allowed routes with their corresponding API URLs
    const allowedRoutes = {
      signin: "http://tajawul.runasp.net/api/Auth/signin",
      signup: "http://tajawul.runasp.net/api/Auth/signup",
      forgotPass: "http://tajawul.runasp.net/api/Auth/sendResetPasswordEmail",
      newPass: "http://tajawul.runasp.net/api/Auth/resetPassword",
      confirmEmail: "http://tajawul.runasp.net/api/Auth/confirmEmail",
      resendEmail: "http://tajawul.runasp.net/api/Auth/sendEmailVerification",
      refreshToken: "http://tajawul.runasp.net/api/Auth/refreshToken",
      logout: "http://tajawul.runasp.net/api/Auth/logout",
    };

    // Validate the requested route
    const targetURL = allowedRoutes[proxyRoute];
    if (!targetURL) {
      return new Response(
        JSON.stringify({ message: "Unauthorized API request" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Parse request body
    const body = await req.json();

    // Send request to the backend API
    const response = await axios.post(targetURL, body, {
      headers: { "Content-Type": "application/json" },
    });

    return new Response(JSON.stringify(response.data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: error.response?.data?.message || "Server Error",
      }),
      {
        status: error.response?.status || 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
