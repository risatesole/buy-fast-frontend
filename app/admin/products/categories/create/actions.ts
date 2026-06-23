"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export type CreateCategoryResult = {
  success: boolean;
  error?: string;
  data?: {
    id: number;
    name: string;
    slug: string;
    description: string;
    image: string;
    status: boolean;
  };
};

export async function createCategoryAction(categoryData: {
  name: string;
  slug: string;
  description: string;
  image: string;
  status: boolean;
}): Promise<CreateCategoryResult> {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
  if (!BACKEND_URL) {
    return { success: false, error: "API URL not configured" };
  }

  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  // Create cookie header string
  const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join("; ");

  console.log(
    "[createCategoryAction] Sending cookies:",
    allCookies.map((c) => c.name),
  );
  console.log("[createCategoryAction] Cookie header:", cookieHeader);
  console.log("[createCategoryAction] Sending data:", categoryData);

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/products/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(categoryData),
      cache: "no-store",
    });

    console.log("[createCategoryAction] Response status:", res.status);

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      console.error("[createCategoryAction] Error response:", json);
      return {
        success: false,
        error: json?.message || json?.error || `Server error ${res.status}`,
      };
    }

    const json = await res.json();
    console.log("[createCategoryAction] Success response:", json);

    revalidatePath("/admin/products/categories");
    return {
      success: true,
      data: json.data,
    };
  } catch (err) {
    console.error("[createCategoryAction] error:", err);
    return { success: false, error: "Network error. Please try again." };
  }
}
