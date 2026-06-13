// app/admin/products/EditProductModal.tsx
//
// Opens a pre-filled dialog so an employee can update any field on a product.
// Mounts when the user clicks "Edit" in the row actions menu.

"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import type { ApiProduct, DisplayProduct, ProductFormValues } from "./types";
import { convertApiProductToDisplayProduct, backendBaseUrl } from "./utilities";
import { ProductForm } from "./ProductForm";

// ── EditProductModal ──────────────────────────────────────────────────────────

interface EditProductModalProps {
  product: DisplayProduct;
  onSave: (updatedProduct: DisplayProduct) => void;
  onClose: () => void;
}

export function EditProductModal({ product, onSave, onClose }: EditProductModalProps) {
  const modalId = `edit-product-modal-${product.id}`;

  const [formValues, setFormValues] = useState<ProductFormValues>({
    name: product.name,
    description: product.description,
    brand: product.brand,
    price: product.price,
    stock: product.stock,
    status: product.status,
    categoryId: product.categoryId,
    category: product.category,
    tags: product.tags,
  });

  const [imageFiles, setImageFiles] = useState<Record<string, File | null>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Open the Preline modal as soon as this component mounts.
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

  const handleFileChange = (imageKey: string, file: File | null) => {
    setImageFiles((previous) => ({ ...previous, [imageKey]: file }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const formData = new FormData();
      formData.append("name", formValues.name);
      formData.append("description", formValues.description);
      formData.append("brand", formValues.brand);
      formData.append("selling_price", formValues.price.toString());
      formData.append("status", formValues.status === "Active" ? "true" : "false");
      formData.append("category_id", formValues.categoryId.toString());
      formValues.tags.forEach((tag) => formData.append("tags", tag));

      const imageTypeByKey: Record<string, string> = {
        hero: "HERO",
        flatlay: "FLATLAY",
        scale: "SCALE",
        packing: "PACKING",
        freezeFrame: "FREEZE_FRAME",
      };
      Object.entries(imageTypeByKey).forEach(([key, imageType]) => {
        if (imageFiles[key]) formData.append(`images_${imageType}`, imageFiles[key] as File);
      });

      const response = await fetch(`${backendBaseUrl}/api/v1/products/${product.id}/`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Save failed (${response.status}): ${await response.text()}`);
      }

      const result = await response.json();
      const updatedProduct =
        result.status === "updated" && result.data
          ? { ...convertApiProductToDisplayProduct(result.data as ApiProduct), stock: formValues.stock }
          : { ...product, ...formValues };

      onSave(updatedProduct);
      closeModal();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      id={modalId}
      className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none"
      role="dialog"
      tabIndex={-1}
      aria-labelledby={`${modalId}-label`}
    >
      <div className="hs-overlay-open:opacity-100 hs-overlay-open:duration-300 opacity-0 transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
        <div className="pointer-events-auto flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
          {/* Header */}
          <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
            <h3
              id={`${modalId}-label`}
              className="font-bold text-gray-800 dark:text-white"
            >
              Edit product
            </h3>
            <button
              type="button"
              aria-label="Close"
              onClick={closeModal}
              className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
            <p className="text-sm text-gray-500 dark:text-neutral-400 mb-4">
              Update the details for {product.name}.
            </p>
            <ProductForm
              values={formValues}
              onChange={setFormValues}
              onFileChange={handleFileChange}
              existingImages={{
                heroImage: product.heroImage,
                flatlayImage: product.flatlayImage,
                scaleImage: product.scaleImage,
                packingImage: product.packingImage,
                freezeFrameImage: product.freezeFrameImage,
              }}
              isVisible={true}
            />
            {saveError && (
              <div className="mt-3 p-3 text-sm text-red-600 rounded-lg bg-red-50 dark:bg-red-900/20 dark:text-red-400">
                {saveError}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-neutral-700">
            <button
              type="button"
              onClick={closeModal}
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSaving && <Loader2 className="size-4 animate-spin" />} Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
