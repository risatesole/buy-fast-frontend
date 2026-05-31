export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("Authorization");

    if (!authorization) {
      return Response.json(
        {
          success: false,
          message: "Authorization header is required.",
        },
        { status: 401 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Signed out successfully.",
      },
      { status: 200 },
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: "Failed to sign out",
        error: error?.message || "Unknown error",
      },
      { status: 500 },
    );
  }
}
