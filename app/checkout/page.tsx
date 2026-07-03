'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckoutService,
  type CheckoutFormData,
  type CheckoutPostResponse,
} from '@/services/checkout';
import type { Product } from '@/types/products';

// --- Service instance --------------------------------------------------------

const checkoutService = new CheckoutService();

// --- Local types -------------------------------------------------------------

type TimeSlot = string;

type AvailableDate = {
  date: string;
  slots: TimeSlot[];
};

/**
 * The GET /api/v1/checkout/ response returns more user fields than the shared
 * User type declares (phone_number, matricula). We use this local type to
 * safely access those fields without modifying the shared type.
 */
type ApiUser = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone_number: string;
  matricula: string;
  profilepicture: string;
  permissions: string[];
};

/**
 * Cart item as returned by the API — product data is nested under `product`.
 * This differs from the CartItem shared type which is flatter.
 */
type ApiCartItem = {
  id: number;
  product: Product;
  quantity: number;
};

/** Flat representation used inside this component for convenience. */
type CartLine = {
  cartItemId: number;
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
};

/** All controlled form fields in one place. */
interface CheckoutFormState {
  // Contact
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Billing address
  street: string;
  apartment: string;
  city: string;
  state: string;
  postalCode: string;
  // Payment card (display-formatted values)
  cardNumber: string; // "1234 5678 9012 3456"
  expiry: string; // "MM / YY"
  cvv: string;
  // Pickup scheduling
  pickupDate: string;
  pickupSlot: string;
  // UX
  agreeToTerms: boolean;
}

const EMPTY_FORM: CheckoutFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  street: '',
  apartment: '',
  city: '',
  state: '',
  postalCode: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
  pickupDate: '',
  pickupSlot: '',
  agreeToTerms: false,
};

// --- Formatting helpers -------------------------------------------------------

/** "1234567890123456" → "1234 5678 9012 3456" */
function formatCardNumber(raw: string): string {
  return raw
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();
}

/** "0126" → "01 / 26" */
function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits;
}

/** "01 / 26" → { month: 1, year: 2026 } */
function parseExpiry(formatted: string): { month: number; year: number } {
  const digits = formatted.replace(/\D/g, '');
  return {
    month: parseInt(digits.slice(0, 2), 10),
    year: 2000 + parseInt(digits.slice(2, 4), 10),
  };
}

// --- Component ----------------------------------------------------------------

