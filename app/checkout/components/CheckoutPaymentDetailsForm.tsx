import { type PaymentDetailsProps } from "@/props/checkout/PaymentDetailsProps";

export function CheckoutPaymentDetailsForm({ formData, handleChange }: PaymentDetailsProps) {
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
