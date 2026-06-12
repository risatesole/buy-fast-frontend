// app/admin/products/ProductsAdminShell.tsx
"use client";

import { useState, useRef, useEffect, KeyboardEvent, useCallback } from "react";
import {
  MoreHorizontal,
  PlusCircle,
  Upload,
  X,
  Trash2,
  Loader2,
  Plus,
} from "lucide-react";
import { TableRowsSkeleton } from "./ProductsTableSkeleton";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import type { DisplayProduct, ApiProduct, ApiCategory } from "./page";

// ─── Re-export convertApiProduct so page.tsx can use the same fn ──────────────
// (page.tsx imports it from here; keep it in sync)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const CATEGORIES_URL = `${BASE_URL}/api/v1/productcategories/`;
const PAGE_SIZE = 50;

// ─── Cursor-paginated response shape ─────────────────────────────────────────
interface CursorPage {
  next: string | null;
  previous: string | null;
  results: ApiProduct[];
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function getCsrfToken(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/csrftoken=([^;]+)/);
  return match ? match[1] : "";
}

function toAbsolute(url?: string): string | undefined {
  if (!url) return undefined;
  return url.startsWith("http") ? url : `${BASE_URL}${url}`;
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function convertApiProduct(p: ApiProduct): DisplayProduct {
  const img = (type: string) =>
    toAbsolute(p.images?.find((i) => i.type === type)?.url);
  return {
    id: p.id.toString(),
    name: p.name,
    category: p.category?.name || "Uncategorized",
    categoryId: p.category?.id ?? 1,
    tags: p.tags ?? [],
    price: p.selling_price,
    stock: Math.floor(Math.random() * 100),
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

// ─── usePreline ───────────────────────────────────────────────────────────────
function usePreline(deps: unknown[]) {
  useEffect(() => {
    let cancelled = false;
    import("preline").then(({ HSStaticMethods }) => {
      if (!cancelled) setTimeout(() => HSStaticMethods.autoInit(), 0);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// ─── TagsInput ────────────────────────────────────────────────────────────────
function TagsInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (t: string[]) => void;
}) {
  const [input, setInput] = useState("");
  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase();
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    setInput("");
  };
  const removeTag = (tag: string) => onChange(value.filter((t) => t !== tag));
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && input === "" && value.length > 0)
      removeTag(value[value.length - 1]);
  };
  return (
    <div className="flex flex-wrap gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 min-h-[40px] cursor-text focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700">
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-neutral-700 dark:text-neutral-200"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-neutral-200"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => input.trim() && addTag(input)}
        placeholder={value.length === 0 ? "Type a tag and press Enter…" : ""}
        className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-neutral-500 dark:text-neutral-200"
      />
    </div>
  );
}

// ─── ImageUploadField ─────────────────────────────────────────────────────────
function ImageUploadField({
  label,
  hint,
  onFileChange,
  existingUrl,
}: {
  label: string;
  hint: string;
  onFileChange: (f: File | null) => void;
  existingUrl?: string;
}) {
  const [preview, setPreview] = useState<string | null>(existingUrl ?? null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setPreview(existingUrl ?? null);
  }, [existingUrl]);
  const handleFile = (file: File) => {
    setPreview(URL.createObjectURL(file));
    onFileChange(file);
  };
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
        {label}
      </label>
      <p className="text-xs text-gray-500 dark:text-neutral-400">{hint}</p>
      <div
        className={`relative flex items-center justify-center rounded-lg border-2 border-dashed transition-colors cursor-pointer h-28 ${preview ? "border-gray-200 dark:border-neutral-600" : "border-gray-200 hover:border-gray-300 dark:border-neutral-700 dark:hover:border-neutral-500"}`}
        onClick={() => inputRef.current?.click()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="preview"
              className="h-full w-full object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
                onFileChange(null);
              }}
              className="absolute top-1.5 right-1.5 rounded-full bg-white/80 p-0.5 shadow hover:bg-white dark:bg-neutral-800/80 dark:hover:bg-neutral-800"
            >
              <X className="size-3.5 text-gray-500" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-gray-400 pointer-events-none select-none dark:text-neutral-500">
            <Upload className="size-5" />
            <span className="text-xs">Click or drag to upload</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </div>
    </div>
  );
}

