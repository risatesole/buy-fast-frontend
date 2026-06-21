"use client";

import { useState } from "react";
import { Navbar, type NavbarCartItem } from "@/components/navbar";
import CartService from "@/services/cart";
type NavbarWithCartProps = {
  user: {
    name: string;
    profilePicture: string;
    role: string;
  } | null;
  initialCartItems?: NavbarCartItem[];
};

export function NavbarWithCart({
  user,
  initialCartItems = [],
}: NavbarWithCartProps) {
  const cartservice = new CartService();

  const [cartItems, setCartItems] =
    useState<NavbarCartItem[]>(initialCartItems);

  function handleRemove(id: NavbarCartItem["id"]) {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;
    setCartItems((prev) => prev.filter((i) => i.id !== id));
    cartservice.removeProduct(item.productId);
  }

  function handleUpdateQuantity(id: NavbarCartItem["id"], quantity: number) {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
    cartservice.editProductQuantity(id, quantity);
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
