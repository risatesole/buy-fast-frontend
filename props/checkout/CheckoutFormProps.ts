import type { CheckoutFormData } from "@/app/checkout/types/CheckoutFormData";

export type CheckoutFormProps = {
  formData: CheckoutFormData;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};