import type { Product } from "@/types/products";

export type CartItem = {
  id: number;
  product: Product;
  quantity: number;
};
