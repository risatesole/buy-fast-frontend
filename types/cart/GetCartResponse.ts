import type { Product } from "@/types/products";

export type CartItem = {
  id: number;
  product: Product;
  quantity: number;
};

export type GetCartResponse = {
  status: string;
  data: {
    items: CartItem[];
  };
};
