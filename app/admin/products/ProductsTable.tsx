// app/admin/products/ProductsTable.tsx
//
// Client component that owns the product list state and renders the table.
// It receives the first page from the server (so the table is populated instantly
// without a loading spinner) and then loads more rows as the user scrolls down.

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ApiCursorPage, DisplayProduct } from "./types";
import { convertApiProductToDisplayProduct } from "./utilities";
import { AddProductModal } from "./AddProductModal";
import { EditProductModal } from "./EditProductModal";
import { DeleteProductModal } from "./DeleteProductModal";
import { ProductRowActions } from "./ProductRowActions";
import { TableRowsSkeleton } from "./ProductsTableSkeleton";

// ── useInfiniteScroll ─────────────────────────────────────────────────────────
//
// Watches a sentinel element at the bottom of the page. When it becomes visible
// the viewport (i.e. the user scrolled close enough), it calls onLoadMore.

function useInfiniteScroll({
  onLoadMore,
  hasMore,
}: {
  onLoadMore: () => Promise<void>;
  hasMore: boolean;
}) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const triggerLoadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      await onLoadMore();
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, onLoadMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading && hasMore) {
          triggerLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) observer.observe(currentSentinel);
    return () => { if (currentSentinel) observer.unobserve(currentSentinel); };
  }, [triggerLoadMore, isLoading, hasMore]);

  return { sentinelRef, isLoading };
}

// ── usePrelineAutoInit ────────────────────────────────────────────────────────

