"use client";

import { useState } from "react";
import { useCheckoutCart } from "@/components/checkout-with-cart";
import { type CheckoutFormData } from "@/types/checkout/CheckoutFormData";
import { CheckoutProductsSidebar } from "./components/CheckoutProductsSidebar";
import { CheckoutForm } from "./forms/CheckoutForm";

export default function CheckoutPage() {
  const cartItems = useCheckoutCart();

  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    email: "",
    phone: "",
    pickupTime: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items before checking out.");
      return;
    }

    const productDetails = cartItems
      .map(
        (item) =>
          `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`,
      )
      .join("\n");

    alert(`
CHECKOUT INFORMATION

Customer
------------------------
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}

Pickup
------------------------
Time: ${formData.pickupTime}

Payment
------------------------
Card Number: ${formData.cardNumber}
Expiry Date: ${formData.expiryDate}
CVV: ${formData.cvv}

Products
------------------------
${productDetails}

Total
------------------------
$${total.toFixed(2)}
    `);
  }

  return (
    <main
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "20px",
          width: "1100px",
          maxWidth: "100%",
          height: "700px",
        }}
      >
        <CheckoutForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />

        <CheckoutProductsSidebar items={cartItems} total={total} />
      </div>
    </main>
  );
}
