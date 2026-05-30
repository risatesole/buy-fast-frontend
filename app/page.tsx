"use client";
import { useState } from "react";

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


function addProductToCart(
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
function removeProductFromCart(
  currentCart: CartItem[],
  productId: number,
): CartItem[] {
  return currentCart.filter(function (item) {
    return item.id !== productId;
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────


// ─── Page component ───────────────────────────────────────────────────────────
import { Datamock } from "@/mock/mock";

export default function Page() {
  
  // cart drawer:
  // ===============================================================================
  // ===============================================================================
  // ===============================================================================
  // ===============================================================================
  // ===============================================================================
  // `cart` holds the items the user has added. Starts empty.
  const [cart, setCart] = useState<CartItem[]>([]);

  // `cartOpen` controls whether the slide-out cart drawer is visible.
  const [cartOpen, setCartOpen] = useState(false);

  // Called when the user clicks "Add to cart" on any product card.
  function handleAddToCart(product: Product) {
    const updatedCart = addProductToCart(cart, product);
    setCart(updatedCart);
  }

  // Called when the user clicks the remove button inside the cart drawer.
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

  // ===============================================================================
  // ===============================================================================
  // ===============================================================================
  // ===============================================================================
  // ===============================================================================
  // ===============================================================================

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
