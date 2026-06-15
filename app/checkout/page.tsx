"use client";

import { useState } from "react";
import Image from "next/image";

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pickupTime: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const products = [
    {
      id: 1,
      name: "Burger",
      price: "$8.99",
      image: "https://placehold.co/100x100",
    },
    {
      id: 2,
      name: "Fries",
      price: "$3.99",
      image: "https://placehold.co/100x100",
    },
    {
      id: 3,
      name: "Drink",
      price: "$2.99",
      image: "https://placehold.co/100x100",
    },
    {
      id: 4,
      name: "Pizza Slice",
      price: "$4.99",
      image: "https://placehold.co/100x100",
    },
    {
      id: 5,
      name: "Chicken Sandwich",
      price: "$7.99",
      image: "https://placehold.co/100x100",
    },
    {
      id: 6,
      name: "Onion Rings",
      price: "$3.49",
      image: "https://placehold.co/100x100",
    },
    {
      id: 7,
      name: "Ice Cream",
      price: "$2.49",
      image: "https://placehold.co/100x100",
    },
    {
      id: 8,
      name: "Milkshake",
      price: "$4.49",
      image: "https://placehold.co/100x100",
    },
    {
      id: 9,
      name: "Hot Dog",
      price: "$5.99",
      image: "https://placehold.co/100x100",
    },
    {
      id: 10,
      name: "Nachos",
      price: "$6.49",
      image: "https://placehold.co/100x100",
    },
  ];

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function showOrderSummary(data) {
    alert(`
CHECKOUT INFORMATION

Customer
------------------------
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}

Pickup
------------------------
Time: ${data.pickupTime}

Payment
------------------------
Card Number: ${data.cardNumber}
Expiry Date: ${data.expiryDate}
CVV: ${data.cvv}

Products
------------------------
${products.map((product) => `${product.name} - ${product.price}`).join("\n")}

Total
------------------------
$50.90
    `);
  }

  function handleSubmit(event) {
    event.preventDefault();
    showOrderSummary(formData);
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

          <br />
          <br />

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

          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
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

        <aside
          style={{
            width: "350px",
            border: "1px solid black",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h2>Products</h2>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              paddingRight: "5px",
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  display: "flex",
                  gap: "10px",
                  border: "1px solid black",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={80}
                  height={80}
                />

                <div>
                  <strong>{product.name}</strong>
                  <br />
                  {product.price}
                </div>
              </div>
            ))}
          </div>

          <hr />

          <p>
            <strong>Total:</strong> $50.90
          </p>
        </aside>
      </div>
    </main>
  );
}
