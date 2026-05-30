"use client";
import { useState } from "react";

import { Datamock } from "@/mock/mock";

// components
import { Navbar } from "@/components/navbar";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";

// sections
import { HeroSection } from "@/components/childcomponents/home/sections/hero";
import { ProductsSection } from "@/components/childcomponents/home/product/products-section";
import { TrustBadgeStrip } from "@/components/childcomponents/home/sections/TrustBadgeStrip";

// types
import type { Product } from "@/types/products";
import type { CartItem } from "@/types/CartItem";

// temp
import {
  addProductToCart,
  removeProductFromCart,
} from "@/components/childcomponents/home/cartdrawer";

export default function Page() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const [cartOpen, setCartOpen] = useState(false);

  function handleAddToCart(product: Product) {
    const updatedCart = addProductToCart(cart, product);
    setCart(updatedCart);
  }

  function handleRemoveFromCart(productId: number) {
    const updatedCart = removeProductFromCart(cart, productId);
    setCart(updatedCart);
  }

  function handleOpenCart() {
    setCartOpen(true);
  }

  function handleCloseCart() {
    setCartOpen(false);
  }


  return (
    <div style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
      <Navbar />

      <main>
        <HeroSection
          preheadline={Datamock.homepage.herosection.preheadline}
          headline={Datamock.homepage.herosection.headline}
        />
        <ProductsSection
          onAddToCart={handleAddToCart}
          products={Datamock.homepage.productssection.products}
        />
        <TrustBadgeStrip />
      </main>

      <Footer />

      {/* The cart drawer slides in from the right when cartOpen is true. */}
      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={handleCloseCart}
        onRemove={handleRemoveFromCart}
      />
    </div>
  );
}
