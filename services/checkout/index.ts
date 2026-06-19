import type { User } from "@/types/user";
import type { CartItem } from "@/types/cart/CartItem";
import { Product } from "@/types/products";

type BillingContactInfo = {
  firstname: string;
  lastname: string;
  email: string;
  phone_number: string;
};

type BillingAddress = {
  street: string; // e.g., "123 Main Street"
  apartment?: string; // e.g., "Apt 4B", "Suite 200"
  city: string; // ciudad o municipio
  state: string; // PROVINCIA
  postal_code: string;
  country: "DO";
};

type CardInfo = {
  card_number: string;
  expiry_month: number;
  expiry_year: number;
  cvv: string;
};

type OrderItem = {
  product: Product;
  quantity: number;
};

type CheckoutFormData = {
  billing_contact: BillingContactInfo;
  billing_address: BillingAddress;
  cardInformation: CardInfo;
  PickUpTime: Date;
  items: OrderItem[];
};

type CheckoutResponseData = {
  cart: {
    id: number;
    status: boolean;
    items: CartItem[];
  };
  user: User;
};

type CheckoutInfoResponse = {
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

  async getCheckoutInfo(): Promise<CheckoutInfoResponse> {
    try {
      const response = await fetch(`${this.baseurl}/api/v1/checkout/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: CheckoutInfoResponse = await response.json();
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
