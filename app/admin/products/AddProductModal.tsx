// app/admin/products/AddProductModal.tsx
//
// Opens a slide-over / dialog where an employee can fill in the details
// for a brand-new product and submit it to the Django API.

"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, PlusCircle, X } from "lucide-react";
import type { ApiProduct, DisplayProduct, ProductFormValues } from "./types";
import { convertApiProductToDisplayProduct, backendBaseUrl } from "./utilities";
import { ProductForm } from "./ProductForm";

// ── Preline helper ────────────────────────────────────────────────────────────

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

// ── Default form values ───────────────────────────────────────────────────────

function makeEmptyFormValues(): ProductFormValues {
  return {
    name: "",
    description: "",
    brand: "",
    price: 0,
    stock: 0,
    status: "Active",
    categoryId: 0,
    category: "",
    tags: [],
  };
}

// ── AddProductModal ───────────────────────────────────────────────────────────

const modalId = "add-product-modal";

interface AddProductModalProps {
  onProductCreated: (product: DisplayProduct) => void;
}

export function AddProductModal({ onProductCreated }: AddProductModalProps) {
  const [formValues, setFormValues] = useState<ProductFormValues>(makeEmptyFormValues());
  const [imageFiles, setImageFiles] = useState<Record<string, File | null>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  usePrelineAutoInit([]);

  const handleFileChange = (imageKey: string, file: File | null) => {
    setImageFiles((previous) => ({ ...previous, [imageKey]: file }));
  };

  const resetForm = () => {
    setFormValues(makeEmptyFormValues());
    setImageFiles({});
    setSaveError(null);
  };

  const closeModal = useCallback(() => {
    import("preline").then(({ HSOverlay }) => HSOverlay.close(`#${modalId}`));
  }, []);

  const handleSubmit = async () => {
    if (!formValues.name.trim()) { setSaveError("Product name is required."); return; }
    if (!formValues.categoryId) { setSaveError("Please select a category."); return; }

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

      const response = await fetch(`${backendBaseUrl}/api/v1/products/`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Create failed (${response.status}): ${await response.text()}`);
      }

      const result = await response.json();
      if (result.status === "created" && result.data) {
        const newProduct = convertApiProductToDisplayProduct(result.data as ApiProduct);
        onProductCreated({ ...newProduct, stock: formValues.stock });
        resetForm();
        closeModal();
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to create product.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-controls={modalId}
        data-hs-overlay={`#${modalId}`}
        className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50"
      >
        <PlusCircle className="size-4" /> Add product
      </button>

      {/* Modal */}
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
              <h3 id={`${modalId}-label`} className="font-bold text-gray-800 dark:text-white">
                Add product
              </h3>
              <button
                type="button"
                aria-label="Close"
                data-hs-overlay={`#${modalId}`}
                className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
              <p className="text-sm text-gray-500 dark:text-neutral-400 mb-4">
                Fill in the details to create a new product.
              </p>
              <ProductForm
                values={formValues}
                onChange={setFormValues}
                onFileChange={handleFileChange}
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
                data-hs-overlay={`#${modalId}`}
                onClick={resetForm}
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving}
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSaving && <Loader2 className="size-4 animate-spin" />} Create product
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
