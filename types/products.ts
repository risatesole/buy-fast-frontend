import type { HardCodedProductCategory } from "./ProductCategory";



type Category = {
  id: number;
  name: string;
  slug: string;
  image: string;
  status: boolean;
}

export type Product = {
  id: number;
  name: string;
  description: string;
  category: Category;
  image: string | null;
  brand: string;
  selling_price: number;
  status: boolean;
  tags: string[];
};