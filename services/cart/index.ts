// warning temporary tape code
// types
import type { Product } from "@/types/products";

// delete
export type CartItem = {
  id: number;
  product: Product;
  quantity: number;
};



export function addProductToCart(
  currentCart: CartItem[],
  product: Product,
): CartItem[] {
  throw new Error("Unimplemented method.");
}

export function removeProductFromCart(
  currentCart: CartItem[],
  productId: number,
): CartItem[] {
  throw new Error("Method not implemented.");
}


export type CartResponse = {
  status: string;
  message: string;
  data: {
    item: {
      id: number;
      product_id: number;
      quantity: number;
    };
  };
};

export default class CartService {
  async addProduct(
    productId: number,
    quantity: number = 1,
  ): Promise<CartResponse> {
    const response = await fetch(`http://localhost:8000/api/v1/cart/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
        quantity,
      }),
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return response.json() as Promise<CartResponse>;
  }
}
