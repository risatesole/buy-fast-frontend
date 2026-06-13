// app/admin/products/ProductRowActions.tsx
//
// The "⋯" button that appears at the end of each table row.
// Clicking it opens a small dropdown with Edit, Activate/Deactivate, and Delete.

"use client";

import { MoreHorizontal } from "lucide-react";
import type { DisplayProduct } from "./types";

interface ProductRowActionsProps {
  product: DisplayProduct;
  onEdit: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
}

export function ProductRowActions({
  product,
  onEdit,
  onToggleStatus,
  onDelete,
}: ProductRowActionsProps) {
  const triggerId = `row-actions-trigger-${product.id}`;

  return (
    <div className="hs-dropdown relative inline-flex">
      <button
        id={triggerId}
        type="button"
        aria-expanded="false"
        aria-label="Actions"
        className="hs-dropdown-toggle size-8 inline-flex justify-center items-center gap-x-2 rounded-lg border border-transparent text-gray-500 hover:bg-gray-100 focus:outline-none dark:text-neutral-400 dark:hover:bg-neutral-700"
      >
        <MoreHorizontal className="size-4" />
      </button>

      <div
        className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-36 bg-white shadow-md rounded-xl border border-gray-200 p-1 z-20 dark:bg-neutral-800 dark:border-neutral-700"
        role="menu"
        aria-labelledby={triggerId}
      >
        <button
          type="button"
          role="menuitem"
          onClick={onEdit}
          className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
        >
          Edit
        </button>

        <button
          type="button"
          role="menuitem"
          onClick={onToggleStatus}
          className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
        >
          {product.status === "Active" ? "Deactivate" : "Activate"}
        </button>

        <div className="my-1 border-t border-gray-100 dark:border-neutral-700" />

        <button
          type="button"
          role="menuitem"
          onClick={onDelete}
          className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
