"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  MoreHorizontal,
  PlusCircle,
  Upload,
  X,
  Trash2,
  Loader2,
  Plus,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  image: string;
  status: boolean;
}

interface ApiProduct {
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

interface DisplayProduct {
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
  // All supported image types
  heroImage?: string;
  flatlayImage?: string;
  scaleImage?: string;
  packingImage?: string;
  freezeFrameImage?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const statusStyles: Record<string, string> = {
  Active: "text-emerald-600",
  Archived: "text-zinc-400",
};

const dotStyles: Record<string, string> = {
  Active: "bg-emerald-500",
  Archived: "bg-zinc-400",
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const CATEGORIES_URL = `${BASE_URL}/api/v1/productcategories/`;

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

function convertApiProduct(apiProduct: ApiProduct): DisplayProduct {
  const displayStatus: "Active" | "Archived" = apiProduct.status
    ? "Active"
    : "Archived";

  const img = (type: string) =>
    toAbsolute(apiProduct.images?.find((i) => i.type === type)?.url);

  return {
    id: apiProduct.id.toString(),
    name: apiProduct.name,
    category: apiProduct.category?.name || "Uncategorized",
    categoryId: apiProduct.category?.id ?? 1,
    tags: apiProduct.tags ?? [],
    price: apiProduct.selling_price,
    stock: Math.floor(Math.random() * 100),
    status: displayStatus,
    description: apiProduct.description,
    brand: apiProduct.brand,
    heroImage: img("HERO"),
    flatlayImage: img("FLATLAY"),
    scaleImage: img("SCALE"),
    packingImage: img("PACKING"),
    freezeFrameImage: img("FREEZE_FRAME"),
  };
}

// ─── Tags Input ───────────────────────────────────────────────────────────────
function TagsInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
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
    } else if (e.key === "Backspace" && input === "" && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5 rounded-md border border-input bg-background px-3 py-2 min-h-[40px] cursor-text focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="text-muted-foreground hover:text-foreground"
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
        className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}

// ─── Image Upload Field ───────────────────────────────────────────────────────
function ImageUploadField({
  label,
  hint,
  onFileChange,
  existingUrl,
}: {
  label: string;
  hint: string;
  onFileChange: (file: File | null) => void;
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
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      <p className="text-xs text-muted-foreground">{hint}</p>
      <div
        className={`relative flex items-center justify-center rounded-lg border-2 border-dashed transition-colors cursor-pointer
          ${preview ? "border-border" : "border-muted-foreground/25 hover:border-muted-foreground/50"} h-28`}
        onClick={() => inputRef.current?.click()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
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
              className="absolute top-1.5 right-1.5 rounded-full bg-background/80 p-0.5 shadow hover:bg-background"
            >
              <X className="size-3.5 text-muted-foreground" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-muted-foreground pointer-events-none select-none">
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
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
    </div>
  );
}

// ─── Category Select with inline "New category" form ─────────────────────────
function CategorySelect({
  categories,
  loading,
  value, // categoryId as string
  onChange, // (id: number, name: string) => void
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

  // Auto-fill slug from name
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
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Failed (${res.status}): ${txt}`);
      }
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

  if (loading) {
    return (
      <div className="flex items-center gap-2 h-10 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> Loading categories…
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Select
        value={value}
        onValueChange={(v) => {
          const cat = categories.find((c) => c.id.toString() === v);
          if (cat) onChange(cat.id, cat.name);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id.toString()}>
              {cat.name}
            </SelectItem>
          ))}
          {/* ── divider + inline create trigger ── */}
          <div className="py-1">
            <div className="h-px bg-border mb-1" />
            {!showNew ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowNew(true);
                }}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <Plus className="size-3.5" />
                New category
              </button>
            ) : (
              <div
                className="px-2 py-2 space-y-2"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                <Input
                  autoFocus
                  placeholder="Category name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="h-8 text-sm"
                />
                <Input
                  placeholder="slug-here"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  className="h-8 text-sm font-mono"
                />
                {createError && (
                  <p className="text-xs text-destructive">{createError}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="h-7 text-xs flex-1"
                    onClick={handleCreate}
                    disabled={creating}
                  >
                    {creating && (
                      <Loader2 className="mr-1 size-3 animate-spin" />
                    )}
                    Create
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs"
                    onClick={() => {
                      setShowNew(false);
                      setNewName("");
                      setCreateError(null);
                    }}
                    disabled={creating}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}

// ─── Shared hook: fetch categories ───────────────────────────────────────────
function useCategories(open: boolean, fallback?: { id: number; name: string }) {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch(CATEGORIES_URL, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        const list: ApiCategory[] = Array.isArray(data)
          ? data
          : (data.data ?? []);
        setCategories(list);
      })
      .catch(() => {
        if (fallback) {
          setCategories([
            {
              id: fallback.id,
              name: fallback.name,
              slug: "",
              image: "",
              status: true,
            },
          ]);
        }
      })
      .finally(() => setLoading(false));
  }, [open]);

  const addCategory = (cat: ApiCategory) =>
    setCategories((prev) => [...prev, cat]);

  return { categories, loading, addCategory };
}

// ─── Add Dialog ───────────────────────────────────────────────────────────────
const EMPTY_FORM = {
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

function AddDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (product: DisplayProduct) => void;
}) {
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { categories, loading: catLoading, addCategory } = useCategories(open);

  useEffect(() => {
    if (!open) return;
    setForm({ ...EMPTY_FORM });
    setFiles({});
    setSaveError(null);
  }, [open]);

  // Pre-select first category once loaded
  useEffect(() => {
    if (categories.length > 0 && form.categoryId === 0) {
      setForm((prev) => ({
        ...prev,
        categoryId: categories[0].id,
        category: categories[0].name,
      }));
    }
  }, [categories]);

  const setFile = (key: string) => (file: File | null) =>
    setFiles((prev) => ({ ...prev, [key]: file }));

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
        onClose();
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to create product",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add product</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new product.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="add-name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="add-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Running Shoe Pro"
            />
          </div>

          {/* Brand + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="add-brand">Brand</Label>
              <Input
                id="add-brand"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                placeholder="e.g. Nike"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm({ ...form, status: v as DisplayProduct["status"] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label>
              Category <span className="text-destructive">*</span>
            </Label>
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

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="add-price">Price ($)</Label>
              <Input
                id="add-price"
                type="number"
                min={0}
                step={0.01}
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-stock">Stock</Label>
              <Input
                id="add-stock"
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) =>
                  setForm({ ...form, stock: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="add-description">Description</Label>
            <Textarea
              id="add-description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Short product description…"
              className="resize-none"
              rows={3}
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <Label>Tags</Label>
            <TagsInput
              value={form.tags}
              onChange={(tags) => setForm({ ...form, tags })}
            />
            <p className="text-xs text-muted-foreground">
              Press Enter or comma to add a tag
            </p>
          </div>

          {/* Images — all 5 types */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Images</Label>
            <div className="grid grid-cols-2 gap-3">
              <ImageUploadField
                label="Hero"
                hint="Main listing image"
                onFileChange={setFile("hero")}
              />
              <ImageUploadField
                label="Flatlay"
                hint="Product in context"
                onFileChange={setFile("flatlay")}
              />
              <ImageUploadField
                label="Scale"
                hint="Shows product size"
                onFileChange={setFile("scale")}
              />
              <ImageUploadField
                label="Packing"
                hint="Packaging shot"
                onFileChange={setFile("packing")}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ImageUploadField
                label="Freeze Frame"
                hint="Action / motion shot"
                onFileChange={setFile("freezeFrame")}
              />
            </div>
          </div>

          {saveError && (
            <p className="text-sm text-destructive rounded-md bg-destructive/10 px-3 py-2">
              {saveError}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={saving}>
            {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
            Create product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Edit Dialog ──────────────────────────────────────────────────────────────
function EditDialog({
  product,
  open,
  onClose,
  onSave,
}: {
  product: DisplayProduct;
  open: boolean;
  onClose: () => void;
  onSave: (updated: DisplayProduct) => void;
}) {
  const [form, setForm] = useState({ ...product });
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const {
    categories,
    loading: catLoading,
    addCategory,
  } = useCategories(open, {
    id: product.categoryId,
    name: product.category,
  });

  useEffect(() => {
    if (!open) return;
    setForm({ ...product });
    setFiles({});
    setSaveError(null);
  }, [open, product]);

  const setFile = (key: string) => (file: File | null) =>
    setFiles((prev) => ({ ...prev, [key]: file }));

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
      if (result.status === "updated" && result.data) {
        onSave({
          ...convertApiProduct(result.data as ApiProduct),
          stock: form.stock,
        });
      } else {
        onSave(form);
      }
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
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit product</DialogTitle>
          <DialogDescription>
            Update the details for {product.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Brand + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-brand">Brand</Label>
              <Input
                id="edit-brand"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm({ ...form, status: v as DisplayProduct["status"] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label>Category</Label>
            <CategorySelect
              categories={categories}
              loading={catLoading}
              value={form.categoryId.toString()}
              onChange={(id, name) =>
                setForm({ ...form, categoryId: id, category: name })
              }
              onCategoryCreated={addCategory}
            />
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-price">Price ($)</Label>
              <Input
                id="edit-price"
                type="number"
                min={0}
                step={0.01}
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-stock">Stock</Label>
              <Input
                id="edit-stock"
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) =>
                  setForm({ ...form, stock: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Short product description…"
              className="resize-none"
              rows={3}
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <Label>Tags</Label>
            <TagsInput
              value={form.tags}
              onChange={(tags) => setForm({ ...form, tags })}
            />
            <p className="text-xs text-muted-foreground">
              Press Enter or comma to add a tag
            </p>
          </div>

          {/* Images — all 5 types, showing existing previews */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Images</Label>
            <p className="text-xs text-muted-foreground">
              Upload a new file to replace an existing image.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <ImageUploadField
                label="Hero"
                hint="Main listing image"
                existingUrl={form.heroImage}
                onFileChange={setFile("hero")}
              />
              <ImageUploadField
                label="Flatlay"
                hint="Product in context"
                existingUrl={form.flatlayImage}
                onFileChange={setFile("flatlay")}
              />
              <ImageUploadField
                label="Scale"
                hint="Shows product size"
                existingUrl={form.scaleImage}
                onFileChange={setFile("scale")}
              />
              <ImageUploadField
                label="Packing"
                hint="Packaging shot"
                existingUrl={form.packingImage}
                onFileChange={setFile("packing")}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ImageUploadField
                label="Freeze Frame"
                hint="Action / motion shot"
                existingUrl={form.freezeFrameImage}
                onFileChange={setFile("freezeFrame")}
              />
            </div>
          </div>

          {saveError && (
            <p className="text-sm text-destructive rounded-md bg-destructive/10 px-3 py-2">
              {saveError}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Dialog ────────────────────────────────────────────────────────────
function DeleteDialog({
  product,
  open,
  onClose,
  onConfirm,
}: {
  product: DisplayProduct;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10">
              <Trash2 className="size-5 text-destructive" />
            </div>
            <DialogTitle>Delete product?</DialogTitle>
          </div>
          <DialogDescription className="text-sm leading-relaxed">
            <span className="font-medium text-foreground">{product.name}</span>{" "}
            will be moved to the recycling bin. Deleted products are kept for{" "}
            <span className="font-medium text-foreground">60 days</span> before
            being permanently removed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProductsAdminPage() {
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<DisplayProduct | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DisplayProduct | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/products/`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      const result = await res.json();
      if (result.status === "ok" && Array.isArray(result.data)) {
        setProducts(result.data.map(convertApiProduct));
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreated = (product: DisplayProduct) =>
    setProducts((prev) => [product, ...prev]);

  const handleSave = (updated: DisplayProduct) =>
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

  const handleDelete = (id: string) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));
  // TODO: wire DELETE API call

  const toggleActive = (id: string) =>
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "Active" ? "Archived" : "Active" }
          : p,
      ),
    );
  // TODO: wire status PATCH API call

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <p className="font-medium">Error loading products</p>
          <p className="text-sm">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={fetchProducts}
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage your product catalog
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <PlusCircle className="mr-2 size-4" />
          Add product
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">ID</TableHead>
              <TableHead className="w-[60px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {product.id}
                </TableCell>
                <TableCell>
                  {product.heroImage ? (
                    <img
                      src={product.heroImage}
                      alt={product.name}
                      className="size-10 rounded-md object-cover border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="size-10 rounded-md border bg-muted flex items-center justify-center text-muted-foreground text-xs">
                      —
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {product.brand}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {product.category}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {product.tags.length > 0 ? (
                      product.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>
                  <span
                    className={
                      product.stock === 0 ? "text-destructive font-medium" : ""
                    }
                  >
                    {product.stock === 0 ? "Out of stock" : product.stock}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center gap-1.5 text-sm ${statusStyles[product.status]}`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${dotStyles[product.status]}`}
                    />
                    {product.status}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditTarget(product)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => toggleActive(product.id)}
                      >
                        {product.status === "Active"
                          ? "Deactivate"
                          : "Activate"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDeleteTarget(product)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground">
        {products.length} products total
      </p>

      <AddDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={handleCreated}
      />

      {editTarget && (
        <EditDialog
          product={editTarget}
          open={!!editTarget}
          onClose={() => setEditTarget(null)}
          onSave={handleSave}
        />
      )}
      {deleteTarget && (
        <DeleteDialog
          product={deleteTarget}
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => handleDelete(deleteTarget.id)}
        />
      )}
    </div>
  );
}
