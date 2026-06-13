// app/admin/products/DeleteProductModal.tsx
//
// A small confirmation dialog that appears before a product is deleted.
// The actual DELETE request is handled by the parent; this just confirms intent.

"use client";

import { useEffect } from "react";
import { Trash2 } from "lucide-react";
import type { DisplayProduct } from "./types";

interface DeleteProductModalProps {
  product: DisplayProduct;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteProductModal({ product, onConfirm, onClose }: DeleteProductModalProps) {
  const modalId = `delete-product-modal-${product.id}`;

  useEffect(() => {
    let isCancelled = false;
    import("preline").then(({ HSStaticMethods, HSOverlay }) => {
      if (isCancelled) return;
      setTimeout(() => {
        HSStaticMethods.autoInit();
        HSOverlay.open(`#${modalId}`);
      }, 0);
    });
    return () => { isCancelled = true; };
  }, []);

  const closeModal = () => {
    import("preline").then(({ HSOverlay }) => HSOverlay.close(`#${modalId}`));
    onClose();
  };

  return (
    <div
      id={modalId}
      className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none"
      role="dialog"
      tabIndex={-1}
      aria-labelledby={`${modalId}-label`}
    >
      <div className="hs-overlay-open:opacity-100 hs-overlay-open:duration-300 opacity-0 transition-all sm:max-w-sm sm:w-full m-3 sm:mx-auto">
        <div className="pointer-events-auto flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
          <div className="p-4 sm:p-6 text-center">
            <div className="mb-3 flex justify-center">
              <span className="inline-flex justify-center items-center size-12 rounded-full border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900">
                <Trash2 className="size-5 text-red-600 dark:text-red-400" />
              </span>
            </div>
            <h3
              id={`${modalId}-label`}
              className="mb-2 text-lg font-bold text-gray-800 dark:text-white"
            >
              Delete product?
            </h3>
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              <span className="font-medium text-gray-800 dark:text-white">
                {product.name}
              </span>{" "}
              will be moved to the recycling bin. Deleted products are kept for{" "}
              <span className="font-medium text-gray-800 dark:text-white">60 days</span>{" "}
              before being permanently removed.
            </p>
          </div>
          <div className="flex justify-center items-center gap-x-3 pb-4 px-4">
            <button
              type="button"
              onClick={closeModal}
              className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => { onConfirm(); closeModal(); }}
              className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
