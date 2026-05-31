import type { Product } from "@/types/products";

// ─── Data ─────────────────────────────────────────────────────────────────────

const now = new Date();

const PRODUCTS: Product[] = [
  // Books
  {
    id: 1,
    name: "Meditations — Marcus Aurelius",
    category: "Books",
    price: 12.99,
    badge: "Bestseller",
    create: now,
    update: now,
  },
  {
    id: 2,
    name: "Atomic Habits",
    category: "Books",
    price: 16.5,
    create: now,
    update: now,
  },
  {
    id: 3,
    name: "The Elements of Style",
    category: "Books",
    price: 9.99,
    create: now,
    update: now,
  },
  {
    id: 4,
    name: "Deep Work",
    category: "Books",
    price: 14.99,
    create: now,
    update: now,
  },

  // Notebooks
  {
    id: 5,
    name: "Leuchtturm1917 A5 Dotted",
    category: "Notebooks",
    price: 22.0,
    badge: "New",
    create: now,
    update: now,
  },
  {
    id: 6,
    name: "Moleskine Classic Ruled",
    category: "Notebooks",
    price: 18.95,
    create: now,
    update: now,
  },
  {
    id: 7,
    name: "Rhodia Webnotebook",
    category: "Notebooks",
    price: 19.5,
    create: now,
    update: now,
  },
  {
    id: 8,
    name: "Field Notes 3-Pack",
    category: "Notebooks",
    price: 13.0,
    create: now,
    update: now,
  },

  // Pens
  {
    id: 9,
    name: "Pilot G2 — 12 Pack",
    category: "Pens",
    price: 11.49,
    badge: "Bestseller",
    create: now,
    update: now,
  },
  {
    id: 10,
    name: "Staedtler Triplus Fineliner",
    category: "Pens",
    price: 14.0,
    create: now,
    update: now,
  },
  {
    id: 11,
    name: "Lamy Safari Fountain Pen",
    category: "Pens",
    price: 29.99,
    badge: "New",
    create: now,
    update: now,
  },
  {
    id: 12,
    name: "Sakura Micron Set — 6pk",
    category: "Pens",
    price: 16.75,
    create: now,
    update: now,
  },

  // College essentials
  {
    id: 13,
    name: "Scientific Calculator FX-991",
    category: "College",
    price: 19.99,
    create: now,
    update: now,
  },
  {
    id: 14,
    name: "Index Card Set — 200pk",
    category: "College",
    price: 5.49,
    create: now,
    update: now,
  },
  {
    id: 15,
    name: "Binder Tabs — Assorted",
    category: "College",
    price: 4.99,
    create: now,
    update: now,
  },
  {
    id: 16,
    name: "Mechanical Pencil 0.5mm — 5pk",
    category: "College",
    price: 8.5,
    create: now,
    update: now,
  },
];

export const Datamock = {
  homepage: {
    herosection: {
      preheadline: "Universidad Autonoma de Santo Domingo Semestre 2026-02",
      headline: "Todo lo que necesitas para tu vida *universitaria*",
    },
    productssection: { products: PRODUCTS },
  },
};