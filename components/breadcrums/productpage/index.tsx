import type { Product } from '@/types/products';

export function ProductPageBreadcrumb({ product }: { product: Product }) {
  return (
    <nav
      style={{
        fontSize: '0.68rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'oklch(0.708 0 0)',
        marginBottom: '3rem',
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <a href="/" style={{ color: 'oklch(0.708 0 0)', textDecoration: 'none' }}>
        Home
      </a>
      <span>/</span>
      <a
        href={`/?category=${product.category.id}`}
        style={{ color: 'oklch(0.708 0 0)', textDecoration: 'none' }}
      >
        {product.category.name}
      </a>
      <span>/</span>
      <span style={{ color: 'oklch(0.35 0 0)' }}>{product.name}</span>
    </nav>
  );
}
