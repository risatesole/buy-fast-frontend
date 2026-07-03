'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export type CategoryResult = {
  success: boolean;
  error?: string;
  data?: {
    id: number;
    name: string;
    slug: string;
    description: string;
    image: string | null;
    status: boolean;
  };
};

export async function createCategoryAction(categoryData: {
  name: string;
  slug: string;
  description: string;
  image: string | null;
  status: boolean;
}): Promise<CategoryResult> {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
  if (!BACKEND_URL) {
    return { success: false, error: 'API URL not configured' };
  }

  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const cookieHeader = allCookies.map(c => `${c.name}=${c.value}`).join('; ');

  console.log('[createCategoryAction] Sending data:', categoryData);

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/products/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      body: JSON.stringify(categoryData),
      cache: 'no-store',
    });

    console.log('[createCategoryAction] Response status:', res.status);

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      console.error('[createCategoryAction] Error response:', json);
      return {
        success: false,
        error: json?.message || json?.error || `Server error ${res.status}`,
      };
    }

    const json = await res.json();
    console.log('[createCategoryAction] Success response:', json);

    revalidatePath('/admin/products/categories');
    return {
      success: true,
      data: json.data,
    };
  } catch (err) {
    console.error('[createCategoryAction] error:', err);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

export async function updateCategoryAction(
  id: string,
  categoryData: {
    name: string;
    slug: string;
    description: string;
    image: string | null;
    status: boolean;
  }
): Promise<CategoryResult> {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
  if (!BACKEND_URL) {
    return { success: false, error: 'API URL not configured' };
  }

  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const cookieHeader = allCookies.map(c => `${c.name}=${c.value}`).join('; ');

  // The URL should include the ID with a trailing slash
  const url = `${BACKEND_URL}/api/v1/products/categories/${id}/`;
  console.log('[updateCategoryAction] Updating category at URL:', url);
  console.log('[updateCategoryAction] Sending data:', categoryData);

  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      body: JSON.stringify(categoryData),
      cache: 'no-store',
    });

    console.log('[updateCategoryAction] Response status:', res.status);

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      console.error('[updateCategoryAction] Error response:', json);
      return {
        success: false,
        error: json?.message || json?.error || `Server error ${res.status}`,
      };
    }

    const json = await res.json();
    console.log('[updateCategoryAction] Success response:', json);

    revalidatePath('/admin/products/categories');
    return {
      success: true,
      data: json.data,
    };
  } catch (err) {
    console.error('[updateCategoryAction] error:', err);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

export async function deleteCategoryAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
  if (!BACKEND_URL) {
    return { success: false, error: 'API URL not configured' };
  }

  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const cookieHeader = allCookies.map(c => `${c.name}=${c.value}`).join('; ');

  const url = `${BACKEND_URL}/api/v1/products/categories/${id}/`;
  console.log('[deleteCategoryAction] Deleting category at URL:', url);

  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        Cookie: cookieHeader,
      },
      cache: 'no-store',
    });

    console.log('[deleteCategoryAction] Response status:', res.status);

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      console.error('[deleteCategoryAction] Error response:', json);
      return {
        success: false,
        error: json?.message || json?.error || `Server error ${res.status}`,
      };
    }

    revalidatePath('/admin/products/categories');
    return { success: true };
  } catch (err) {
    console.error('[deleteCategoryAction] error:', err);
    return { success: false, error: 'Network error. Please try again.' };
  }
}
