// app/admin/products/FormControls.tsx
//
// Small, reusable UI controls used exclusively inside the product form.
// Keeping them here avoids cluttering the main form file.

"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Plus, Upload, X, Loader2 } from "lucide-react";
import type { ApiCategory } from "./types";
import { slugify, backendBaseUrl } from "./utilities";

// ── Shared input class ────────────────────────────────────────────────────────

export const inputClassName =
  "py-2 px-3 block w-full border border-gray-200 rounded-lg text-sm " +
  "focus:border-blue-500 focus:ring-1 focus:ring-blue-500 " +
  "dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:placeholder-neutral-500";

export const selectClassName =
  inputClassName +
  " appearance-none pe-9 " +
  "bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2YjcyODAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSI+PC9wb2x5bGluZT48L3N2Zz4=')] " +
  "bg-no-repeat bg-[right_0.75rem_center] bg-[length:1rem_1rem]";

// ── TagsInput ─────────────────────────────────────────────────────────────────

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

export function TagsInput({ value, onChange }: TagsInputProps) {
  const [inputText, setInputText] = useState("");

  const addTag = (rawText: string) => {
    const trimmed = rawText.trim().toLowerCase();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInputText("");
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag(inputText);
    } else if (event.key === "Backspace" && inputText === "" && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
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
        value={inputText}
        onChange={(event) => setInputText(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => inputText.trim() && addTag(inputText)}
        placeholder={value.length === 0 ? "Type a tag and press Enter…" : ""}
        className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-neutral-500 dark:text-neutral-200"
      />
    </div>
  );
}

// ── ImageUploadField ──────────────────────────────────────────────────────────

interface ImageUploadFieldProps {
  label: string;
  hint: string;
  existingUrl?: string;
  onFileChange: (file: File | null) => void;
}

export function ImageUploadField({ label, hint, existingUrl, onFileChange }: ImageUploadFieldProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingUrl ?? null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewUrl(existingUrl ?? null);
  }, [existingUrl]);

  const handleFile = (file: File) => {
    setPreviewUrl(URL.createObjectURL(file));
    onFileChange(file);
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
        {label}
      </label>
      <p className="text-xs text-gray-500 dark:text-neutral-400">{hint}</p>
      <div
        className={`relative flex items-center justify-center rounded-lg border-2 border-dashed transition-colors cursor-pointer h-28 ${
          previewUrl
            ? "border-gray-200 dark:border-neutral-600"
            : "border-gray-200 hover:border-gray-300 dark:border-neutral-700 dark:hover:border-neutral-500"
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={(event) => {
          event.preventDefault();
          const file = event.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
        onDragOver={(event) => event.preventDefault()}
      >
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="preview"
              className="h-full w-full object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setPreviewUrl(null);
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
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
    </div>
  );
}

// ── CategorySelect ────────────────────────────────────────────────────────────

const categoriesUrl = `${backendBaseUrl}/api/v1/productcategories/`;

interface CategorySelectProps {
  categories: ApiCategory[];
  isLoading: boolean;
  selectedCategoryId: string;
  onChange: (categoryId: number, categoryName: string) => void;
  onCategoryCreated: (category: ApiCategory) => void;
}

export function CategorySelect({
  categories,
  isLoading,
  selectedCategoryId,
  onChange,
  onCategoryCreated,
}: CategorySelectProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategorySlug, setNewCategorySlug] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    setNewCategorySlug(slugify(newCategoryName));
  }, [newCategoryName]);

  const handleCreate = async () => {
    if (!newCategoryName.trim()) { setCreateError("Name is required."); return; }
    if (!newCategorySlug.trim()) { setCreateError("Slug is required."); return; }
    setIsCreating(true);
    setCreateError(null);
    try {
      const response = await fetch(categoriesUrl, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim(), slug: newCategorySlug.trim() }),
      });
      if (!response.ok) {
        throw new Error(`Failed (${response.status}): ${await response.text()}`);
      }
      const result = await response.json();
      const createdCategory: ApiCategory = result.data ?? result;
      onCategoryCreated(createdCategory);
      onChange(createdCategory.id, createdCategory.name);
      setShowCreateForm(false);
      setNewCategoryName("");
      setNewCategorySlug("");
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : "Failed to create category.");
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 h-10 text-sm text-gray-500">
        <Loader2 className="size-4 animate-spin" /> Loading categories…
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <select
        value={selectedCategoryId}
        onChange={(event) => {
          const category = categories.find(
            (candidate) => candidate.id.toString() === event.target.value
          );
          if (category) onChange(category.id, category.name);
        }}
        className={selectClassName}
      >
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id.toString()}>
            {category.name}
          </option>
        ))}
      </select>

      {!showCreateForm ? (
        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400 transition-colors"
        >
          <Plus className="size-3.5" /> New category
        </button>
      ) : (
        <div className="rounded-lg border border-gray-200 dark:border-neutral-700 p-3 space-y-2 bg-gray-50 dark:bg-neutral-800">
          <input
            autoFocus
            placeholder="Category name"
            value={newCategoryName}
            onChange={(event) => setNewCategoryName(event.target.value)}
            className="py-1.5 px-2.5 block w-full border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200"
          />
          <input
            placeholder="slug-here"
            value={newCategorySlug}
            onChange={(event) => setNewCategorySlug(event.target.value)}
            className="py-1.5 px-2.5 block w-full border border-gray-200 rounded-md text-sm font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200"
          />
          {createError && <p className="text-xs text-red-600">{createError}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCreate}
              disabled={isCreating}
              className="flex-1 py-1.5 px-3 inline-flex justify-center items-center gap-x-2 text-xs font-medium rounded-md border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isCreating && <Loader2 className="size-3 animate-spin" />} Create
            </button>
            <button
              type="button"
              onClick={() => { setShowCreateForm(false); setNewCategoryName(""); setCreateError(null); }}
              disabled={isCreating}
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
