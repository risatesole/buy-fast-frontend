'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createStockMovement } from './actions';

const inputClass =
  'w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-[#002d62] focus:ring-1 focus:ring-[#002d62]';

const labelClass = 'mb-1.5 block text-xs font-semibold tracking-wide text-gray-500 uppercase';

export default function NewStockEntryPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState('');
  const [documentReference, setDocumentReference] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function validate(): string | null {
    if (!sku.trim()) return 'El SKU es requerido.';
    if (!quantity || Number.isNaN(Number(quantity))) return 'La cantidad es inválida.';
    if (Number(quantity) <= 0) return 'La cantidad debe ser mayor a cero.';
    return null;
  }

  function handleSubmit(e: React.FormEvent, keepCreating: boolean) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    startTransition(async () => {
      const result = await createStockMovement({
        sku: sku.trim(),
        quantity: Number(quantity),
        document_reference: documentReference.trim(),
      });

      if (!result.ok) {
        setError(result.message);
        return;
      }

      setSuccess(result.message);
      setSku('');
      setQuantity('');
      setDocumentReference('');

      if (keepCreating) {
        router.refresh();
        return;
      }

      setTimeout(() => {
        router.push('/admin/inventory/stockmovement');
        router.refresh();
      }, 900);
    });
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8">
        <p className="mb-1 text-xs font-semibold tracking-widest text-gray-500 uppercase">
          Inventario
        </p>
        <h1 className="font-serif text-3xl font-medium text-gray-900">Entrada de inventario</h1>
      </header>

      <form onSubmit={e => handleSubmit(e, false)} className="flex flex-col gap-6">
        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex flex-col gap-5">
            <div>
              <label className={labelClass} htmlFor="sku">
                SKU
              </label>
              <input
                id="sku"
                className={inputClass}
                value={sku}
                onChange={e => setSku(e.target.value)}
                placeholder="Ej. SHOES"
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="quantity">
                Cantidad
              </label>
              <input
                id="quantity"
                className={inputClass}
                type="number"
                min="1"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                placeholder="Ej. 500"
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="document_reference">
                Documento de referencia
              </label>
              <input
                id="document_reference"
                className={inputClass}
                value={documentReference}
                onChange={e => setDocumentReference(e.target.value)}
                placeholder="Ej. PO-2026-0042"
              />
            </div>
          </div>
        </section>

        {error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md px-6 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={e => handleSubmit(e, true)}
            className={`rounded-md border px-6 py-3 text-sm font-semibold shadow-sm transition-all duration-200 ${
              isPending
                ? 'cursor-not-allowed border-gray-200 text-gray-400 opacity-70'
                : 'border-[#002d62] text-[#002d62] hover:bg-[#002d62]/5 active:scale-[0.98]'
            }`}
          >
            {isPending ? 'Registrando...' : 'Registrar y crear más entradas'}
          </button>

          <button
            type="submit"
            disabled={isPending}
            className={`rounded-md px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 ${
              isPending
                ? 'cursor-not-allowed bg-gray-400 opacity-70'
                : 'bg-[#002d62] hover:bg-[#115cb9] active:scale-[0.98]'
            }`}
          >
            {isPending ? 'Registrando...' : 'Registrar entrada'}
          </button>
        </div>
      </form>
    </main>
  );
}
