import type { CartItem } from "@/types/cart/CartItem";

export type GetCartResponse = {
  status: string;
  data: {
    items: CartItem[];
  };
};
