import ProductService from "@/services/products/ProductService";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = new ProductService();
  const productDetails = await service.getProductDetails(id);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
      Product ID: {id}
      <p>{productDetails.name}</p>
      <p>{productDetails.description}</p>
    </div>
  );
}
