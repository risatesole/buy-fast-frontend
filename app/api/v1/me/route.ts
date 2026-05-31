import { pb } from "@/server/pocketbase";

export async function GET(request: Request) {
  try {
    const authorization = request.headers.get("Authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return Response.json(
        {
          success: false,
          message: "Authorization token is required.",
        },
        { status: 401 },
      );
    }

    const token = authorization.replace("Bearer ", "").trim();

    pb.authStore.save(token, null);

    const authData = await pb.collection("users").authRefresh();

    return Response.json(
      {
        success: true,
        data: {
          user: {
            id: authData.record.id,
            firstname: authData.record.firstname,
            lastname: authData.record.lastname,
            email: authData.record.email,
            avatar: authData.record.avatar,
            verified: authData.record.verified,
            createdat: authData.record.created,
            updatedat: authData.record.updated,
          },
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: "Invalid or expired token",
        error: error?.response?.message || error?.message,
      },
      { status: 401 },
    );
  }
}
