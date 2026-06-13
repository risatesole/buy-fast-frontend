// app/admin/products/types.ts
//
// All shared type definitions for the products admin section.
// Import from here so every file speaks the same language.

// ── What the Django API actually returns ──────────────────────────────────────

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  image: string;
  status: boolean;
}

export interface ApiProductImage {
  url: string;
  type: string;
}

export interface ApiProduct {
  id: number;
  name: string;
  description: string;
  brand: string;
  selling_price: number;
  status: boolean;
  category: ApiCategory;
  images: ApiProductImage[];
  tags: string[];
}

export interface ApiCursorPage {
  next: string | null;
  previous: string | null;
  results: ApiProduct[];
}

// ── What the table and modals actually work with ──────────────────────────────

export type ProductStatus = "Active" | "Archived";

export interface ProductImageSet {
  heroImage?: string;
  flatlayImage?: string;
  scaleImage?: string;
  packingImage?: string;
  freezeFrameImage?: string;
}

export interface DisplayProduct extends ProductImageSet {
  id: string;
  name: string;
  category: string;
  categoryId: number;
  tags: string[];
  price: number;
  stock: number;
  status: ProductStatus;
  description: string;
  brand: string;
}

// ── The shape of the add / edit form ─────────────────────────────────────────

export interface ProductFormValues {
  name: string;
  description: string;
  brand: string;
  price: number;
  stock: number;
  status: ProductStatus;
  categoryId: number;
  category: string;
  tags: string[];
}
