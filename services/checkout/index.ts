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
type TimeSlot = string;

type AvailableDate = {
  date: string;
  slots: TimeSlot[];
};

type AvailableDatesResponse = {
  availableDates: AvailableDate[];
};

export class CheckoutService {
  private baseurl = `${process.env.NEXT_PUBLIC_API_URL}`;

  async getCheckoutInfo(): Promise<CheckoutResponse> {
    try {
      const response = await fetch(`${this.baseurl}/api/v1/checkout/`);
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

  async getAvailableSlots(): Promise<AvailableDatesResponse> {
    try {
      const response = await fetch(
        `${this.baseurl}/api/v1/checkout/timeslots/`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AvailableDatesResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching available slots:", error);
      throw error;
    }
  }
}
