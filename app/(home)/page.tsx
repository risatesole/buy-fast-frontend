"use client";

import { useEffect, useState } from "react";

// components
import { Footer } from "@/components/Footer";

// sections
import { HeroSection } from "@/components/childcomponents/home/sections/hero";
import { ProductsSection } from "@/components/childcomponents/home/product/products-section";
import { TrustBadgeStrip } from "@/components/childcomponents/home/sections/TrustBadgeStrip";

// types
import type { Product } from "@/types/products";
import type { CartItem } from "@/types/CartItem";

// services
import { getUserDetails } from "@/services/user/getUserDetails";
import { temporaryGetProducts } from "@/services/products/TemporaryGetProducts";

// temp (can remove later)
import { Datamock } from "@/mock/mock";
import { addProductToCart } from "@/mock/shoppingcart";

export default function Page() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  function handleAddToCart(product: Product) {
    const updatedCart = addProductToCart(cart, product);
    setCart(updatedCart);
  }

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await temporaryGetProducts();
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products", err);
      }
    }

    loadProducts();
  }, []);

  return (
    <div style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
      

      <main>
        <HeroSection
          preheadline={Datamock.homepage.herosection.preheadline}
          headline={Datamock.homepage.herosection.headline}
        />

        <ProductsSection
          onAddToCart={handleAddToCart}
          products={products}
        />

        <TrustBadgeStrip />
      </main>

      <Footer />
    </div>
  );
}
