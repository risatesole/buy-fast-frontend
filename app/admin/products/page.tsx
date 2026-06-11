"use client";

import { useState, useRef, useEffect } from "react";
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
import { MoreHorizontal, PlusCircle, Upload, X, Trash2, Loader2 } from "lucide-react";

// Match the API response structure
interface ApiProduct {
  id: number;
  name: string;
  description: string;
  brand: string;
  selling_price: number;
  status: boolean;
  category: {
    id: number;
    name: string;
    slug: string;
    image: string;
    status: boolean;
  };
  images: Array<{
    url: string;
    type: string;
  }>;
  tags: string[];
}

// Converted product for UI display
interface DisplayProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number; // API doesn't have stock, defaulting to random or you can remove
  status: "Active" | "Draft" | "Archived";
  description: string;
  brand: string;
  heroImage?: string;
}

const statusStyles: Record<string, string> = {
  Active: "text-emerald-600",
  Draft: "text-yellow-600",
  Archived: "text-zinc-400",
};

const dotStyles: Record<string, string> = {
  Active: "bg-emerald-500",
  Draft: "bg-yellow-500",
  Archived: "bg-zinc-400",
};

// Helper to convert API product to display format
function convertApiProduct(apiProduct: ApiProduct): DisplayProduct {
  // Map boolean status to our status types
  let displayStatus: "Active" | "Draft" | "Archived" = "Active";
  if (!apiProduct.status) {
    displayStatus = "Archived";
  }
  // You could add logic for "Draft" based on some condition

  const heroImage = apiProduct.images?.find(img => img.type === "HERO")?.url;

  return {
    id: apiProduct.id.toString(),
    name: apiProduct.name,
    category: apiProduct.category?.name || "Uncategorized",
    price: apiProduct.selling_price,
    stock: Math.floor(Math.random() * 100), // API doesn't provide stock, generating random
    status: displayStatus,
    description: apiProduct.description,
    brand: apiProduct.brand,
    heroImage: heroImage,
  };
}

// ─── Image Upload Field ───────────────────────────────────────────────────────
function ImageUploadField({ label, hint }: { label: string; hint: string }) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      <p className="text-xs text-muted-foreground">{hint}</p>
      <div
        className={`relative flex items-center justify-center rounded-lg border-2 border-dashed transition-colors cursor-pointer
          ${preview ? "border-border" : "border-muted-foreground/25 hover:border-muted-foreground/50"} h-28`}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
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

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit product</DialogTitle>
          <DialogDescription>
            Update the details for {product.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
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
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
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
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) =>
                  setForm({ ...form, stock: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short product description…"
              className="resize-none"
              rows={3}
            />
          </div>

          {form.heroImage && (
            <div className="space-y-1.5">
              <Label>Current Hero Image</Label>
              <img 
                src={form.heroImage} 
                alt={form.name}
                className="rounded-lg border max-h-32 object-cover"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <ImageUploadField
              label="Main image"
              hint="Shown in listings and search"
            />
            <ImageUploadField
              label="Scale image"
              hint="Shows product size in context"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
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
  const [editTarget, setEditTarget] = useState<DisplayProduct | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DisplayProduct | null>(null);

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/v1/products/");
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      const result = await response.json();
      if (result.status === "ok" && Array.isArray(result.data)) {
        const displayProducts = result.data.map(convertApiProduct);
        setProducts(displayProducts);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = (updated: DisplayProduct) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    // TODO: Add PUT/PATCH API call to persist changes
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    // TODO: Add DELETE API call
  };

  const toggleActive = (id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "Active" ? "Archived" : "Active" }
          : p,
      ),
    );
    // TODO: Add API call to update status
  };

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
          <Button variant="outline" size="sm" className="mt-3" onClick={fetchProducts}>
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
        <Button>
          <PlusCircle className="mr-2 size-4" />
          Add product
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
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
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {product.heroImage && (
                      <img 
                        src={product.heroImage} 
                        alt="" 
                        className="size-8 rounded object-cover"
                      />
                    )}
                    <span>{product.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {product.brand}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {product.category}
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
