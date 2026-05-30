"use client";
import { useState } from "react";

import { Navbar } from "@/components/navbar";
import { CartDrawer } from "@/components/CartDrawer";

import { HeroSection } from "@/components/childcomponents/home/sections/HeroSection";
import { ProductsSection } from "@/components/childcomponents/home/product/products-section";

import type { Product } from "@/types/products";
import type { CartItem } from "@/types/CartItem";

// Trust-badge data shown in the strip between products and footer.
const TRUST_BADGES = [
  { label: "Free Shipping", detail: "On orders over $35" },
  { label: "Same-Day Dispatch", detail: "Order before 2 PM" },
  { label: "Easy Returns", detail: "30-day no-hassle policy" },
];

// Footer links — kept as data so the JSX stays clean.
const FOOTER_LINKS = ["Privacy", "Terms", "Contact"];

// ─── Cart helpers ─────────────────────────────────────────────────────────────
// Separated from the component so they are easy to test and read in isolation.

/**
 * Returns a new cart array with `product` added.
 * - If the product is already in the cart its quantity is bumped by 1.
 * - Otherwise a new item (qty = 1) is appended.
 */
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

/** One cell in the trust-badge strip (Free Shipping, Same-Day Dispatch, etc.). */
function TrustBadge(props: { label: string; detail: string }) {
  return (
    <div>
      <p
        style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          fontSize: "1.05rem",
          color: "oklch(0.145 0 0)",
          marginBottom: "0.4rem",
        }}
      >
        {props.label}
      </p>
      <p
        style={{
          fontFamily: "var(--font-geist-sans), sans-serif",
          fontSize: "0.8rem",
          color: "oklch(0.556 0 0)",
        }}
      >
        {props.detail}
      </p>
    </div>
  );
}

/** The horizontal strip that sits between the product grid and the footer. */
function TrustBadgeStrip() {
  return (
    <section
      style={{
        borderTop: "1px solid oklch(0.922 0 0)",
        borderBottom: "1px solid oklch(0.922 0 0)",
        background: "oklch(0.985 0 0)",
        padding: "4rem 2rem",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "2rem",
          textAlign: "center",
        }}
      >
        {TRUST_BADGES.map(function (badge) {
          return (
            <TrustBadge
              key={badge.label}
              label={badge.label}
              detail={badge.detail}
            />
          );
        })}
      </div>
    </section>
  );
}

/** Site footer with brand name, copyright year, and legal links. */
function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: "1px solid oklch(0.922 0 0)",
        padding: "2.5rem 2rem",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        {/* Brand name */}
        <span
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: "0.95rem",
            color: "oklch(0.145 0 0)",
            letterSpacing: "-0.02em",
          }}
        >
          buyfast
        </span>

        {/* Copyright */}
        <p
          style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontSize: "0.72rem",
            color: "oklch(0.708 0 0)",
            letterSpacing: "0.04em",
          }}
        >
          {currentYear} BuyFast. All rights reserved.
        </p>

        {/* Legal links */}
        <nav style={{ display: "flex", gap: "1.5rem" }}>
          {FOOTER_LINKS.map(function (linkLabel) {
            return (
              <a
                key={linkLabel}
                href="#"
                style={{
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  fontSize: "0.72rem",
                  letterSpacing: "0.06em",
                  color: "oklch(0.556 0 0)",
                  textDecoration: "none",
                }}
              >
                {linkLabel}
              </a>
            );
          })}
        </nav>
      </div>
    </footer>
  );
}

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

      <SiteFooter />

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
