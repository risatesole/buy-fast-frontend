'use client';

import { useState, useEffect, useCallback, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import ProductService from '@/services/products/ProductService';
import type { Product, ProductImageType } from '@/types/products';
import { patchProductAction } from './actions';

const productService = new ProductService();

const IMAGE_TYPES: ProductImageType[] = ['HERO', 'SCALE', 'PACKING', 'FLATLAY', 'FREEZE_FRAME'];

const IMAGE_TYPE_LABELS: Record<ProductImageType, string> = {
  HERO: 'Hero',
  SCALE: 'Scale',
  PACKING: 'Packing',
  FLATLAY: 'Flat Lay',
  FREEZE_FRAME: 'Freeze Frame',
};

// ========== TYPES ==========

type Category = {
  id: number;
  name: string;
  slug: string;
  status: boolean;
};

type FormState = {
  name: string;
  description: string;
  brand: string;
  selling_price: string;
  category_id: string;
  status: boolean;
  tags: string;
  images: Partial<Record<ProductImageType, File | null>>;
};

type FieldErrorMap = Partial<Record<keyof FormState | ProductImageType, string>>;

// ========== SERVICE ==========

async function fetchProductById(id: string): Promise<Product | null> {
  try {
    return await productService.getProductDetails(id);
  } catch {
    return null;
  }
}

async function fetchCategories(): Promise<Category[]> {
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
  if (!BACKEND_URL) {
    console.error('[fetchCategories] NEXT_PUBLIC_API_URL is not set');
    return [];
  }
  const url = `${BACKEND_URL}/api/v1/products/categories`;
  try {
    const res = await fetch(url, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      console.error(`[fetchCategories] ${res.status} ${res.statusText} — ${url}`);
      return [];
    }
    const json = await res.json();
    return json.data ?? [];
  } catch (err) {
    console.error(`[fetchCategories] Network error fetching ${url}:`, err);
    return [];
  }
}

// ========== VALIDATION ==========

function validate(form: FormState): FieldErrorMap {
  const errors: FieldErrorMap = {};

  if (!form.name.trim()) errors.name = 'Product name is required.';
  if (!form.description.trim()) errors.description = 'Description is required.';
  if (!form.brand.trim()) errors.brand = 'Brand is required.';
  if (!form.category_id) errors.category_id = 'Category is required.';

  const price = parseFloat(form.selling_price);
  if (!form.selling_price || isNaN(price) || price < 0)
    errors.selling_price = 'Enter a valid price.';

  return errors;
}

// ========== HOOKS ==========

function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState(false);

  useEffect(() => {
    fetchCategories().then(data => {
      if (data.length === 0) setCategoriesError(true);
      setCategories(data);
      setLoadingCategories(false);
    });
  }, []);

  return { categories, loadingCategories, categoriesError };
}

function useEditProduct(id: string) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrorMap>({});

  const [form, setForm] = useState<FormState>({
    name: '',
    description: '',
    brand: '',
    selling_price: '',
    category_id: '',
    status: true,
    tags: '',
    images: {},
  });

  useEffect(() => {
    fetchProductById(id).then(p => {
      if (!p) {
        setFetchError('Product not found.');
      } else {
        setProduct(p);
        setForm({
          name: p.name,
          description: p.description,
          brand: p.brand,
          selling_price: String(p.selling_price),
          category_id: String(p.category?.id ?? ''),
          status: p.status,
          tags: (p.tags ?? []).join(', '),
          images: {},
        });
      }
      setLoading(false);
    });
  }, [id]);

  const setField = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setFieldErrors(prev => ({ ...prev, [key]: undefined }));
  }, []);

  const setImageFile = useCallback((type: ProductImageType, file: File | null) => {
    setForm(prev => ({
      ...prev,
      images: { ...prev.images, [type]: file },
    }));
  }, []);

  const handleSave = useCallback(async () => {
    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    // Build the multipart body here, then hand it to the server action.
    // The server action runs on the Next.js server and forwards the
    // session cookie to Django itself, sidestepping cross-site cookie
    // rules entirely (the browser only ever talks to our own origin).
    const body = new FormData();
    body.append('name', form.name.trim());
    body.append('description', form.description.trim());
    body.append('brand', form.brand.trim());
    body.append('selling_price', form.selling_price);
    body.append('category_id', form.category_id);
    body.append('status', String(form.status));

    const tags = form.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
    tags.forEach(tag => body.append('tags', tag));

    for (const type of IMAGE_TYPES) {
      const file = form.images[type];
      if (file) body.append(`images_${type}`, file);
    }

    const result = await patchProductAction(id, body);

    setSaving(false);

    if (!result.success) {
      setSaveError(result.error ?? 'Something went wrong.');
    } else {
      setSaveSuccess(true);
      setTimeout(() => router.push('/admin/products'), 1200);
    }
  }, [form, id, router]);

  return {
    product,
    form,
    loading,
    saving,
    fetchError,
    saveError,
    saveSuccess,
    fieldErrors,
    setField,
    setImageFile,
    handleSave,
  };
}

// ========== COMPONENTS ==========

function BouncingDots() {
  return (
    <div className="flex space-x-2">
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" />
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
          error ? 'border-red-400' : 'border-gray-300'
        }`}
      />
      <FieldError message={error} />
    </div>
  );
}

function TextareaInput({
  label,
  value,
  onChange,
  error,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none ${
          error ? 'border-red-400' : 'border-gray-300'
        }`}
      />
      <FieldError message={error} />
    </div>
  );
}

