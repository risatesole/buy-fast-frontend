import { pb } from "@/server/pocketbase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { firstname, lastname, email, password } = body;

    const data = {
      email,
      emailVisibility: true,
      firstname,
      lastname,
      password,
      passwordConfirm: password,
    };

    await pb.collection("users").create(data);

    const authData = await pb
      .collection("users")
      .authWithPassword(email, password);

    await pb.collection("users").requestVerification(email);

    return Response.json(
      {
        success: true,
        message: "User created successfully.",
        token: authData.token,
        data: {
          user: {
            id: authData.record.id,
            firstname: authData.record.firstname,
            lastname: authData.record.lastname,
            email: authData.record.email,
            createdat: authData.record.created,
            updatedat: authData.record.updated
          },
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to create user",
        error: error?.response?.message || error?.message || "Unknown error",
        data: error?.response?.data,
      },
      {
        status: error?.status || 500,
      },
    );
  }
}
