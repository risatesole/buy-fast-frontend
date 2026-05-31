import type { HardCodedProductCategory } from "./ProductCategory";
export type Product = {
  id: number;
  name: string;
  category: HardCodedProductCategory;
  price: number;
  /** Optional label shown as a small badge on the card (e.g. "New", "Bestseller") */
  badge?: string;
  create: Date;
  update: Date;
};
