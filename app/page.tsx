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

// services
import { getUserDetails } from "@/services/user/getUserDetails";
import type { UserDetails } from "@/services/user/getUserDetails";

// temp
import { Datamock } from "@/mock/mock";
import { addProductToCart } from "@/mock/shoppingcart";
import { profile } from "console";

export default function Page() {
  const [cart, setCart] = useState<CartItem[]>([]);

  function handleAddToCart(product: Product) {
    const updatedCart = addProductToCart(cart, product);
    setCart(updatedCart);
  }
  const [user, setUser] = useState<UserDetails | null>(null);

    useEffect(() => {
    async function loadUser() {
      const user = await getUserDetails();
      setUser(user);
    }

    loadUser();
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
          products={Datamock.homepage.productssection.products}
        />
        <TrustBadgeStrip />
      </main>
      <Footer />
    </div>
  );
}
