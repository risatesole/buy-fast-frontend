// app/admin/products/page.tsx
//
// Server component. Fetches the first page of products from Django at request
// time so the table is populated on the very first paint — no loading spinner.
// Then hands the data to ProductsTable, which is a client component and takes
// over from there (infinite scroll, modals, etc).

import { Suspense } from "react";
import { ProductsTable } from "./ProductsTable";
import { ProductsTableSkeleton } from "./ProductsTableSkeleton";
import type { DisplayProduct } from "./types";
import { convertApiProductToDisplayProduct } from "./utilities";
import type { ApiProduct } from "./types";

// ── Configuration ─────────────────────────────────────────────────────────────

const backendBaseUrl = process.env.BACKEND_URL ?? "http://localhost:8000";
const pageSize = 50;

// ── First-page fetch ──────────────────────────────────────────────────────────

async function fetchFirstPageOfProducts(): Promise<{
  products: DisplayProduct[];
  nextCursor: string | null;
}> {
  try {
    const response = await fetch(
      `${backendBaseUrl}/api/v1/products/?paginate=cursor&limit=${pageSize}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(`Django returned ${response.status}`);
    }

    const data = await response.json();

    // Cursor pagination returns { next, previous, results }
    if (data.results) {
      return {
        products: (data.results as ApiProduct[]).map(convertApiProductToDisplayProduct),
        nextCursor: data.next ?? null,
      };
    }

    // Fallback: old offset format returns { status, data }
    if (data.status === "ok" && Array.isArray(data.data)) {
      return {
        products: (data.data as ApiProduct[]).map(convertApiProductToDisplayProduct),
        nextCursor: null,
      };
    }

    return { products: [], nextCursor: null };
  } catch (error) {
    console.error("[products page] First-page fetch failed:", error);
    return { products: [], nextCursor: null };
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ProductsAdminPage() {
  const { products, nextCursor } = await fetchFirstPageOfProducts();

  return (
    <Suspense fallback={<ProductsTableSkeleton />}>
      <ProductsTable
        initialProducts={products}
        initialNextCursor={nextCursor}
      />
    </Suspense>
  );
}
