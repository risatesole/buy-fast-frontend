'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export type CreateResult = { success: boolean; error?: string };

export async function createProductAction(formData: FormData): Promise<CreateResult> {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
  if (!BACKEND_URL) {
    return { success: false, error: 'API URL not configured' };
  }

  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  // ---- TEMP DEBUG: remove after confirming ----
  console.log(
    '[createProductAction] cookies seen by server action:',
    allCookies.map(c => c.name)
  );
  // -----------------------------------------------

  const cookieHeader = allCookies.map(c => `${c.name}=${c.value}`).join('; ');

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/products/`, {
      method: 'POST',
      headers: {
        Cookie: cookieHeader,
      },
      body: formData,
      cache: 'no-store',
    });

    // ---- TEMP DEBUG ----
    console.log('[createProductAction] Django response status:', res.status);
    // ---------------------

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      return {
        success: false,
        error: json?.message ?? `Server error ${res.status}`,
      };
    }

    revalidatePath('/admin/products');
    return { success: true };
  } catch (err) {
    console.error('[createProductAction] error:', err);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

// Keep the existing patch function if needed
export type PatchResult = { success: boolean; error?: string };

export async function patchProductAction(id: string, formData: FormData): Promise<PatchResult> {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
  if (!BACKEND_URL) {
    return { success: false, error: 'API URL not configured' };
  }

  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  const cookieHeader = allCookies.map(c => `${c.name}=${c.value}`).join('; ');

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/products/${id}/`, {
      method: 'PATCH',
      headers: {
        Cookie: cookieHeader,
      },
      body: formData,
      cache: 'no-store',
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      return {
        success: false,
        error: json?.message ?? `Server error ${res.status}`,
      };
    }

    revalidatePath('/admin/products');
    return { success: true };
  } catch (err) {
    console.error('[patchProductAction] error:', err);
    return { success: false, error: 'Network error. Please try again.' };
  }
}
