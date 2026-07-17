'use client';
import { useState } from 'react';

type credit_card = {
  card_number: string;
  cardholder_name: string;
  cvv: string;
  expiration_date: string;
};

type billing_address = {
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

type CheckoutData = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  credit_card: credit_card;
  billing_address: billing_address;
  shipping_address?: billing_address;
  pickuptime: string;
  items: Array<{
    product_variant_id: string;
    quantity: number;
  }>;
};

type CartItem = {
  id: string;
  productvariant: {
    id: string;
    name: string;
    description: string;
    selling_price: number;
  };
  quantity: number;
};

type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  matricula: string;
  phone_number: string;
  permissions: string[];
  profilepicture: string;
};

type pickup_time_slot = {
  date: string;
  time: string;
  available: boolean;
};

type CheckoutPageData = {
  status: string;
  data: {
    cart: {
      items: CartItem[];
    };
    user: User;
    pickup_times: pickup_time_slot[];
  };
};

class CheckoutService {
  constructor(public baseurl: string) {}

  async getCheckoutData(): Promise<CheckoutPageData> {
    try {
      const response = await fetch(`${this.baseurl}/api/v1/checkout`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data: CheckoutPageData = await response.json();
        console.log(`✓ Checkout data loaded for ${data.data.user.firstname}`);
        return data;
      } else {
        console.error('Failed to fetch checkout data:', response.statusText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Checkout data error:', error);
      throw error;
    }
  }

  async executeCheckout(data: CheckoutData): Promise<void> {
    try {
      const response = await fetch(`${this.baseurl}/api/v1/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log(`✓ Checkout successful for ${data.firstname} ${data.lastname}`);
        console.log(`Pickup time: ${data.pickuptime}`);
      } else {
        console.error('Checkout failed:', response.statusText);
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  }
}

export default function CheckoutPage() {
  const [text, setText] = useState('');

  return (
    <>
      <div>
        <p>Welcome to checkout page</p>

        <div>
          <input
            type="text"
            placeholder="Enter something..."
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <p>You typed: {text}</p>
        </div>
      </div>
    </>
  );
}
