import type { CartItem } from "@/components/navbar";
import type { GetCartResponse } from "@/types/cart/GetCartResponse";
import { cookies } from "next/headers";
import { CheckoutWithCart } from "@/components/checkout-with-cart";

async function getCartItems(): Promise<CartItem[]> {
  try {
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) return [];
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const res = await fetch(`${backendUrl}/api/v1/cart/`, {
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json: GetCartResponse = await res.json();
    return json.data.items.map((item) => ({
      id: item.id,
      name: item.product.name,
      price: item.product.selling_price,
      quantity: item.quantity,
      image: item.product.images.find((img) => img.type === "HERO")?.url,
    }));
  } catch {
    return [];
  }
}

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cartItems = await getCartItems();
  return <CheckoutWithCart cartItems={cartItems}>{children}</CheckoutWithCart>;
}
