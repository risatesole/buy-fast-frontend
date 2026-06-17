import type { CheckoutFormData } from "@/types/checkout/CheckoutFormData";

export type CheckoutFormProps = {
  formData: CheckoutFormData;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};