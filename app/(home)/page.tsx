"use client";

import { useEffect, useState } from "react";

// components
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/Footer";

// sections
import { HeroSection } from "@/components/childcomponents/home/sections/hero";
import { ProductsSection } from "@/components/childcomponents/home/product/products-section";
import { TrustBadgeStrip } from "@/components/childcomponents/home/sections/TrustBadgeStrip";

// types
import type { Product } from "@/types/products";
import type { CartItem } from "@/types/CartItem";
import type { UserDetails } from "@/services/user/getUserDetails";

// services
import { getUserDetails } from "@/services/user/getUserDetails";
import { temporaryGetProducts } from "@/services/products/TemporaryGetProducts";

// temp (can remove later)
import { Datamock } from "@/mock/mock";
import { addProductToCart } from "@/mock/shoppingcart";

export default function Page() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<UserDetails | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  function handleAddToCart(product: Product) {
    const updatedCart = addProductToCart(cart, product);
    setCart(updatedCart);
  }

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await getUserDetails();
        setUser(userData);
      } catch (err) {
        console.error("Failed to load user", err);
      }
    }

    loadUser();
  }, []);

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
      <Navbar user={user} />

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
