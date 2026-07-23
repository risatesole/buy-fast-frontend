'use client';

import { useState, useEffect, use } from 'react';
// import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Edit,
  Info,
  Package,
  DollarSign,
  Grid,
  Box,
  CheckCircle,
  XCircle,
  AlertCircle,
  LucideIcon,
} from 'lucide-react';

const currencyFormatter = new Intl.NumberFormat('es-DO', {
  style: 'currency',
  currency: 'DOP',
});

function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

const STATUS_LABELS: Record<string, { label: string; color: string; icon: LucideIcon }> = {
  active: {
    label: 'Activo',
    color: 'text-[#137333] bg-[#e6f4ea] border-[#ceead6]',
    icon: CheckCircle,
  },
  inactive: {
    label: 'Inactivo',
    color: 'text-[#747781] bg-[#f2f4f6] border-[#e0e3e5]',
    icon: XCircle,
  },
  draft: {
    label: 'Borrador',
    color: 'text-[#b76e00] bg-[#fff4e5] border-[#ffe4b5]',
    icon: AlertCircle,
  },
};

// Define types locally
type Variant = {
  id: number;
  name: string;
  description: string | null;
  thumbnail: string | null;
  variantnumber: number;
  sku: string;
  slug: string;
  selling_price: number;
  tax_rate: number;
  image_hero: string | null;
  image_thumbnail: string | null;
  image_gallery: string | null;
  status: boolean;
  images: string[];
  created_at: string;
  updated_at: string;
};

type Product = {
  id: number;
  name: string;
  category: string;
  product_type: string;
  thumbnail: string;
  slug: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  variants: Variant[];
  status?: string;
};

function isProductAvailable(product: Product): boolean {
  return product.variants.some(variant => variant.status !== false);
}

function getDisplayPrice(product: Product): number {
  const mainVariant = product.variants[0];
  return mainVariant?.selling_price || 0;
}

type ProductInfoPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function ProductInfoPage({ params }: ProductInfoPageProps) {
  // Unwrap the params Promise using React.use()
  const { id } = use(params);
  //   const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/v1/products/${id}`);
        if (!response.ok) {
          throw new Error('Producto no encontrado');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el producto');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-[#f7f9fb]">
        <div className="flex items-center px-8 py-6 bg-white border-b border-[#e0e3e5]">
          <div className="w-10 h-10 bg-[#f2f4f6] rounded-md animate-pulse" />
          <div className="ml-4">
            <div className="h-6 w-48 bg-[#f2f4f6] rounded animate-pulse" />
            <div className="h-4 w-32 bg-[#f2f4f6] rounded mt-1 animate-pulse" />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex space-x-1.5">
            <div className="size-3 bg-[#c4c6d1] rounded-full animate-bounce" />
            <div className="size-3 bg-[#002d62] rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="size-3 bg-[#c4c6d1] rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col h-full bg-[#f7f9fb]">
        <div className="flex items-center px-8 py-6 bg-white border-b border-[#e0e3e5]">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-[#43474f] hover:text-[#002d62] transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span className="text-[13px] font-semibold">Volver al catálogo</span>
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Package className="size-16 text-[#c4c6d1] mx-auto mb-4" />
            <p className="text-[16px] font-semibold text-[#191c1e]">
              {error || 'Producto no encontrado'}
            </p>
            <p className="text-[13px] text-[#747781] mt-1">
              El producto que buscas no existe o fue eliminado
            </p>
          </div>
        </div>
      </div>
    );
  }

  const mainVariant = product.variants[0];
  const price = getDisplayPrice(product);
  const isAvailable = isProductAvailable(product);
  const statusInfo = STATUS_LABELS[product.status || 'active'] || STATUS_LABELS.active;
  const StatusIcon = statusInfo.icon;

  return (
    <div className="flex flex-col h-full bg-[#f7f9fb]">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 bg-white border-b border-[#e0e3e5]">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-[#43474f] hover:text-[#002d62] transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span className="text-[13px] font-semibold">Volver</span>
          </Link>
          <div className="h-6 w-px bg-[#e0e3e5]" />
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#00193c] tracking-tight">
              {product.name}
            </h1>
            <p className="text-[13px] font-sans text-[#747781] mt-0.5">
              ID: #{product.id} • SKU: {mainVariant?.sku || product.slug}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/products/edit/${product.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#c4c6d1] rounded-md text-[13px] font-semibold text-[#43474f] hover:bg-[#f2f4f6] transition-colors focus:outline-none focus:ring-2 focus:ring-[#002d62]"
          >
            <Edit className="size-4" /> Editar Producto
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Product Overview Card */}
          <div className="bg-white rounded-lg border border-[#e0e3e5] overflow-hidden">
            <div className="p-6 border-b border-[#e0e3e5] bg-[#f8fafd]">
              <h2 className="text-[15px] font-bold text-[#191c1e]">Información General</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <Image
                    src={product.thumbnail}
                    alt={product.name}
                    width={120}
                    height={120}
                    className="rounded-lg object-cover border border-[#e0e3e5] bg-[#f2f4f6]"
                    unoptimized
                  />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-[18px] font-bold text-[#191c1e]">{product.name}</h3>
                    <p className="text-[13px] text-[#747781] mt-1">
                      {mainVariant?.description || 'Sin descripción'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <span className="text-[13px] font-medium text-[#43474f]">
                      Categoría: {product.category}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border ${statusInfo.color}`}
                    >
                      <StatusIcon className="size-3.5" />
                      <span className="text-[12px] font-bold uppercase tracking-wider">
                        {statusInfo.label}
                      </span>
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${
                        isAvailable
                          ? 'bg-[#e6f4ea] text-[#137333] border-[#ceead6]'
                          : 'bg-[#ffdad6] text-[#93000a] border-[#ffb4ab]'
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${isAvailable ? 'bg-[#1e8e3e]' : 'bg-[#ba1a1a]'}`}
                      />
                      <span className="text-[11px] font-bold uppercase tracking-wider">
                        {isAvailable ? 'Disponible' : 'Agotado'}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pricing Card */}
            <div className="bg-white rounded-lg border border-[#e0e3e5] overflow-hidden">
              <div className="p-4 border-b border-[#e0e3e5] bg-[#f8fafd]">
                <h3 className="text-[13px] font-bold text-[#191c1e] flex items-center gap-2">
                  <DollarSign className="size-4" /> Precios
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-[#747781]">Precio actual</span>
                  <span className="text-[18px] font-bold text-[#00193c]">
                    {formatCurrency(price)}
                  </span>
                </div>
                {mainVariant?.selling_price && (
                  <div className="flex justify-between items-center pt-3 border-t border-[#e0e3e5]">
                    <span className="text-[13px] text-[#747781]">Precio de venta</span>
                    <span className="text-[14px] font-semibold text-[#191c1e]">
                      {formatCurrency(mainVariant.selling_price)}
                    </span>
                  </div>
                )}
                {mainVariant?.tax_rate !== undefined && mainVariant.tax_rate > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-[#747781]">Tasa de impuesto</span>
                    <span className="text-[13px] font-medium text-[#43474f]">
                      {mainVariant.tax_rate * 100}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-lg border border-[#e0e3e5] overflow-hidden">
              <div className="p-4 border-b border-[#e0e3e5] bg-[#f8fafd]">
                <h3 className="text-[13px] font-bold text-[#191c1e] flex items-center gap-2">
                  <Box className="size-4" /> Estado del Producto
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-[#747781]">Tipo de producto</span>
                  <span className="text-[13px] font-medium text-[#43474f] capitalize">
                    {product.product_type || 'Normal'}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-[#e0e3e5]">
                  <span className="text-[13px] text-[#747781]">Variantes</span>
                  <span className="text-[13px] font-medium text-[#43474f]">
                    {product.variants.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-[#747781]">Tags</span>
                  <span className="text-[13px] font-medium text-[#43474f]">
                    {product.tags?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Variants Card */}
          {product.variants.length > 0 && (
            <div className="bg-white rounded-lg border border-[#e0e3e5] overflow-hidden">
              <div className="p-4 border-b border-[#e0e3e5] bg-[#f8fafd] flex items-center justify-between">
                <h3 className="text-[13px] font-bold text-[#191c1e] flex items-center gap-2">
                  <Grid className="size-4" /> Variantes
                </h3>
                <span className="text-[11px] font-medium text-[#747781] bg-white px-2 py-1 rounded border border-[#e0e3e5]">
                  {product.variants.length} variante{product.variants.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#f8fafd] border-b border-[#e0e3e5]">
                    <tr>
                      <th className="px-4 py-3 text-[11px] font-bold text-[#747781] uppercase tracking-wider">
                        SKU
                      </th>
                      <th className="px-4 py-3 text-[11px] font-bold text-[#747781] uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-4 py-3 text-[11px] font-bold text-[#747781] uppercase tracking-wider text-right">
                        Precio
                      </th>
                      <th className="px-4 py-3 text-[11px] font-bold text-[#747781] uppercase tracking-wider text-right">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.variants.map((variant, index) => (
                      <tr
                        key={variant.id || index}
                        className="border-b border-[#e0e3e5] last:border-0 hover:bg-[#f8fafd] transition-colors"
                      >
                        <td className="px-4 py-3 text-[13px] font-mono text-[#43474f]">
                          {variant.sku}
                        </td>
                        <td className="px-4 py-3 text-[13px] text-[#191c1e]">
                          {variant.name || `Variante ${variant.variantnumber || index + 1}`}
                        </td>
                        <td className="px-4 py-3 text-[13px] font-semibold text-[#191c1e] text-right">
                          {variant.selling_price
                            ? formatCurrency(variant.selling_price)
                            : formatCurrency(price)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
                              variant.status !== false
                                ? 'bg-[#e6f4ea] text-[#137333] border-[#ceead6]'
                                : 'bg-[#ffdad6] text-[#93000a] border-[#ffb4ab]'
                            }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${variant.status !== false ? 'bg-[#1e8e3e]' : 'bg-[#ba1a1a]'}`}
                            />
                            <span className="text-[11px] font-bold">
                              {variant.status !== false ? 'Activo' : 'Inactivo'}
                            </span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Metadata Card */}
          <div className="bg-white rounded-lg border border-[#e0e3e5] overflow-hidden">
            <div className="p-4 border-b border-[#e0e3e5] bg-[#f8fafd]">
              <h3 className="text-[13px] font-bold text-[#191c1e] flex items-center gap-2">
                <Info className="size-4" /> Metadatos
              </h3>
            </div>
            <div className="p-4 grid grid-cols-2 gap-x-8 gap-y-3">
              <div>
                <span className="text-[12px] text-[#747781] block">ID del producto</span>
                <span className="text-[13px] font-mono text-[#191c1e] font-semibold">
                  #{product.id}
                </span>
              </div>
              <div>
                <span className="text-[12px] text-[#747781] block">Slug</span>
                <span className="text-[13px] font-mono text-[#43474f]">{product.slug}</span>
              </div>
              <div>
                <span className="text-[12px] text-[#747781] block">Fecha de creación</span>
                <span className="text-[13px] text-[#191c1e]">
                  {product.created_at
                    ? new Date(product.created_at).toLocaleDateString('es-DO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'No disponible'}
                </span>
              </div>
              <div>
                <span className="text-[12px] text-[#747781] block">Última actualización</span>
                <span className="text-[13px] text-[#191c1e]">
                  {product.updated_at
                    ? new Date(product.updated_at).toLocaleDateString('es-DO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'No disponible'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
