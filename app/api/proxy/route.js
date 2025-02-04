import axios from "axios";

export async function POST(req) {
  try {
    const body = await req.json(); // Read the request body
    const response = await axios.post(
      "http://tajawul.runasp.net/api/Auth/signin",
      body,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

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
