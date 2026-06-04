export interface SignupRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone: string;
  terms: boolean;
}

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface session {
  id: string;
  created_at: string;
  updated_at: string;
}

interface tokens {
  access_token: {
    token: string;
    expires_in: number;
    updated_at: string;
  };
  refresh_token: {
    token: string;
    expires_in: number;
    created_at: string;
  };
}

export interface SignupResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    session: session;
    tokens: tokens;
    terms: boolean;
  };
}

export const SignupUser = async (
  payload: SignupRequest,
): Promise<SignupResponse> => {
  let response: Response;

  try {
    response = await fetch("/api/v1/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("Internal Server Error");
  }

  if (!response.ok) {
    throw new Error(
      `Unknown error, Failed to create user, if the problem persists contact suppourt`,
    );
  }
  return response.json();
};
