import type { HardCodedProductCategory } from "./ProductCategory";

export type Product = {
  id: number;
  name: string;
  description: string;
  category: string;
  image: string | null;
  brand: string;
  selling_price: number;
  status: boolean;
  tags: string[];
};