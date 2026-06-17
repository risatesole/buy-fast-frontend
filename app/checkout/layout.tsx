import type { NavbarCartItem } from "@/components/navbar";
import { cookies } from "next/headers";
import { CheckoutWithCart } from "@/components/checkout-with-cart";
import CartService from "@/services/cart";

async function getCartItems(): Promise<NavbarCartItem[]> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const cartService = new CartService();
    const { data } = await cartService.getCart(cookieHeader);

    return data.items.map((item) => ({
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
