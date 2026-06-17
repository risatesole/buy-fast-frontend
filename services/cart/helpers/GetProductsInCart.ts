import type { GetCartResponse } from "@/types/cart/GetCartResponse";

export async function getCart(): Promise<GetCartResponse> {
  const response = await fetch("/api/v1/cart", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<GetCartResponse>;
}