// ─── CategorySelect ───────────────────────────────────────────────────────────
function CategorySelect({
  categories,
  loading,
  value,
  onChange,
  onCategoryCreated,
}: {
  categories: ApiCategory[];
  loading: boolean;
  value: string;
  onChange: (id: number, name: string) => void;
  onCategoryCreated: (cat: ApiCategory) => void;
}) {
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  useEffect(() => {
    setNewSlug(slugify(newName));
  }, [newName]);

  const handleCreate = async () => {
    if (!newName.trim()) {
      setCreateError("Name is required");
      return;
    }
    if (!newSlug.trim()) {
      setCreateError("Slug is required");
      return;
    }
    setCreating(true);
    setCreateError(null);
    try {
      const res = await fetch(CATEGORIES_URL, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCsrfToken(),
        },
        body: JSON.stringify({ name: newName.trim(), slug: newSlug.trim() }),
      });
      if (!res.ok)
        throw new Error(`Failed (${res.status}): ${await res.text()}`);
      const result = await res.json();
      const created: ApiCategory = result.data ?? result;
      onCategoryCreated(created);
      onChange(created.id, created.name);
      setShowNew(false);
      setNewName("");
      setNewSlug("");
    } catch (err) {
      setCreateError(
        err instanceof Error ? err.message : "Failed to create category",
      );
    } finally {
      setCreating(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center gap-2 h-10 text-sm text-gray-500">
        <Loader2 className="size-4 animate-spin" /> Loading categories…
      </div>
    );

  return (
    <div className="space-y-2">
      <select
        value={value}
        onChange={(e) => {
          const cat = categories.find(
            (c) => c.id.toString() === e.target.value,
          );
          if (cat) onChange(cat.id, cat.name);
        }}
        className="py-2 px-3 pe-9 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2YjcyODAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSI+PC9wb2x5bGluZT48L3N2Zz4=')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1rem_1rem]"
      >
        <option value="">Select a category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id.toString()}>
            {cat.name}
          </option>
        ))}
      </select>
      {!showNew ? (
        <button
          type="button"
          onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400 transition-colors"
        >
          <Plus className="size-3.5" /> New category
        </button>
      ) : (
        <div className="rounded-lg border border-gray-200 dark:border-neutral-700 p-3 space-y-2 bg-gray-50 dark:bg-neutral-800">
          <input
            autoFocus
            placeholder="Category name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="py-1.5 px-2.5 block w-full border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200"
          />
          <input
            placeholder="slug-here"
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
            className="py-1.5 px-2.5 block w-full border border-gray-200 rounded-md text-sm font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200"
          />
          {createError && <p className="text-xs text-red-600">{createError}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCreate}
              disabled={creating}
              className="flex-1 py-1.5 px-3 inline-flex justify-center items-center gap-x-2 text-xs font-medium rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            >
              {creating && <Loader2 className="size-3 animate-spin" />} Create
            </button>
            <button
              type="button"
              onClick={() => {
                setShowNew(false);
                setNewName("");
                setCreateError(null);
              }}
              disabled={creating}
              className="py-1.5 px-3 inline-flex items-center gap-x-2 text-xs font-medium rounded-md border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 disabled:opacity-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── useCategories ────────────────────────────────────────────────────────────
function useCategories(open: boolean, fallback?: { id: number; name: string }) {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch(CATEGORIES_URL, { credentials: "include" })
      .then((r) => r.json())
      .then((data) =>
        setCategories(Array.isArray(data) ? data : (data.data ?? [])),
      )
      .catch(() => {
        if (fallback)
          setCategories([
            {
              id: fallback.id,
              name: fallback.name,
              slug: "",
              image: "",
              status: true,
            },
          ]);
      })
      .finally(() => setLoading(false));
  }, [open]);
  const addCategory = (cat: ApiCategory) =>
    setCategories((prev) => [...prev, cat]);
  return { categories, loading, addCategory };
}

