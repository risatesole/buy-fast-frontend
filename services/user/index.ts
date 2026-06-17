import { cookies } from "next/headers";

export default class UserService {
  async getCurrentUser() {
    const cookieStore = await cookies();

    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/me`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return data.data.user;
  }
}
