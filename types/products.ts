import type { ProductCategory } from "./ProductCategory";
export type Product = {
  id: number;
  name: string;
  category: ProductCategory;
  price: number;
  /** Optional label shown as a small badge on the card (e.g. "New", "Bestseller") */
  badge?: string;
};

