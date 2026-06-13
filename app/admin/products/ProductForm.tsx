// app/admin/products/ProductForm.tsx
//
// The full set of fields for adding or editing a product.
// Used by both AddProductModal and EditProductModal — neither duplicates this.

"use client";

import { useEffect, useState } from "react";
import type { ApiCategory, DisplayProduct, ProductFormValues } from "./types";
import { backendBaseUrl } from "./utilities";
import {
  TagsInput,
  ImageUploadField,
  CategorySelect,
  inputClassName,
  selectClassName,
} from "./FormControls";

// ── useCategories: fetches the category list when the form opens ───────────────

function useCategories(
  isOpen: boolean,
  fallbackCategory?: { id: number; name: string }
) {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setIsLoading(true);
    fetch(`${backendBaseUrl}/api/v1/productcategories/`, { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        setCategories(Array.isArray(data) ? data : (data.data ?? []));
      })
      .catch(() => {
        if (fallbackCategory) {
          setCategories([
            {
              id: fallbackCategory.id,
              name: fallbackCategory.name,
              slug: "",
              image: "",
              status: true,
            },
          ]);
        }
      })
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const addCategory = (category: ApiCategory) => {
    setCategories((previous) => [...previous, category]);
  };

  return { categories, isLoading, addCategory };
}

// ── ProductForm ───────────────────────────────────────────────────────────────

export interface ProductFormProps {
  /** Current form values. */
  values: ProductFormValues;
  /** Called whenever any field changes. */
  onChange: (updated: ProductFormValues) => void;
  /** Called when the user picks or drops a new image file. */
  onFileChange: (imageKey: string, file: File | null) => void;
  /** When editing, we show the existing images so the user knows what is already there. */
  existingImages?: Partial<Pick<DisplayProduct, "heroImage" | "flatlayImage" | "scaleImage" | "packingImage" | "freezeFrameImage">>;
  /** Whether the form is currently visible (controls the category fetch). */
  isVisible: boolean;
}

export function ProductForm({
  values,
  onChange,
  onFileChange,
  existingImages,
  isVisible,
}: ProductFormProps) {
  const { categories, isLoading, addCategory } = useCategories(
    isVisible,
    values.categoryId
      ? { id: values.categoryId, name: values.category }
      : undefined
  );

  return (
    <div className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-neutral-300">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={values.name}
          onChange={(event) => onChange({ ...values, name: event.target.value })}
          placeholder="e.g. Running Shoe Pro"
          className={inputClassName}
        />
      </div>

      {/* Brand + Status */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-neutral-300">
            Brand
          </label>
          <input
            type="text"
            value={values.brand}
            onChange={(event) => onChange({ ...values, brand: event.target.value })}
            placeholder="e.g. Nike"
            className={inputClassName}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-neutral-300">
            Status
          </label>
          <select
            value={values.status}
            onChange={(event) =>
              onChange({ ...values, status: event.target.value as "Active" | "Archived" })
            }
            className={selectClassName}
          >
            <option value="Active">Active</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-neutral-300">
          Category <span className="text-red-500">*</span>
        </label>
        <CategorySelect
          categories={categories}
          isLoading={isLoading}
          selectedCategoryId={values.categoryId ? values.categoryId.toString() : ""}
          onChange={(categoryId, categoryName) =>
            onChange({ ...values, categoryId, category: categoryName })
          }
          onCategoryCreated={addCategory}
        />
      </div>

      {/* Price + Stock */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-neutral-300">
            Price ($)
          </label>
          <input
            type="number"
            min={0}
            step={0.01}
            value={values.price}
            onChange={(event) =>
              onChange({ ...values, price: parseFloat(event.target.value) || 0 })
            }
            className={inputClassName}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-neutral-300">
            Stock
          </label>
          <input
            type="number"
            min={0}
            value={values.stock}
            onChange={(event) =>
              onChange({ ...values, stock: parseInt(event.target.value) || 0 })
            }
            className={inputClassName}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-neutral-300">
          Description
        </label>
        <textarea
          value={values.description}
          onChange={(event) => onChange({ ...values, description: event.target.value })}
          placeholder="Short product description…"
          rows={3}
          className={`${inputClassName} resize-none`}
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-neutral-300">
          Tags
        </label>
        <TagsInput
          value={values.tags}
          onChange={(tags) => onChange({ ...values, tags })}
        />
        <p className="mt-1 text-xs text-gray-400 dark:text-neutral-500">
          Press Enter or comma to add a tag
        </p>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-neutral-300">
          Images
        </label>
        {existingImages && (
          <p className="text-xs text-gray-400 dark:text-neutral-500 mb-2">
            Upload a new file to replace an existing image.
          </p>
        )}
        <div className="grid grid-cols-2 gap-3">
          <ImageUploadField
            label="Hero"
            hint="Main listing image"
            existingUrl={existingImages?.heroImage}
            onFileChange={(file) => onFileChange("hero", file)}
          />
          <ImageUploadField
            label="Flatlay"
            hint="Product in context"
            existingUrl={existingImages?.flatlayImage}
            onFileChange={(file) => onFileChange("flatlay", file)}
          />
          <ImageUploadField
            label="Scale"
            hint="Shows product size"
            existingUrl={existingImages?.scaleImage}
            onFileChange={(file) => onFileChange("scale", file)}
          />
          <ImageUploadField
            label="Packing"
            hint="Packaging shot"
            existingUrl={existingImages?.packingImage}
            onFileChange={(file) => onFileChange("packing", file)}
          />
          <ImageUploadField
            label="Freeze Frame"
            hint="Action / motion shot"
            existingUrl={existingImages?.freezeFrameImage}
            onFileChange={(file) => onFileChange("freezeFrame", file)}
          />
        </div>
      </div>
    </div>
  );
}
