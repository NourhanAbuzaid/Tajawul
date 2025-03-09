import { logout } from "@/utils/auth";
import axios from "axios";

// Define allowed routes for GET requests
const getRoutes = {
  getDestinations: "http://tajawul.runasp.net/api/Destination",
};

const postRoutes = {
  signin: "http://tajawul.runasp.net/api/Auth/signin",
  signup: "http://tajawul.runasp.net/api/Auth/signup",
  forgotPass: "http://tajawul.runasp.net/api/Auth/sendResetPasswordEmail",
  newPass: "http://tajawul.runasp.net/api/Auth/resetPassword",
  confirmEmail: "http://tajawul.runasp.net/api/Auth/confirmEmail",
  resendEmail: "http://tajawul.runasp.net/api/Auth/sendEmailVerification",
  refreshToken: "http://tajawul.runasp.net/api/Auth/refreshToken",
  logout: "http://tajawul.runasp.net/api/Auth/logout",

  createDestination: "http://tajawul.runasp.net/api/Destination",
};

export async function GET(req) {
  try {
    const pathname = req.nextUrl.pathname;
    const proxyRoute = pathname.split("/").pop(); // Extract the requested route

    // Validate if the route exists in getRoutes
    const targetURL = getRoutes[proxyRoute];
    if (!targetURL) {
      return new Response(
        JSON.stringify({ message: "Unauthorized API request" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Make GET request to the backend API
    const response = await axios.get(targetURL, {
      headers: { "Content-Type": "application/json", ...req.headers },
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

export async function POST(req) {
  try {
    const pathname = req.nextUrl.pathname;
    const proxyRoute = pathname.split("/").pop();

    const targetURL = postRoutes[proxyRoute];
    if (!targetURL) {
      return new Response(
        JSON.stringify({ message: "Unauthorized API request" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();

    // console.log(targetURL, body, {
    //   headers: { "Content-Type": "application/json", ...req.headers },
    // });

    console.log("Authorization", req.headers.get("Authorization"));
    const response = await axios.post(targetURL, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.get("Authorization"),
      },
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