// ─── Form types & factory ─────────────────────────────────────────────────────
type FormBase = ReturnType<typeof makeEmptyForm>;
type ProductFormData = FormBase &
  Partial<
    Pick<
      DisplayProduct,
      | "heroImage"
      | "flatlayImage"
      | "scaleImage"
      | "packingImage"
      | "freezeFrameImage"
    >
  >;

function makeEmptyForm() {
  return {
    name: "",
    description: "",
    brand: "",
    price: 0,
    stock: 0,
    status: "Active" as "Active" | "Archived",
    categoryId: 0,
    category: "",
    tags: [] as string[],
  };
}

// ─── ProductFormFields ────────────────────────────────────────────────────────
function ProductFormFields({
  form,
  setForm,
  files,
  setFiles,
  categories,
  catLoading,
  addCategory,
}: {
  form: ProductFormData;
  setForm: (f: FormBase) => void;
  files: Record<string, File | null>;
  setFiles: (
    fn: (prev: Record<string, File | null>) => Record<string, File | null>,
  ) => void;
  categories: ApiCategory[];
  catLoading: boolean;
  addCategory: (cat: ApiCategory) => void;
}) {
  const setFile = (key: string) => (file: File | null) =>
    setFiles((prev) => ({ ...prev, [key]: file }));
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-neutral-300">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Running Shoe Pro"
          className="py-2 px-3 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:placeholder-neutral-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-neutral-300">
            Brand
          </label>
          <input
            type="text"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            placeholder="e.g. Nike"
            className="py-2 px-3 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:placeholder-neutral-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-neutral-300">
            Status
          </label>
          <select
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value as "Active" | "Archived",
              })
            }
            className="py-2 px-3 pe-9 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2YjcyODAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSI+PC9wb2x5bGluZT48L3N2Zz4=')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1rem_1rem]"
          >
            <option value="Active">Active</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-neutral-300">
          Category <span className="text-red-500">*</span>
        </label>
        <CategorySelect
          categories={categories}
          loading={catLoading}
          value={form.categoryId ? form.categoryId.toString() : ""}
          onChange={(id, name) =>
            setForm({ ...form, categoryId: id, category: name })
          }
          onCategoryCreated={addCategory}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-neutral-300">
            Price ($)
          </label>
          <input
            type="number"
            min={0}
            step={0.01}
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: parseFloat(e.target.value) || 0 })
            }
            className="py-2 px-3 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-neutral-300">
            Stock
          </label>
          <input
            type="number"
            min={0}
            value={form.stock}
            onChange={(e) =>
              setForm({ ...form, stock: parseInt(e.target.value) || 0 })
            }
            className="py-2 px-3 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-neutral-300">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Short product description…"
          rows={3}
          className="py-2 px-3 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:placeholder-neutral-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-neutral-300">
          Tags
        </label>
        <TagsInput
          value={form.tags}
          onChange={(tags) => setForm({ ...form, tags })}
        />
        <p className="mt-1 text-xs text-gray-400 dark:text-neutral-500">
          Press Enter or comma to add a tag
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-neutral-300">
          Images
        </label>
        {form.heroImage !== undefined && (
          <p className="text-xs text-gray-400 dark:text-neutral-500 mb-2">
            Upload a new file to replace an existing image.
          </p>
        )}
        <div className="grid grid-cols-2 gap-3">
          <ImageUploadField
            label="Hero"
            hint="Main listing image"
            existingUrl={(form as DisplayProduct).heroImage}
            onFileChange={setFile("hero")}
          />
          <ImageUploadField
            label="Flatlay"
            hint="Product in context"
            existingUrl={(form as DisplayProduct).flatlayImage}
            onFileChange={setFile("flatlay")}
          />
          <ImageUploadField
            label="Scale"
            hint="Shows product size"
            existingUrl={(form as DisplayProduct).scaleImage}
            onFileChange={setFile("scale")}
          />
          <ImageUploadField
            label="Packing"
            hint="Packaging shot"
            existingUrl={(form as DisplayProduct).packingImage}
            onFileChange={setFile("packing")}
          />
          <ImageUploadField
            label="Freeze Frame"
            hint="Action / motion shot"
            existingUrl={(form as DisplayProduct).freezeFrameImage}
            onFileChange={setFile("freezeFrame")}
          />
        </div>
      </div>
    </div>
  );
}

