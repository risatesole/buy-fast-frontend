"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { createCategoryAction } from "./actions";

// ========== TYPES ==========

type FormState = {
  name: string;
  slug: string;
  description: string;
  image: string; // Now storing URL string instead of File
  status: boolean;
};

type FieldErrorMap = Partial<Record<keyof FormState, string>>;

// ========== VALIDATION ==========

function validate(form: FormState): FieldErrorMap {
  const errors: FieldErrorMap = {};

  if (!form.name.trim()) errors.name = "Category name is required.";
  if (!form.slug.trim()) errors.slug = "Slug is required.";

  // Validate slug format (only lowercase letters, numbers, and hyphens)
  if (form.slug.trim() && !/^[a-z0-9-]+$/.test(form.slug.trim())) {
    errors.slug =
      "Slug can only contain lowercase letters, numbers, and hyphens.";
  }

  if (form.image && !form.image.trim()) {
    errors.image = "Image URL is required.";
  }

  return errors;
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

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800">
      <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
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
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
          error ? "border-red-400" : "border-gray-300 dark:border-gray-600"
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
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
          error ? "border-red-400" : "border-gray-300 dark:border-gray-600"
        }`}
      />
      <FieldError message={error} />
    </div>
  );
}

function StatusToggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Category status
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {value
            ? "Active — visible to customers"
            : "Inactive — hidden from store"}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          value ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-600"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            value ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

function ImageUrlInput({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Image URL
      </label>
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://example.com/image.jpg"
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
          error ? "border-red-400" : "border-gray-300 dark:border-gray-600"
        }`}
      />
      <FieldError message={error} />
      {value && (
        <div className="mt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Preview:
          </p>
          <div className="relative h-32 w-32 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
            <img
              src={value}
              alt="Category preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "";
                (e.target as HTMLImageElement).alt = "Invalid image URL";
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ========== MAIN PAGE ==========

export default function CreateCategoryPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: "",
    slug: "",
    description: "",
    image: "",
    status: true,
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrorMap>({});

  const setField = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    },
    [],
  );

  // Auto-generate slug from name
  const generateSlug = useCallback((name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }, []);

  const handleNameChange = useCallback(
    (name: string) => {
      setField("name", name);
      // Auto-generate slug if slug is empty or was auto-generated
      if (!form.slug || form.slug === generateSlug(form.name)) {
        setField("slug", generateSlug(name));
      }
    },
    [form.name, form.slug, generateSlug, setField],
  );

  const handleSave = useCallback(async () => {
    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    // Prepare the data as JSON matching the curl command
    const categoryData = {
      name: form.name.trim(),
      slug: form.slug.trim().toLowerCase(),
      description: form.description.trim(),
      image: form.image.trim(),
      status: form.status,
    };

    const result = await createCategoryAction(categoryData);

    setSaving(false);

    if (!result.success) {
      setSaveError(result.error ?? "Something went wrong.");
    } else {
      setSaveSuccess(true);
      setTimeout(() => router.push("/admin/products/categories"), 1200);
    }
  }, [form, router]);

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => router.push("/admin/products/categories")}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 mb-2 transition"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Categories
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create Category
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Add a new product category
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Created
            </span>
          )}
          <button
            onClick={() => router.push("/admin/products/categories")}
            disabled={saving}
            className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition flex items-center gap-2"
          >
            {saving && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            )}
            {saving ? "Creating…" : "Create Category"}
          </button>
        </div>
      </div>

      {saveError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 mb-6 text-sm text-red-700 dark:text-red-400">
          {saveError}
        </div>
      )}

      <div className="flex flex-col gap-6">
        {/* Basic info */}
        <SectionCard title="Basic Information">
          <div className="flex flex-col gap-4">
            <TextInput
              label="Category name"
              value={form.name}
              onChange={handleNameChange}
              error={fieldErrors.name}
              placeholder="e.g. Electronics"
              required
            />
            <TextInput
              label="Slug"
              value={form.slug}
              onChange={(v) => setField("slug", v)}
              error={fieldErrors.slug}
              placeholder="e.g. electronics"
              required
            />
            <TextareaInput
              label="Description"
              value={form.description}
              onChange={(v) => setField("description", v)}
              error={fieldErrors.description}
              placeholder="Describe the category…"
              rows={4}
            />
          </div>
        </SectionCard>

        {/* Image & Status */}
        <SectionCard title="Image & Status">
          <div className="flex flex-col gap-4">
            <ImageUrlInput
              value={form.image}
              onChange={(v) => setField("image", v)}
              error={fieldErrors.image}
            />
            <div className="border-t dark:border-gray-700 pt-4">
              <StatusToggle
                value={form.status}
                onChange={(v) => setField("status", v)}
              />
            </div>
          </div>
        </SectionCard>

        {/* Save footer */}
        <div className="flex justify-end gap-3 pb-4">
          <button
            onClick={() => router.push("/admin/products/categories")}
            disabled={saving}
            className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition flex items-center gap-2"
          >
            {saving && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            )}
            {saving ? "Creating…" : "Create Category"}
          </button>
        </div>
      </div>
    </div>
  );
}
