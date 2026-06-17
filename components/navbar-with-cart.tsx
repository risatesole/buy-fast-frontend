"use client";

import { useState } from "react";
import { Navbar, type NavbarCartItem } from "@/components/navbar";

type NavbarWithCartProps = {
  user: {
    name: string;
    profilePicture: string;
    role: string;
  } | null;
  initialCartItems?: NavbarCartItem[];
};

export function NavbarWithCart({ user, initialCartItems = [] }: NavbarWithCartProps) {
  const [cartItems, setCartItems] = useState<NavbarCartItem[]>(initialCartItems);

  function handleRemove(id: NavbarCartItem["id"]) {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }

  function handleUpdateQuantity(id: NavbarCartItem["id"], quantity: number) {
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