export interface SignupRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone: string;
  terms: boolean;
}

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  createdat: string;
  updatedat: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  token: string;
  data: {
    user: User;
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
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("Internal Server Error");
  }

  if (!response.ok) {
    throw new Error(`Unknown error, Failed to create user, if the problem persists contact suppourt`);
  }
  return response.json();
};