// ─── AddModal ─────────────────────────────────────────────────────────────────
function AddModal({ onCreated }: { onCreated: (p: DisplayProduct) => void }) {
  const modalId = "hs-add-product-modal";
  const [form, setForm] = useState(makeEmptyForm());
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { categories, loading: catLoading, addCategory } = useCategories(true);

  useEffect(() => {
    if (categories.length > 0 && form.categoryId === 0)
      setForm((prev) => ({
        ...prev,
        categoryId: categories[0].id,
        category: categories[0].name,
      }));
  }, [categories]);

  usePreline([]);
  const reset = () => {
    setForm(makeEmptyForm());
    setFiles({});
    setSaveError(null);
  };
  const closeModal = useCallback(() => {
    import("preline").then(({ HSOverlay }) => {
      HSOverlay.close(`#${modalId}`);
    });
  }, []);

  const handleCreate = async () => {
    if (!form.name.trim()) {
      setSaveError("Product name is required.");
      return;
    }
    if (!form.categoryId) {
      setSaveError("Please select a category.");
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("brand", form.brand);
      fd.append("selling_price", form.price.toString());
      fd.append("status", form.status === "Active" ? "true" : "false");
      fd.append("category_id", form.categoryId.toString());
      form.tags.forEach((tag) => fd.append("tags", tag));
      const imageMap: Record<string, string> = {
        hero: "HERO",
        flatlay: "FLATLAY",
        scale: "SCALE",
        packing: "PACKING",
        freezeFrame: "FREEZE_FRAME",
      };
      Object.entries(imageMap).forEach(([key, type]) => {
        if (files[key]) fd.append(`images_${type}`, files[key] as File);
      });
      const res = await fetch(`${BASE_URL}/api/v1/products/`, {
        method: "POST",
        credentials: "include",
        headers: { "X-CSRFToken": getCsrfToken() },
        body: fd,
      });
      if (!res.ok)
        throw new Error(`Create failed (${res.status}): ${await res.text()}`);
      const result = await res.json();
      if (result.status === "created" && result.data) {
        onCreated({
          ...convertApiProduct(result.data as ApiProduct),
          stock: form.stock,
        });
        reset();
        closeModal();
      } else throw new Error("Unexpected response from server.");
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to create product",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
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
      <div
        id={modalId}
        className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none"
        role="dialog"
        tabIndex={-1}
        aria-labelledby={`${modalId}-label`}
      >
        <div className="hs-overlay-open:opacity-100 hs-overlay-open:duration-300 opacity-0 transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
          <div className="pointer-events-auto flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
            <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
              <h3
                id={`${modalId}-label`}
                className="font-bold text-gray-800 dark:text-white"
              >
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
            <div className="p-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
              <p className="text-sm text-gray-500 dark:text-neutral-400 mb-4">
                Fill in the details to create a new product.
              </p>
              <ProductFormFields
                form={form as ProductFormData}
                setForm={setForm}
                files={files}
                setFiles={setFiles}
                categories={categories}
                catLoading={catLoading}
                addCategory={addCategory}
              />
              {saveError && (
                <div className="mt-3 p-3 text-sm text-red-600 rounded-lg bg-red-50 dark:bg-red-900/20 dark:text-red-400">
                  {saveError}
                </div>
              )}
            </div>
            <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-neutral-700">
              <button
                type="button"
                data-hs-overlay={`#${modalId}`}
                onClick={reset}
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={saving}
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
              >
                {saving && <Loader2 className="size-4 animate-spin" />} Create
                product
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── EditModal ────────────────────────────────────────────────────────────────
function EditModal({
  product,
  onSave,
  onClose,
}: {
  product: DisplayProduct;
  onSave: (p: DisplayProduct) => void;
  onClose: () => void;
}) {
  const modalId = `hs-edit-product-${product.id}`;
  const [form, setForm] = useState<DisplayProduct & FormBase>({
    ...product,
  } as DisplayProduct & FormBase);
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const {
    categories,
    loading: catLoading,
    addCategory,
  } = useCategories(true, { id: product.categoryId, name: product.category });

  usePreline([product.id]);
  useEffect(() => {
    import("preline").then(({ HSOverlay }) => {
      setTimeout(() => HSOverlay.open(`#${modalId}`), 50);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("brand", form.brand);
      fd.append("selling_price", form.price.toString());
      fd.append("status", form.status === "Active" ? "true" : "false");
      fd.append("category_id", form.categoryId.toString());
      form.tags.forEach((tag) => fd.append("tags", tag));
      const imageMap: Record<string, string> = {
        hero: "HERO",
        flatlay: "FLATLAY",
        scale: "SCALE",
        packing: "PACKING",
        freezeFrame: "FREEZE_FRAME",
      };
      Object.entries(imageMap).forEach(([key, type]) => {
        if (files[key]) fd.append(`images_${type}`, files[key] as File);
      });
      const res = await fetch(`${BASE_URL}/api/v1/products/${product.id}/`, {
        method: "PATCH",
        credentials: "include",
        headers: { "X-CSRFToken": getCsrfToken() },
        body: fd,
      });
      if (!res.ok)
        throw new Error(`Save failed (${res.status}): ${await res.text()}`);
      const result = await res.json();
      onSave(
        result.status === "updated" && result.data
          ? {
              ...convertApiProduct(result.data as ApiProduct),
              stock: form.stock,
            }
          : form,
      );
      import("preline").then(({ HSOverlay }) => HSOverlay.close(`#${modalId}`));
      onClose();
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to save changes",
      );
    } finally {
      setSaving(false);
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
              onClick={() => {
                import("preline").then(({ HSOverlay }) =>
                  HSOverlay.close(`#${modalId}`),
                );
                onClose();
              }}
              className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="p-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
            <p className="text-sm text-gray-500 dark:text-neutral-400 mb-4">
              Update the details for {product.name}.
            </p>
            <ProductFormFields
              form={form}
              setForm={setForm as (f: FormBase) => void}
              files={files}
              setFiles={setFiles}
              categories={categories}
              catLoading={catLoading}
              addCategory={addCategory}
            />
            {saveError && (
              <div className="mt-3 p-3 text-sm text-red-600 rounded-lg bg-red-50 dark:bg-red-900/20 dark:text-red-400">
                {saveError}
              </div>
            )}
          </div>
          <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-neutral-700">
            <button
              type="button"
              onClick={() => {
                import("preline").then(({ HSOverlay }) =>
                  HSOverlay.close(`#${modalId}`),
                );
                onClose();
              }}
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            >
              {saving && <Loader2 className="size-4 animate-spin" />} Save
              changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DeleteModal ──────────────────────────────────────────────────────────────
function DeleteModal({
  product,
  onConfirm,
  onClose,
}: {
  product: DisplayProduct;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const modalId = `hs-delete-product-${product.id}`;
  usePreline([product.id]);
  useEffect(() => {
    import("preline").then(({ HSOverlay }) => {
      setTimeout(() => HSOverlay.open(`#${modalId}`), 50);
    });
  }, []);
  const close = () => {
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
              <span className="font-medium text-gray-800 dark:text-white">
                60 days
              </span>{" "}
              before being permanently removed.
            </p>
          </div>
          <div className="flex justify-center items-center gap-x-3 pb-4 px-4">
            <button
              type="button"
              onClick={close}
              className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                close();
              }}
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

// ─── RowActions ───────────────────────────────────────────────────────────────
function RowActions({
  product,
  onEdit,
  onToggle,
  onDelete,
}: {
  product: DisplayProduct;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="hs-dropdown relative inline-flex">
      <button
        id={`row-actions-${product.id}`}
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
        aria-labelledby={`row-actions-${product.id}`}
      >
        <button
          type="button"
          onClick={onEdit}
          role="menuitem"
          className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onToggle}
          role="menuitem"
          className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
        >
          {product.status === "Active" ? "Deactivate" : "Activate"}
        </button>
        <div className="my-1 border-t border-gray-100 dark:border-neutral-700" />
        <button
          type="button"
          onClick={onDelete}
          role="menuitem"
          className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// ─── Shell props ──────────────────────────────────────────────────────────────
interface ShellProps {
  initialProducts: DisplayProduct[];
  initialNextCursor: string | null;
}

// ─── ProductsAdminShell ───────────────────────────────────────────────────────
export function ProductsAdminShell({
  initialProducts,
  initialNextCursor,
}: ShellProps) {
  const [products, setProducts] = useState<DisplayProduct[]>(initialProducts);
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialNextCursor,
  );
  const [editTarget, setEditTarget] = useState<DisplayProduct | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DisplayProduct | null>(null);

  usePreline([products.length]);

  // ── Cursor-based load-more ─────────────────────────────────────────────────
  const handleLoadMore = useCallback(async () => {
    if (!nextCursor) return;
    try {
      // The `next` URL from Django is absolute (http://localhost:8000/...).
      // We proxy it through our Next.js route to keep credentials working.
      const encoded = encodeURIComponent(nextCursor);
      const res = await fetch(`/api/v1/products/?cursor_url=${encoded}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

      const data: CursorPage = await res.json();
      if (data.results?.length) {
        setProducts((prev) => [
          ...prev,
          ...data.results.map(convertApiProduct),
        ]);
      }
      setNextCursor(data.next ?? null);
    } catch (err) {
      console.error("[load more] error:", err);
    }
  }, [nextCursor]);

  const { observerTarget, isLoading: isLoadingMore } = useInfiniteScroll({
    onLoadMore: handleLoadMore,
    hasMore: nextCursor !== null,
  });

  // ── CRUD handlers (unchanged) ──────────────────────────────────────────────
  const handleCreated = (p: DisplayProduct) =>
    setProducts((prev) => [p, ...prev]);
  const handleSave = (updated: DisplayProduct) =>
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  const handleDelete = (id: string) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));
  const toggleActive = (id: string) =>
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "Active" ? "Archived" : "Active" }
          : p,
      ),
    );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
            Products
          </h1>
          <p className="text-sm text-gray-500 dark:text-neutral-400">
            Manage your product catalog
          </p>
        </div>
        <AddModal onCreated={handleCreated} />
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
                      "ID",
                      "Image",
                      "Name",
                      "Brand",
                      "Category",
                      "Tags",
                      "Price",
                      "Stock",
                      "Status",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-neutral-400"
                      >
                        {h}
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
                      <td className="px-4 py-3 whitespace-nowrap text-xs font-mono text-gray-400 dark:text-neutral-500">
                        {product.id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {product.heroImage ? (
                          <img
                            src={product.heroImage}
                            alt={product.name}
                            className="size-10 rounded-lg object-cover border border-gray-200 dark:border-neutral-700"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div className="size-10 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center text-gray-400 text-xs dark:border-neutral-700 dark:bg-neutral-800">
                            —
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                        {product.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                        {product.brand}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-400">
                        {product.category}
                      </td>
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
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                        ${product.price.toFixed(2)}
                      </td>
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
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 text-sm ${product.status === "Active" ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400 dark:text-neutral-500"}`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${product.status === "Active" ? "bg-emerald-500" : "bg-gray-400 dark:bg-neutral-500"}`}
                          />
                          {product.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-end">
                        <RowActions
                          product={product}
                          onEdit={() => setEditTarget(product)}
                          onToggle={() => toggleActive(product.id)}
                          onDelete={() => setDeleteTarget(product)}
                        />
                      </td>
                    </tr>
                  ))}

                  {/* Skeleton rows appear inside the table while loading more */}
                  {isLoadingMore && <TableRowsSkeleton rows={6} />}

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

      <p className="text-sm text-gray-400 dark:text-neutral-500">
        {products.length} products loaded
      </p>

      {/* Sentinel — IntersectionObserver target */}
      <div
        ref={observerTarget}
        style={{ height: "1px", visibility: "hidden" }}
        aria-hidden="true"
      />

      {!isLoadingMore && nextCursor === null && products.length > 0 && (
        <p className="text-center text-xs text-gray-300 dark:text-neutral-600 pb-4">
          All products loaded
        </p>
      )}

      {editTarget && (
        <EditModal
          key={editTarget.id}
          product={editTarget}
          onSave={handleSave}
          onClose={() => setEditTarget(null)}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          key={deleteTarget.id}
          product={deleteTarget}
          onConfirm={() => handleDelete(deleteTarget.id)}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