export default function CheckoutPage() {
  const router = useRouter();

  const [form, setForm] = useState<CheckoutFormState>(EMPTY_FORM);
  const [cartItems, setCartItems] = useState<CartLine[]>([]);
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // -- Data fetching ----------------------------------------------------------

  useEffect(() => {
    async function loadCheckoutData() {
      try {
        const [checkoutInfo, slotsResponse] = await Promise.all([
          checkoutService.getCheckoutInfo(),
          checkoutService.getAvailableSlots(),
        ]);

        if (checkoutInfo.status === 'ok') {
          prefillUserContact(checkoutInfo.data.user as unknown as ApiUser);
          loadCartItems(
            checkoutInfo.data.cart as unknown as {
              id: number;
              status: boolean;
              items: ApiCartItem[];
            }
          );
        }

        loadAvailableSlots(slotsResponse.availableDates);
      } catch (error) {
        let message = 'Something went wrong';

        if (error instanceof Error) {
          message = error.message;
        }

        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    }

    loadCheckoutData();
  }, []);

  function prefillUserContact(user: ApiUser) {
    setForm(prev => ({
      ...prev,
      firstName: user.firstname ?? '',
      lastName: user.lastname ?? '',
      email: user.email ?? '',
      phone: user.phone_number ?? '',
    }));
  }

  function loadCartItems(cart: { items: ApiCartItem[] }) {
    setCartItems(
      cart.items.map(item => ({
        cartItemId: item.id,
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.selling_price,
      }))
    );
  }

  function loadAvailableSlots(dates: AvailableDate[]) {
    setAvailableDates(dates);

    // Pre-select the first available date and its first slot
    if (dates.length > 0) {
      const firstDate = dates[0];
      setForm(prev => ({
        ...prev,
        pickupDate: firstDate.date,
        pickupSlot: firstDate.slots[0] ?? '',
      }));
    }
  }

  // -- Derived state ----------------------------------------------------------

  const selectedDate = availableDates.find(d => d.date === form.pickupDate);

  const orderTotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  // -- Event handlers ---------------------------------------------------------

  function handleFieldChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setForm(prev => ({ ...prev, [name]: newValue }));

    // When the date changes, reset the slot to the first available for that day
    if (name === 'pickupDate') {
      const date = availableDates.find(d => d.date === value);
      setForm(prev => ({
        ...prev,
        pickupDate: value,
        pickupSlot: date?.slots[0] ?? '',
      }));
    }
  }

  function handleCardNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({
      ...prev,
      cardNumber: formatCardNumber(e.target.value),
    }));
  }

  function handleExpiryChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, expiry: formatExpiry(e.target.value) }));
  }

  // -- Form submission --------------------------------------------------------

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = buildCheckoutPayload();
    let result: CheckoutPostResponse | null = null; // ← declare outside

    try {
      result = await checkoutService.checkout(payload);

      if (result.status === 'ok' && result.data?.order.id) {
        router.push(`account/orders/${result.data.order.id}`);
      } else {
        setErrorMessage(result.error?.message ?? 'Something went wrong. Please try again.');
      }
    } catch {
      setErrorMessage(
        result?.error?.message ?? 'Something went wrong placing your order. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function buildCheckoutPayload(): CheckoutFormData {
    const { month, year } = parseExpiry(form.expiry);

    return {
      billing_contact: {
        firstname: form.firstName,
        lastname: form.lastName,
        email: form.email,
        phone_number: form.phone,
      },
      billing_address: {
        street: form.street,
        apartment: form.apartment || undefined,
        city: form.city,
        state: form.state,
        postal_code: form.postalCode,
        country: 'DO',
      },
      cardInformation: {
        card_number: form.cardNumber.replace(/\s/g, ''),
        expiry_month: month,
        expiry_year: year,
        cvv: form.cvv,
      },
      PickUpTime: new Date(`${form.pickupDate}T${form.pickupSlot}`),
      items: cartItems.map(item => ({
        productid: item.productId,
        quantity: item.quantity,
      })),
    };
  }

  // -- Render -----------------------------------------------------------------

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading checkout…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-medium mb-8">Checkout</h1>

        {errorMessage && <ErrorBanner message={errorMessage} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <ContactSection form={form} onChange={handleFieldChange} />
          <BillingAddressSection form={form} onChange={handleFieldChange} />

          {availableDates.length > 0 && (
            <PickupSection
              form={form}
              availableDates={availableDates}
              selectedDate={selectedDate}
              onChange={handleFieldChange}
            />
          )}

          <PaymentSection
            form={form}
            onCardNumberChange={handleCardNumberChange}
            onExpiryChange={handleExpiryChange}
            onChange={handleFieldChange}
          />

          {cartItems.length > 0 && <OrderSummary items={cartItems} total={orderTotal} />}

          <TermsCheckbox checked={form.agreeToTerms} onChange={handleFieldChange} />

          <SubmitButton isSubmitting={isSubmitting} />
        </form>
      </div>
    </main>
  );
}

// --- Sub-components -----------------------------------------------------------

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
      {message}
    </div>
  );
}

function ContactSection({
  form,
  onChange,
}: {
  form: CheckoutFormState;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <FormSection title="Contact">
      <div className="grid grid-cols-2 gap-4">
        <Field label="First name">
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={onChange}
            placeholder="Jane"
            required
          />
        </Field>
        <Field label="Last name">
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={onChange}
            placeholder="Smith"
            required
          />
        </Field>
      </div>
      <Field label="Email">
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          placeholder="you@example.com"
          required
        />
      </Field>
      <Field label="Phone">
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={onChange}
          placeholder="829 000-0000"
          required
        />
      </Field>
    </FormSection>
  );
}

