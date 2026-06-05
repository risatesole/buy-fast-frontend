"use client";

import { useState } from "react";
import { ProductsSection } from "@/components/childcomponents/home/product/products-section";
import { addProductToCart } from "@/mock/shoppingcart";
import type { Product } from "@/types/products";
import type { CartItem } from "@/types/CartItem";

export function ProductsInteractive({ products }: { products: Product[] }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  function handleAddToCart(product: Product) {
    setCart((prev) => addProductToCart(prev, product));
  }

  return <ProductsSection products={products} onAddToCart={handleAddToCart} />;
}