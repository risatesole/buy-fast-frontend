import type { CustomerCheckoutInformationProps } from "@/props/checkout/CustomerCheckoutInformationProps";

export function CustomerInformation({
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

