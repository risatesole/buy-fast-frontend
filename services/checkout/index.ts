import type { User } from "@/types/user";
import type { CartItem } from "@/types/cart/CartItem";

type CheckoutResponseData = {
  cart: {
    id: number;
    status: boolean;
    items: CartItem[];
  };
  user: User;
};

type CheckoutResponse = {
  status: "ok" | "error";
  data: CheckoutResponseData;
};

export class CheckoutService {
  private baseurl = `${process.env.NEXT_PUBLIC_API_URL}`;

  async getProducts(): Promise<CheckoutResponse> {
    try {
      const response = await fetch(`${this.baseurl}/api/v1/checkout/initiate`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: CheckoutResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }
}
