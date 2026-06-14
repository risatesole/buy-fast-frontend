// warning temporary tape code
// types
import type { Product } from "@/types/products";
import type { CartItem } from "@/types/CartItem";

export function addProductToCart(
  currentCart: CartItem[],
  product: Product,
): CartItem[] {
  throw new Error("Unimplemented method.");
}

export function removeProductFromCart(
  currentCart: CartItem[],
  productId: number,
): CartItem[] {
  throw new Error("Method not implemented.");
}