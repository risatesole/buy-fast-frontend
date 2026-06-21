"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export type PatchResult = { success: boolean; error?: string };

export async function patchProductAction(
  id: string,
  formData: FormData,
): Promise<PatchResult> {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
  if (!BACKEND_URL) {
    return { success: false, error: "API URL not configured" };
  }

  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  // ---- TEMP DEBUG: remove after confirming ----
  console.log(
    "[patchProductAction] cookies seen by server action:",
    allCookies.map((c) => c.name),
  );
  // -----------------------------------------------

  const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join("; ");

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/products/${id}/`, {
      method: "PATCH",
      headers: {
        Cookie: cookieHeader,
      },
      body: formData,
      cache: "no-store",
    });

    // ---- TEMP DEBUG ----
    console.log("[patchProductAction] Django response status:", res.status);
    // ---------------------

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      return {
        success: false,
        error: json?.message ?? `Server error ${res.status}`,
      };
    }

    revalidatePath("/admin/products");
    return { success: true };
  } catch (err) {
    console.error("[patchProductAction] error:", err);
    return { success: false, error: "Network error. Please try again." };
  }
}
