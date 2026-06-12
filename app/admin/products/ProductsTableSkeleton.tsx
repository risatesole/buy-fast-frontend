// app/admin/products/ProductsTableSkeleton.tsx
//
// Shown by <Suspense> while the server component is fetching the first page,
// and also rendered inline in the table while infinite scroll loads more rows.

export function ProductsTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header row skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-24 rounded-md bg-gray-200 dark:bg-neutral-700 animate-pulse" />
          <div className="h-4 w-40 rounded-md bg-gray-100 dark:bg-neutral-800 animate-pulse" />
        </div>
        <div className="h-9 w-32 rounded-lg bg-gray-200 dark:bg-neutral-700 animate-pulse" />
      </div>

      {/* Table skeleton */}
      <div className="border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:border-neutral-700">
        {/* thead */}
        <div className="bg-gray-50 dark:bg-neutral-800 px-4 py-3 flex gap-6">
          {[40, 60, 160, 100, 100, 120, 60, 60, 70].map((w, i) => (
            <div
              key={i}
              className="h-3 rounded bg-gray-200 dark:bg-neutral-700 animate-pulse flex-shrink-0"
              style={{ width: w }}
            />
          ))}
        </div>

        {/* rows */}
        {Array.from({ length: 12 }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-700 px-4 py-3 flex items-center gap-6"
          >
            {/* id */}
            <div className="h-3 w-10 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse flex-shrink-0" />
            {/* image */}
            <div className="size-10 rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse flex-shrink-0" />
            {/* name */}
            <div className="h-3 w-40 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse flex-shrink-0" />
            {/* brand */}
            <div className="h-3 w-24 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse flex-shrink-0" />
            {/* category */}
            <div className="h-3 w-24 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse flex-shrink-0" />
            {/* tags */}
            <div className="flex gap-1">
              <div className="h-5 w-14 rounded-md bg-gray-100 dark:bg-neutral-800 animate-pulse" />
              <div className="h-5 w-10 rounded-md bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            </div>
            {/* price */}
            <div className="h-3 w-14 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse flex-shrink-0" />
            {/* stock */}
            <div className="h-3 w-8 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse flex-shrink-0" />
            {/* status */}
            <div className="h-4 w-16 rounded-full bg-gray-100 dark:bg-neutral-800 animate-pulse flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Inline row skeletons (used inside the table while loading more) ────────────

export function TableRowsSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={`skel-${i}`} className="bg-white dark:bg-neutral-900">
          <td className="px-4 py-3">
            <div className="h-3 w-10 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
          </td>
          <td className="px-4 py-3">
            <div className="size-10 rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse" />
          </td>
          <td className="px-4 py-3">
            <div className="h-3 w-40 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
          </td>
          <td className="px-4 py-3">
            <div className="h-3 w-24 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
          </td>
          <td className="px-4 py-3">
            <div className="h-3 w-24 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
          </td>
          <td className="px-4 py-3">
            <div className="flex gap-1">
              <div className="h-5 w-14 rounded-md bg-gray-100 dark:bg-neutral-800 animate-pulse" />
              <div className="h-5 w-10 rounded-md bg-gray-100 dark:bg-neutral-800 animate-pulse" />
            </div>
          </td>
          <td className="px-4 py-3">
            <div className="h-3 w-14 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
          </td>
          <td className="px-4 py-3">
            <div className="h-3 w-8 rounded bg-gray-100 dark:bg-neutral-800 animate-pulse" />
          </td>
          <td className="px-4 py-3">
            <div className="h-4 w-16 rounded-full bg-gray-100 dark:bg-neutral-800 animate-pulse" />
          </td>
          <td className="px-4 py-3" />
        </tr>
      ))}
    </>
  );
}
