"use client";

import { createContext, useContext } from "react";
import type { CartItem } from "@/components/navbar";

const CartContext = createContext<CartItem[]>([]);
export const useCheckoutCart = () => useContext(CartContext);

export function CheckoutWithCart({
  children,
  cartItems,
}: {
  children: React.ReactNode;
  cartItems: CartItem[];
}) {
  return (
    <CartContext.Provider value={cartItems}>{children}</CartContext.Provider>
  );
}
