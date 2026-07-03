'use client';

import { useState } from 'react';
import { Navbar, type NavbarCartItem } from '@/components/navbar';
import CartService from '@/features/cart/service';
type NavbarWithCartProps = {
  user: {
    name: string;
    profilePicture: string;
    role: string;
  } | null;
  initialCartItems?: NavbarCartItem[];
};

export function NavbarWithCart({ user, initialCartItems = [] }: NavbarWithCartProps) {
  const cartservice = new CartService();

  const [cartItems, setCartItems] = useState<NavbarCartItem[]>(initialCartItems);

  function handleRemove(id: NavbarCartItem['id']) {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;
    setCartItems(prev => prev.filter(i => i.id !== id));
    cartservice.removeProduct(item.productId);
  }

  function handleUpdateQuantity(id: NavbarCartItem['id'], quantity: number) {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;

    setCartItems(prev => prev.map(i => (i.id === id ? { ...i, quantity } : i)));
    cartservice.editProductQuantity(item.productId, quantity);
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
