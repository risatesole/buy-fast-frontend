"use client";

import { useState } from "react";
import { Navbar, type CartItem } from "@/components/navbar";

type NavbarWithCartProps = {
  user: {
    name: string;
    profilePicture: string;
    role: string;
  } | null;
  initialCartItems?: CartItem[];
};

export function NavbarWithCart({ user, initialCartItems = [] }: NavbarWithCartProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  function handleRemove(id: CartItem["id"]) {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }

  function handleUpdateQuantity(id: CartItem["id"], quantity: number) {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }

  return (
    <Navbar
      user={user}
      cartItems={cartItems}
      onRemoveCartItem={handleRemove}
      onUpdateCartItemQuantity={handleUpdateQuantity}
    />
  );
}