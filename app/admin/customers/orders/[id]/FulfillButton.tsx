// app/admin/customers/orders/[id]/FulfillButton.tsx
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { fulfillOrder } from './fulfillOrder';

interface FulfillButtonProps {
  orderId: number;
}

export default function FulfillButton({ orderId }: FulfillButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleFulfill = async () => {
    setError(null);

    startTransition(async () => {
      try {
        const result = await fulfillOrder(orderId);

        if (!result.ok) {
          throw new Error(result.message);
        }

        // Refresh the page to show updated status
        router.refresh();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An error occurred while fulfilling the order'
        );
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleFulfill}
        disabled={isPending}
        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isPending ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Completando...
          </>
        ) : (
          'Completar orden'
        )}
      </button>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
