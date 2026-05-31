import { pb } from "@/server/pocketbase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email, password } = body;

    const authData = await pb
      .collection("users")
      .authWithPassword(email, password);

    return Response.json(
      {
        success: true,
        message: "Signed in successfully.",
        token: authData.token,
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
          token: authData.token
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to sign in",
        error: error?.response?.message || error?.message || "Unknown error",
        data: error?.response?.data,
      },
      {
        status: error?.status || 401,
      },
    );
  }
}
