"use client";

import { useState } from "react";
import Image from "next/image";
import { useCheckoutCart } from "@/components/checkout-with-cart";
import { type CheckoutFormData } from "@/types/checkout/CheckoutFormData";
import { type PaymentDetailsProps } from "@/props/checkout/PaymentDetailsProps";
import type { CustomerCheckoutInformationProps } from "@/props/checkout/CustomerCheckoutInformationProps";
import type { CheckoutFormProps } from "@/props/checkout/CheckoutFormProps";
import type { ProductsSidebarProps } from "@/props/checkout/ProductsSidebarProps";
import type {ProductItemProps} from "@/props/checkout/ProductItemProps"

function ProductItem({ item }: ProductItemProps) {
  const imageUrl = item.image || "https://placehold.co/100x100";

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        border: "1px solid black",
        padding: "10px",
        marginBottom: "10px",
      }}
    >
      <Image
        src={imageUrl}
        alt={item.name}
        width={80}
        height={80}
        style={{ objectFit: "cover" }}
      />
      <div>
        <strong>{item.name}</strong>
        <br />
        Quantity: {item.quantity}
        <br />${(item.price * item.quantity).toFixed(2)}
      </div>
    </div>
  );
}

function ProductsSidebar({ items, total }: ProductsSidebarProps) {
  if (items.length === 0) {
    return (
      <aside
        style={{
          width: "350px",
          border: "1px solid black",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>Your cart is empty</p>
      </aside>
    );
  }

  return (
    <aside
      style={{
        width: "350px",
        border: "1px solid black",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2>Products ({items.length})</h2>
      <div style={{ flex: 1, overflowY: "auto", paddingRight: "5px" }}>
        {items.map((item) => (
          <ProductItem key={item.id} item={item} />
        ))}
      </div>
      <hr />
      <p>
        <strong>Total:</strong> ${total.toFixed(2)}
      </p>
    </aside>
  );
}

function PaymentDetails({ formData, handleChange }: PaymentDetailsProps) {
  return (
    <>
      <h3>Payment Details</h3>

      <label>Card Number</label>
      <br />
      <input
        type="text"
        name="cardNumber"
        value={formData.cardNumber}
        onChange={handleChange}
        placeholder="1234 5678 9012 3456"
        required
        style={{
          width: "100%",
          border: "1px solid black",
          boxSizing: "border-box",
        }}
      />

      <br />
      <br />

      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ flex: 1 }}>
          <label>Expiry Date</label>
          <br />
          <input
            type="month"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              border: "1px solid black",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ width: "120px" }}>
          <label>CVV</label>
          <br />
          <input
            type="password"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              border: "1px solid black",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>
    </>
  );
}

function CustomerInformation({
  formData,
  handleChange,
}: CustomerCheckoutInformationProps) {
  return (
    <>
      <label>Name</label>
      <br />
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        style={{
          width: "100%",
          border: "1px solid black",
          boxSizing: "border-box",
        }}
      />

      <br />
      <br />

      <label>Email</label>
      <br />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        style={{
          width: "100%",
          border: "1px solid black",
          boxSizing: "border-box",
        }}
      />

      <br />
      <br />

      <label>Phone</label>
      <br />
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        required
        style={{
          width: "100%",
          border: "1px solid black",
          boxSizing: "border-box",
        }}
      />

      <br />
      <br />

      <label>Pick Up Time</label>
      <br />
      <input
        type="time"
        name="pickupTime"
        value={formData.pickupTime}
        onChange={handleChange}
        required
        style={{
          width: "100%",
          border: "1px solid black",
          boxSizing: "border-box",
        }}
      />
    </>
  );
}

function CheckoutForm({
  formData,
  handleChange,
  handleSubmit,
}: CheckoutFormProps) {
  return (
    <form
      onSubmit={handleSubmit}
      style={{
        flex: 1,
        border: "1px solid black",
        padding: "20px",
        overflowY: "auto",
      }}
    >
      <h2>Checkout</h2>

      <CustomerInformation formData={formData} handleChange={handleChange} />

      <PaymentDetails formData={formData} handleChange={handleChange} />

      <br />

      <button
        type="submit"
        style={{
          width: "100%",
          border: "1px solid black",
          padding: "12px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Complete Checkout
      </button>
    </form>
  );
}

// ========== MAIN PAGE ==========

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

        <ProductsSidebar items={cartItems} total={total} />
      </div>
    </main>
  );
}