function usePrelineAutoInit(dependencies: unknown[]) {
  useEffect(() => {
    let isCancelled = false;
    import("preline").then(({ HSStaticMethods }) => {
      if (!isCancelled) setTimeout(() => HSStaticMethods.autoInit(), 0);
    });
    return () => { isCancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}

// ── ProductsTable ─────────────────────────────────────────────────────────────

interface ProductsTableProps {
  /** The first page of products, fetched by the server component. */
  initialProducts: DisplayProduct[];
  /** The cursor URL for the next page, or null if there are no more pages. */
  initialNextCursor: string | null;
}

export function ProductsTable({ initialProducts, initialNextCursor }: ProductsTableProps) {
  const [products, setProducts] = useState<DisplayProduct[]>(initialProducts);
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
  const [productToEdit, setProductToEdit] = useState<DisplayProduct | null>(null);
  const [productToDelete, setProductToDelete] = useState<DisplayProduct | null>(null);

  usePrelineAutoInit([products.length]);

  // ── Load the next page when the user scrolls to the bottom ───────────────

  const loadNextPage = useCallback(async () => {
    if (!nextCursor) return;
    try {
      // The cursor URL from Django is absolute. We pass it as a query param
      // through our own Next.js route so credentials travel correctly.
      const encodedCursor = encodeURIComponent(nextCursor);
      const response = await fetch(
        `/api/v1/products/?cursor_url=${encodedCursor}`,
        { credentials: "include" }
      );
      if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);

      const data: ApiCursorPage = await response.json();
      if (data.results?.length) {
        setProducts((previous) => [
          ...previous,
          ...data.results.map(convertApiProductToDisplayProduct),
        ]);
      }
      setNextCursor(data.next ?? null);
    } catch (error) {
      console.error("[ProductsTable] Failed to load next page:", error);
    }
  }, [nextCursor]);

  const { sentinelRef, isLoading: isLoadingMore } = useInfiniteScroll({
    onLoadMore: loadNextPage,
    hasMore: nextCursor !== null,
  });

  // ── CRUD state handlers ───────────────────────────────────────────────────

  const addProduct = (product: DisplayProduct) =>
    setProducts((previous) => [product, ...previous]);

  const updateProduct = (updatedProduct: DisplayProduct) =>
    setProducts((previous) =>
      previous.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );

  const removeProduct = (productId: string) =>
    setProducts((previous) => previous.filter((product) => product.id !== productId));

  const toggleProductStatus = (productId: string) =>
    setProducts((previous) =>
      previous.map((product) =>
        product.id === productId
          ? { ...product, status: product.status === "Active" ? "Archived" : "Active" }
          : product
      )
    );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
            Products
          </h1>
          <p className="text-sm text-gray-500 dark:text-neutral-400">
            Manage your product catalog
          </p>
        </div>
        <AddProductModal onProductCreated={addProduct} />
      </div>

      {/* Table */}
      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:border-neutral-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                <thead className="bg-gray-50 dark:bg-neutral-800">
                  <tr>
                    {[
                      "ID", "Image", "Name", "Brand", "Category",
                      "Tags", "Price", "Stock", "Status", "",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-neutral-400"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white dark:divide-neutral-700 dark:bg-neutral-900">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                      {/* ID */}
                      <td className="px-4 py-3 whitespace-nowrap text-xs font-mono text-gray-400 dark:text-neutral-500">
                        {product.id}
                      </td>

                      {/* Thumbnail */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {product.heroImage ? (
                          <img
                            src={product.heroImage}
                            alt={product.name}
                            className="size-10 rounded-lg object-cover border border-gray-200 dark:border-neutral-700"
                            onError={(event) => {
                              (event.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="size-10 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center text-gray-400 text-xs dark:border-neutral-700 dark:bg-neutral-800">
                            —
                          </div>
                        )}
                      </td>

                      {/* Name */}
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                        {product.name}
                      </td>

                      {/* Brand */}
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                        {product.brand}
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                        {product.category}
                      </td>

                      {/* Tags */}
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {product.tags.length > 0 ? (
                            product.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-neutral-700 dark:text-neutral-300"
                              >
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400 dark:text-neutral-500">
                              —
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                        ${product.price.toFixed(2)}
                      </td>

                      {/* Stock */}
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span
                          className={
                            product.stock === 0
                              ? "text-red-600 font-medium dark:text-red-400"
                              : "text-gray-800 dark:text-neutral-200"
                          }
                        >
                          {product.stock === 0 ? "Out of stock" : product.stock}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 text-sm ${
                            product.status === "Active"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-gray-400 dark:text-neutral-500"
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              product.status === "Active"
                                ? "bg-emerald-500"
                                : "bg-gray-400 dark:bg-neutral-500"
                            }`}
                          />
                          {product.status}
                        </span>
                      </td>

                      {/* Row actions */}
                      <td className="px-4 py-3 whitespace-nowrap text-end">
                        <ProductRowActions
                          product={product}
                          onEdit={() => setProductToEdit(product)}
                          onToggleStatus={() => toggleProductStatus(product.id)}
                          onDelete={() => setProductToDelete(product)}
                        />
                      </td>
                    </tr>
                  ))}

                  {/* Skeleton rows while loading more */}
                  {isLoadingMore && <TableRowsSkeleton rows={6} />}

                  {/* Empty state */}
                  {products.length === 0 && !isLoadingMore && (
                    <tr>
                      <td
                        colSpan={10}
                        className="px-4 py-10 text-center text-sm text-gray-400 dark:text-neutral-500"
                      >
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Product count */}
      <p className="text-sm text-gray-400 dark:text-neutral-500">
        {products.length} products loaded
      </p>

      {/* Sentinel element — IntersectionObserver watches this */}
      <div ref={sentinelRef} style={{ height: "1px", visibility: "hidden" }} aria-hidden="true" />

      {/* End-of-list message */}
      {!isLoadingMore && nextCursor === null && products.length > 0 && (
        <p className="text-center text-xs text-gray-300 dark:text-neutral-600 pb-4">
          All products loaded
        </p>
      )}

      {/* Edit modal — only mounts when a product is selected for editing */}
      {productToEdit && (
        <EditProductModal
          key={productToEdit.id}
          product={productToEdit}
          onSave={updateProduct}
          onClose={() => setProductToEdit(null)}
        />
      )}

      {/* Delete modal — only mounts when a product is selected for deletion */}
      {productToDelete && (
        <DeleteProductModal
          key={productToDelete.id}
          product={productToDelete}
          onConfirm={() => removeProduct(productToDelete.id)}
          onClose={() => setProductToDelete(null)}
        />
      )}
    </div>
  );
}