function BillingAddressSection({
  form,
  onChange,
}: {
  form: CheckoutFormState;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
}) {
  return (
    <FormSection title="Billing address">
      <Field label="Street">
        <input
          type="text"
          name="street"
          value={form.street}
          onChange={onChange}
          placeholder="Calle Principal 123"
          required
        />
      </Field>
      <Field label="Apartment / suite (optional)">
        <input
          type="text"
          name="apartment"
          value={form.apartment}
          onChange={onChange}
          placeholder="Apto 4B"
        />
      </Field>
      <div className="grid grid-cols-3 gap-4">
        <Field label="City">
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={onChange}
            placeholder="Santiago"
            required
          />
        </Field>
        <Field label="Province">
          <input
            type="text"
            name="state"
            value={form.state}
            onChange={onChange}
            placeholder="Santiago"
            required
          />
        </Field>
        <Field label="Postal code">
          <input
            type="text"
            name="postalCode"
            value={form.postalCode}
            onChange={onChange}
            placeholder="51000"
            required
          />
        </Field>
      </div>
      <Field label="Country">
        <select name="country" disabled className="opacity-60 cursor-not-allowed">
          <option>Dominican Republic (DO)</option>
        </select>
      </Field>
    </FormSection>
  );
}

function PickupSection({
  form,
  availableDates,
  selectedDate,
  onChange,
}: {
  form: CheckoutFormState;
  availableDates: AvailableDate[];
  selectedDate: AvailableDate | undefined;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
}) {
  return (
    <FormSection title="Pickup time">
      <Field label="Date">
        <select name="pickupDate" value={form.pickupDate} onChange={onChange} required>
          {availableDates.map(d => (
            <option key={d.date} value={d.date}>
              {d.date}
            </option>
          ))}
        </select>
      </Field>
      {selectedDate && selectedDate.slots.length > 0 && (
        <Field label="Time slot">
          <select name="pickupSlot" value={form.pickupSlot} onChange={onChange} required>
            {selectedDate.slots.map(slot => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </Field>
      )}
    </FormSection>
  );
}

function PaymentSection({
  form,
  onCardNumberChange,
  onExpiryChange,
  onChange,
}: {
  form: CheckoutFormState;
  onCardNumberChange: React.ChangeEventHandler<HTMLInputElement>;
  onExpiryChange: React.ChangeEventHandler<HTMLInputElement>;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <FormSection title="Payment">
      <Field label="Card number">
        <input
          type="text"
          name="cardNumber"
          value={form.cardNumber}
          onChange={onCardNumberChange}
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          required
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Expiry">
          <input
            type="text"
            name="expiry"
            value={form.expiry}
            onChange={onExpiryChange}
            placeholder="MM / YY"
            maxLength={7}
            required
          />
        </Field>
        <Field label="CVV">
          <input
            type="text"
            name="cvv"
            value={form.cvv}
            onChange={onChange}
            placeholder="123"
            maxLength={4}
            required
          />
        </Field>
      </div>
    </FormSection>
  );
}

function OrderSummary({ items, total }: { items: CartLine[]; total: number }) {
  return (
    <section className="bg-gray-100 rounded-xl p-5 space-y-2 text-sm">
      {items.map(item => (
        <div key={item.cartItemId} className="flex justify-between text-gray-600">
          <span>
            {item.name} × {item.quantity}
          </span>
          <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
        </div>
      ))}
      <div className="flex justify-between font-medium text-base border-t border-gray-200 pt-3 mt-1">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </section>
  );
}

function TermsCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        id="agreeToTerms"
        name="agreeToTerms"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 shrink-0"
        required
      />
      <label htmlFor="agreeToTerms" className="text-sm text-gray-500 leading-relaxed">
        I agree to the{' '}
        <a href="/terms" className="text-gray-900 underline underline-offset-2">
          terms of service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="text-gray-900 underline underline-offset-2">
          privacy policy
        </a>
        .
      </label>
    </div>
  );
}

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full py-3 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-100 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSubmitting ? 'Placing order…' : 'Place order'}
    </button>
  );
}

// --- Primitives ---------------------------------------------------------------

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">{title}</p>
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500">{label}</label>
      <div className="[&>input]:w-full [&>input]:border [&>input]:border-gray-200 [&>input]:rounded-lg [&>input]:px-3 [&>input]:py-2 [&>input]:text-sm [&>input]:outline-none [&>input]:focus:ring-2 [&>input]:focus:ring-gray-300 [&>select]:w-full [&>select]:border [&>select]:border-gray-200 [&>select]:rounded-lg [&>select]:px-3 [&>select]:py-2 [&>select]:text-sm [&>select]:outline-none [&>select]:focus:ring-2 [&>select]:focus:ring-gray-300">
        {children}
      </div>
    </div>
  );
}
