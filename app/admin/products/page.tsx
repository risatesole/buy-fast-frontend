// app/admin/products/page.tsx  (or wherever your admin page lives)
//
// Server component: fetches the first page from Django at request time,
// so the table is populated on first paint — no client loading spinner.
// Passes initialProducts + initialNextCursor to the client shell.

import { Suspense } from "react";
import { ProductsAdminShell } from "./ProductsAdminShell";
import { ProductsTableSkeleton } from "./ProductsTableSkeleton";

// ── Types shared with the client shell ───────────────────────────────────────

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  image: string;
  status: boolean;
}

export interface ApiProduct {
  id: number;
  name: string;
  description: string;
  brand: string;
  selling_price: number;
  status: boolean;
  category: ApiCategory;
  images: Array<{ url: string; type: string }>;
  tags: string[];
}

export interface DisplayProduct {
  id: string;
  name: string;
  category: string;
  categoryId: number;
  tags: string[];
  price: number;
  stock: number;
  status: "Active" | "Archived";
  description: string;
  brand: string;
  heroImage?: string;
  flatlayImage?: string;
  scaleImage?: string;
  packingImage?: string;
  freezeFrameImage?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";
const PAGE_SIZE = 50;

function toAbsolute(url?: string): string | undefined {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${BACKEND_URL}${url}`;
}

export function convertApiProduct(p: ApiProduct): DisplayProduct {
  const img = (type: string) =>
    toAbsolute(p.images?.find((i) => i.type === type)?.url);
  return {
    id: p.id.toString(),
    name: p.name,
    category: p.category?.name || "Uncategorized",
    categoryId: p.category?.id ?? 1,
    tags: p.tags ?? [],
    price: p.selling_price,
    stock: Math.floor(Math.random() * 100), // placeholder — replace with real stock field
    status: p.status ? "Active" : "Archived",
    description: p.description,
    brand: p.brand,
    heroImage: img("HERO"),
    flatlayImage: img("FLATLAY"),
    scaleImage: img("SCALE"),
    packingImage: img("PACKING"),
    freezeFrameImage: img("FREEZE_FRAME"),
  };
}

// ── First-page fetch (runs on the server) ─────────────────────────────────────

async function getFirstPage(): Promise<{
  products: DisplayProduct[];
  nextCursor: string | null;
}> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/products/?paginate=cursor&limit=${PAGE_SIZE}`,
      { cache: "no-store" },
    );
    if (!res.ok) throw new Error(`Django returned ${res.status}`);

    const data = await res.json();

    // Cursor mode returns { next, previous, results }
    if (data.results) {
      return {
        products: (data.results as ApiProduct[]).map(convertApiProduct),
        nextCursor: data.next ?? null,
      };
    }

    // Fallback: old offset format { status, data }
    if (data.status === "ok" && Array.isArray(data.data)) {
      return {
        products: (data.data as ApiProduct[]).map(convertApiProduct),
        nextCursor: null,
      };
    }

    return { products: [], nextCursor: null };
  } catch (err) {
    console.error("[products page] first-page fetch failed:", err);
    return { products: [], nextCursor: null };
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ProductsAdminPage() {
  const { products, nextCursor } = await getFirstPage();

  return (
    <Suspense fallback={<ProductsTableSkeleton />}>
      <ProductsAdminShell
        initialProducts={products}
        initialNextCursor={nextCursor}
      />
    </Suspense>
  );
}
