// warning temporary tape code
// types
import type { Product } from "@/types/products";
import type { CartItem } from "@/types/CartItem";

export function addProductToCart(
  currentCart: CartItem[],
  product: Product,
): CartItem[] {
  const existingItem = currentCart.find(function (item) {
    return item.id === product.id;
  });

  if (existingItem) {
    // Product is already in cart — increase its quantity.
    return currentCart.map(function (item) {
      if (item.id === product.id) {
        return { ...item, qty: item.qty + 1 };
      }
      return item;
    });
  }

  // Product is new to the cart — append it with qty 1.
  const newItem: CartItem = { ...product, qty: 1 };
  return [...currentCart, newItem];
}

/**
 * Returns a new cart array with the item matching `productId` removed.
 */
export function removeProductFromCart(
  currentCart: CartItem[],
  productId: number,
): CartItem[] {
  return currentCart.filter(function (item) {
    return item.id !== productId;
  });
}
