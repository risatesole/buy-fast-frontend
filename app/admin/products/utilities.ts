// app/admin/products/utilities.ts
//
// Pure helper functions with no side effects.
// These do not import React, so they are safe to call anywhere.

import type { ApiProduct, DisplayProduct } from "./types";

const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/** Turn a relative path from Django into an absolute URL the browser can load. */
export function makeAbsoluteUrl(url?: string): string | undefined {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${backendBaseUrl}${url}`;
}

/** Convert a raw Django product object into the shape the table and modals use. */
export function convertApiProductToDisplayProduct(apiProduct: ApiProduct): DisplayProduct {
  const findImageByType = (imageType: string) =>
    makeAbsoluteUrl(
      apiProduct.images?.find((image) => image.type === imageType)?.url
    );

  return {
    id: apiProduct.id.toString(),
    name: apiProduct.name,
    category: apiProduct.category?.name ?? "Uncategorized",
    categoryId: apiProduct.category?.id ?? 1,
    tags: apiProduct.tags ?? [],
    price: apiProduct.selling_price,
    stock: 0, // Placeholder until the API exposes a stock field.
    status: apiProduct.status ? "Active" : "Archived",
    description: apiProduct.description,
    brand: apiProduct.brand,
    heroImage: findImageByType("HERO"),
    flatlayImage: findImageByType("FLATLAY"),
    scaleImage: findImageByType("SCALE"),
    packingImage: findImageByType("PACKING"),
    freezeFrameImage: findImageByType("FREEZE_FRAME"),
  };
}

/** Turn a string into a URL-friendly slug, e.g. "Running Shoes" → "running-shoes". */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export { backendBaseUrl };