function CategorySelect({
  categories,
  loadingCategories,
  value,
  onChange,
  error,
}: {
  categories: Category[];
  loadingCategories: boolean;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={loadingCategories}
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white disabled:bg-gray-50 disabled:text-gray-400 ${
          error ? 'border-red-400' : 'border-gray-300'
        }`}
      >
        <option value="">{loadingCategories ? 'Loading categories…' : 'Select a category'}</option>
        {categories.map(cat => (
          <option key={cat.id} value={String(cat.id)}>
            {cat.name}
            {!cat.status ? ' (inactive)' : ''}
          </option>
        ))}
      </select>
      <FieldError message={error} />
    </div>
  );
}

function StatusToggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-700">Product status</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {value ? 'Active — visible to customers' : 'Inactive — hidden from store'}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          value ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

function ImageUploadSlot({
  type,
  existingUrl,
  file,
  onFile,
}: {
  type: ProductImageType;
  existingUrl?: string;
  file: File | null | undefined;
  onFile: (f: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const preview = file ? URL.createObjectURL(file) : existingUrl;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
        {IMAGE_TYPE_LABELS[type]}
      </p>
      <div
        onClick={() => inputRef.current?.click()}
        className="relative group cursor-pointer rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-400 transition overflow-hidden bg-gray-50 aspect-square flex items-center justify-center"
      >
        {preview ? (
          <>
            <img src={preview} alt={type} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <span className="text-white text-xs font-medium">Replace</span>
            </div>
          </>
        ) : (
          <div className="text-center px-2">
            <svg
              className="mx-auto h-6 w-6 text-gray-300 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="text-xs text-gray-400">Upload</span>
          </div>
        )}
      </div>

      {file && (
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onFile(null);
          }}
          className="text-xs text-red-500 hover:text-red-700 text-center"
        >
          Remove new file
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => onFile(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}

// ========== MAIN PAGE ==========

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const {
    product,
    form,
    loading,
    saving,
    fetchError,
    saveError,
    saveSuccess,
    fieldErrors,
    setField,
    setImageFile,
    handleSave,
  } = useEditProduct(id);

  const { categories, loadingCategories } = useCategories();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <BouncingDots />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 font-medium">{fetchError}</p>
          <button
            onClick={() => router.push('/admin/products')}
            className="mt-4 text-sm text-red-600 underline hover:no-underline"
          >
            Back to products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => router.push('/admin/products')}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-2 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Products
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-sm text-gray-500 mt-0.5">ID #{id}</p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Saved
            </span>
          )}
          <button
            onClick={() => router.push('/admin/products')}
            disabled={saving}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition flex items-center gap-2"
          >
            {saving && (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>

      {saveError && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6 text-sm text-red-700">
          {saveError}
        </div>
      )}

      <div className="flex flex-col gap-6">
        {/* Basic info */}
        <SectionCard title="Basic information">
          <div className="flex flex-col gap-4">
            <TextInput
              label="Product name"
              value={form.name}
              onChange={v => setField('name', v)}
              error={fieldErrors.name}
              placeholder="e.g. Nike Air Max 90"
            />
            <TextareaInput
              label="Description"
              value={form.description}
              onChange={v => setField('description', v)}
              error={fieldErrors.description}
              placeholder="Describe the product…"
              rows={5}
            />
          </div>
        </SectionCard>

        {/* Pricing & brand */}
        <SectionCard title="Pricing & brand">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              label="Brand"
              value={form.brand}
              onChange={v => setField('brand', v)}
              error={fieldErrors.brand}
              placeholder="e.g. Nike"
            />
            <TextInput
              label="Selling price (USD)"
              value={form.selling_price}
              onChange={v => setField('selling_price', v)}
              error={fieldErrors.selling_price}
              placeholder="0.00"
              type="number"
            />
          </div>
        </SectionCard>

        {/* Category & status */}
        <SectionCard title="Category & status">
          <div className="flex flex-col gap-4">
            <CategorySelect
              categories={categories}
              loadingCategories={loadingCategories}
              value={form.category_id}
              onChange={v => setField('category_id', v)}
              error={fieldErrors.category_id}
            />

            <div className="border-t pt-4">
              <StatusToggle value={form.status} onChange={v => setField('status', v)} />
            </div>
          </div>
        </SectionCard>

        {/* Tags */}
        <SectionCard title="Tags">
          <TextInput
            label="Tags (comma-separated)"
            value={form.tags}
            onChange={v => setField('tags', v)}
            placeholder="e.g. running, sport, men"
          />
          {form.tags && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {form.tags
                .split(',')
                .map(t => t.trim())
                .filter(Boolean)
                .map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
            </div>
          )}
        </SectionCard>

        {/* Images */}
        <SectionCard title="Images">
          <p className="text-xs text-gray-500 mb-4">
            Upload a new file to replace an existing image. Slots left empty will keep their current
            image.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {IMAGE_TYPES.map(type => (
              <ImageUploadSlot
                key={type}
                type={type}
                existingUrl={product?.images.find(img => img.type === type)?.url}
                file={form.images[type]}
                onFile={f => setImageFile(type, f)}
              />
            ))}
          </div>
        </SectionCard>

        {/* Save footer (repeated for long forms) */}
        <div className="flex justify-end gap-3 pb-4">
          <button
            onClick={() => router.push('/admin/products')}
            disabled={saving}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition flex items-center gap-2"
          >
            {saving && (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
