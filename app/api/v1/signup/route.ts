export async function POST(request: Request) {
  try {
    const body = await request.json();
    const backendUrl = process.env.BACKEND_URL;

    const cookie = request.headers.get("cookie");

    const response = await fetch(`${backendUrl}/api/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie ?? "",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return Response.json(data, {
      status: response.status,
    });
  } catch {
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}