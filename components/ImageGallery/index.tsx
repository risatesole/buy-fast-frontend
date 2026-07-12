'use client';

import { useState } from 'react';
import type { NormalProductVariant } from '@/entities/product';

// ─── Glyph ────────────────────────────────────────────────────

function ProductGlyph({ category }: { category: string }) {
  const stroke = 'oklch(0.708 0 0)';
  const props = {
    width: 80,
    height: 80,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke,
    strokeWidth: 0.75,
  } as const;

  if (category === 'Books')
    return (
      <svg {...props}>
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
      </svg>
    );

  if (category === 'Notebooks')
    return (
      <svg {...props}>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="16" y2="17" />
      </svg>
    );

  if (category === 'Pens')
    return (
      <svg {...props}>
        <line x1="12" y1="19" x2="12" y2="23" />
        <path d="M6.34 17.66l-1.41-1.42 1.41-1.41" />
        <path d="M17.66 17.66l1.41-1.42-1.41-1.41" />
        <path d="M12 2L4.93 9.07a7 7 0 000 9.9L12 22l7.07-3.03a7 7 0 000-9.9L12 2z" />
      </svg>
    );

  return (
    <svg {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

// ─── ImageGallery ─────────────────────────────────────────────

export function ImageGallery({
  variants,
  productName,
  category,
}: {
  variants: NormalProductVariant[];
  productName: string;
  category: string;
}) {
  const [selectedVariant, setSelectedVariant] = useState<NormalProductVariant>(variants[0]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Main image */}
      <div
        style={{
          aspectRatio: '1/1',
          background: 'oklch(0.985 0 0)',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          border: '1px solid oklch(0.922 0 0)',
        }}
      >
        {selectedVariant?.thumbnail ? (
          <img
            src={selectedVariant.thumbnail}
            alt={productName}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <ProductGlyph category={category} />
        )}
      </div>

      {/* Thumbnails — only show if more than one variant */}
      {variants.length > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {variants.map(variant => (
            <button
              key={variant.id}
              onClick={() => setSelectedVariant(variant)}
              style={{
                width: 72,
                height: 72,
                padding: 0,
                border:
                  selectedVariant.id === variant.id
                    ? '2px solid oklch(0.145 0 0)'
                    : '2px solid oklch(0.922 0 0)',
                borderRadius: 4,
                overflow: 'hidden',
                cursor: 'pointer',
                background: 'oklch(0.985 0 0)',
                flexShrink: 0,
                transition: 'border-color 0.15s ease',
              }}
            >
              <img
                src={variant.thumbnail}
                alt={variant.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
