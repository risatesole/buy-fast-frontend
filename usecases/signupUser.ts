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
  const response = await fetch("/api/v1/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  return response.json();
};
