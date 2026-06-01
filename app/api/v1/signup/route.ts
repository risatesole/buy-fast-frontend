export async function POST(request: Request) {
  try {
    const body = await request.json();
    const backendUrl = process.env.BACKEND_URL;

<<<<<<< Updated upstream
    const response = await fetch(`${backendUrl}/api/v1/signup`, {
=======
    if (!backendUrl) {
      throw new Error("BACKEND_URL is not defined");
    }

    const response = await fetch(`${backendUrl}/api/v1/signup/`, {
>>>>>>> Stashed changes
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    const headers = new Headers();
    const setCookie = response.headers.get("set-cookie");

    if (setCookie) {
      headers.append("Set-Cookie", setCookie);
    }

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers,
    });

  } catch {
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
