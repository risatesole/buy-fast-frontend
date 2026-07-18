'use client';
import { useState, useEffect } from 'react';

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
      const response = await fetch(`/api/v1/checkout`, {
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
      const response = await fetch(`/api/v1/checkout`, {
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
        throw new Error(`Checkout failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      throw error;
    }
  }
}

type CheckoutStep = 'contact' | 'shipping' | 'payment' | 'review';

type FormErrors = {
  [key: string]: string;
};

export default function CheckoutPage() {
  const [step, setStep] = useState<CheckoutStep>('contact');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [checkoutData, setCheckoutData] = useState<CheckoutPageData | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<CheckoutData>({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    credit_card: {
      card_number: '',
      cardholder_name: '',
      cvv: '',
      expiration_date: '',
    },
    billing_address: {
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
    },
    shipping_address: {
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
    },
    pickuptime: '',
    items: [],
  });

  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);

  // Fetch checkout data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const service = new CheckoutService(process.env.NEXT_PUBLIC_API_URL || '');
        const data = await service.getCheckoutData();
        setCheckoutData(data);

        // Pre-fill user data
        setFormData(prev => ({
          ...prev,
          firstname: data.data.user.firstname,
          lastname: data.data.user.lastname,
          email: data.data.user.email,
          phone: data.data.user.phone_number,
          items: data.data.cart.items.map(item => ({
            product_variant_id: item.productvariant.id,
            quantity: item.quantity,
          })),
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load checkout data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateCardNumber = (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/\s/g, '');
    return cleaned.length >= 13 && cleaned.length <= 19 && /^\d+$/.test(cleaned);
  };

  const validateContactStep = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.firstname.trim()) errors.firstname = 'First name is required';
    if (!formData.lastname.trim()) errors.lastname = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!validateEmail(formData.email)) errors.email = 'Invalid email format';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    else if (!validatePhone(formData.phone)) errors.phone = 'Invalid phone format';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateAddressStep = (): boolean => {
    const errors: FormErrors = {};

    const validateAddress = (address: billing_address, prefix: string) => {
      if (!address.street.trim()) errors[`${prefix}_street`] = 'Street is required';
      if (!address.city.trim()) errors[`${prefix}_city`] = 'City is required';
      if (!address.state.trim()) errors[`${prefix}_state`] = 'State is required';
      if (!address.postal_code.trim()) errors[`${prefix}_postal_code`] = 'Postal code is required';
      if (!address.country.trim()) errors[`${prefix}_country`] = 'Country is required';
    };

    validateAddress(formData.billing_address, 'billing');
    if (!useShippingAsBilling) {
      validateAddress(formData.shipping_address!, 'shipping');
    }
    if (!formData.pickuptime) {
      errors.pickuptime = 'Please select a pickup time';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePaymentStep = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.credit_card.cardholder_name.trim()) {
      errors.cardholder_name = 'Cardholder name is required';
    }
    if (!formData.credit_card.card_number.trim()) {
      errors.card_number = 'Card number is required';
    } else if (!validateCardNumber(formData.credit_card.card_number)) {
      errors.card_number = 'Invalid card number';
    }
    if (!formData.credit_card.expiration_date.trim()) {
      errors.expiration_date = 'Expiration date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.credit_card.expiration_date)) {
      errors.expiration_date = 'Use MM/YY format';
    }
    if (!formData.credit_card.cvv.trim()) {
      errors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(formData.credit_card.cvv)) {
      errors.cvv = 'CVV must be 3-4 digits';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setError(null);

    if (name.startsWith('card_')) {
      setFormData(prev => ({
        ...prev,
        credit_card: {
          ...prev.credit_card,
          [name.replace('card_', '')]: value,
        },
      }));
    } else if (name.startsWith('billing_')) {
      setFormData(prev => ({
        ...prev,
        billing_address: {
          ...prev.billing_address,
          [name.replace('billing_', '')]: value,
        },
      }));
    } else if (name.startsWith('shipping_')) {
      setFormData(prev => ({
        ...prev,
        shipping_address: {
          ...prev.shipping_address!,
          [name.replace('shipping_', '')]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleNextStep = () => {
    let isValid = false;

    if (step === 'contact') {
      isValid = validateContactStep();
      if (isValid) setStep('shipping');
    } else if (step === 'shipping') {
      isValid = validateAddressStep();
      if (isValid) setStep('payment');
    } else if (step === 'payment') {
      isValid = validatePaymentStep();
      if (isValid) setStep('review');
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const service = new CheckoutService(process.env.NEXT_PUBLIC_API_URL || '');

      const submitData: CheckoutData = {
        ...formData,
        shipping_address: useShippingAsBilling ? undefined : formData.shipping_address,
      };

      await service.executeCheckout(submitData);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateTotal = (): number => {
    return (
      checkoutData?.data.cart.items.reduce(
        (sum, item) => sum + item.productvariant.selling_price * item.quantity,
        0
      ) || 0
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"></div>
          </div>
          <p className="text-slate-600 font-medium">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100">
            <svg
              className="h-8 w-8 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Order Confirmed</h1>
          <p className="text-slate-600 mb-6">
            Thank you! Your order has been placed successfully. You'll receive a confirmation email
            shortly.
          </p>
          <button
            onClick={() => (window.location.href = '/')}
            className="w-full bg-slate-900 text-white font-medium py-3 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Checkout</h1>
          <p className="text-slate-600">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              {/* Step Indicators */}
              <div className="mb-8 flex items-center justify-between">
                {(['contact', 'shipping', 'payment', 'review'] as const).map((s, idx) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                        s === step
                          ? 'bg-slate-900 text-white'
                          : ['contact', 'shipping', 'payment', 'review'].indexOf(s) <
                              ['contact', 'shipping', 'payment', 'review'].indexOf(step)
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {['contact', 'shipping', 'payment', 'review'].indexOf(s) <
                      ['contact', 'shipping', 'payment', 'review'].indexOf(step) ? (
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        idx + 1
                      )}
                    </div>
                    {idx < 3 && <div className="flex-1 h-1 mx-2 bg-slate-200"></div>}
                  </div>
                ))}
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}

              {/* Contact Step */}
              {step === 'contact' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900">Contact Information</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors ${
                          formErrors.firstname ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="John"
                      />
                      {formErrors.firstname && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.firstname}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors ${
                          formErrors.lastname ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="Doe"
                      />
                      {formErrors.lastname && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.lastname}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors ${
                        formErrors.email ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="john@example.com"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors ${
                        formErrors.phone ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Shipping Step */}
              {step === 'shipping' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900">Shipping & Pickup</h2>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Select Pickup Time
                    </label>
                    <select
                      name="pickuptime"
                      value={formData.pickuptime}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors ${
                        formErrors.pickuptime ? 'border-red-500' : 'border-slate-300'
                      }`}
                    >
                      <option value="">Choose a pickup time...</option>
                      {checkoutData?.data.pickup_times.map(slot => (
                        <option
                          key={`${slot.date}-${slot.time}`}
                          value={`${slot.date} ${slot.time}`}
                          disabled={!slot.available}
                        >
                          {slot.date} at {slot.time} {!slot.available && '(Unavailable)'}
                        </option>
                      ))}
                    </select>
                    {formErrors.pickuptime && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.pickuptime}</p>
                    )}
                  </div>

                  {/* Billing Address */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Billing Address</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Street
                        </label>
                        <input
                          type="text"
                          name="billing_street"
                          value={formData.billing_address.street}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors ${
                            formErrors.billing_street ? 'border-red-500' : 'border-slate-300'
                          }`}
                          placeholder="123 Main St"
                        />
                        {formErrors.billing_street && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.billing_street}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            name="billing_city"
                            value={formData.billing_address.city}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors ${
                              formErrors.billing_city ? 'border-red-500' : 'border-slate-300'
                            }`}
                            placeholder="New York"
                          />
                          {formErrors.billing_city && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.billing_city}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            State
                          </label>
                          <input
                            type="text"
                            name="billing_state"
                            value={formData.billing_address.state}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors ${
                              formErrors.billing_state ? 'border-red-500' : 'border-slate-300'
                            }`}
                            placeholder="NY"
                          />
                          {formErrors.billing_state && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.billing_state}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            name="billing_postal_code"
                            value={formData.billing_address.postal_code}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors ${
                              formErrors.billing_postal_code ? 'border-red-500' : 'border-slate-300'
                            }`}
                            placeholder="10001"
                          />
                          {formErrors.billing_postal_code && (
                            <p className="text-red-500 text-sm mt-1">
                              {formErrors.billing_postal_code}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Country
                          </label>
                          <input
                            type="text"
                            name="billing_country"
                            value={formData.billing_address.country}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors ${
                              formErrors.billing_country ? 'border-red-500' : 'border-slate-300'
                            }`}
                            placeholder="USA"
                          />
                          {formErrors.billing_country && (
                            <p className="text-red-500 text-sm mt-1">
                              {formErrors.billing_country}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address Checkbox */}
                  <div className="border-t pt-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={useShippingAsBilling}
                        onChange={e => setUseShippingAsBilling(e.target.checked)}
                        className="h-4 w-4 text-slate-900 rounded"
                      />
                      <span className="ml-3 text-sm font-medium text-slate-700">
                        Use billing address for shipping
                      </span>
                    </label>
                  </div>

                  {/* Shipping Address */}
                  {!useShippingAsBilling && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">
                        Shipping Address
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Street
                          </label>
                          <input
                            type="text"
                            name="shipping_street"
                            value={formData.shipping_address?.street || ''}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors ${
                              formErrors.shipping_street ? 'border-red-500' : 'border-slate-300'
                            }`}
                            placeholder="123 Main St"
                          />
                          {formErrors.shipping_street && (
                            <p className="text-red-500 text-sm mt-1">
                              {formErrors.shipping_street}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              City
                            </label>
                            <input
                              type="text"
                              name="shipping_city"
                              value={formData.shipping_address?.city || ''}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors ${
                                formErrors.shipping_city ? 'border-red-500' : 'border-slate-300'
                              }`}
                              placeholder="New York"
                            />
                            {formErrors.shipping_city && (
                              <p className="text-red-500 text-sm mt-1">
                                {formErrors.shipping_city}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              State
                            </label>
                            <input
                              type="text"
                              name="shipping_state"
                              value={formData.shipping_address?.state || ''}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors ${
                                formErrors.shipping_state ? 'border-red-500' : 'border-slate-300'
                              }`}
                              placeholder="NY"
                            />
                            {formErrors.shipping_state && (
                              <p className="text-red-500 text-sm mt-1">
                                {formErrors.shipping_state}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Postal Code
                            </label>
                            <input
                              type="text"
                              name="shipping_postal_code"
                              value={formData.shipping_address?.postal_code || ''}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors ${
                                formErrors.shipping_postal_code
                                  ? 'border-red-500'
                                  : 'border-slate-300'
                              }`}
                              placeholder="10001"
                            />
                            {formErrors.shipping_postal_code && (
                              <p className="text-red-500 text-sm mt-1">
                                {formErrors.shipping_postal_code}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Country
                            </label>
                            <input
                              type="text"
                              name="shipping_country"
                              value={formData.shipping_address?.country || ''}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors ${
                                formErrors.shipping_country ? 'border-red-500' : 'border-slate-300'
                              }`}
                              placeholder="USA"
                            />
                            {formErrors.shipping_country && (
                              <p className="text-red-500 text-sm mt-1">
                                {formErrors.shipping_country}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Payment Step */}
              {step === 'payment' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900">Payment Method</h2>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      name="card_cardholder_name"
                      value={formData.credit_card.cardholder_name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors ${
                        formErrors.cardholder_name ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="John Doe"
                    />
                    {formErrors.cardholder_name && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.cardholder_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="card_card_number"
                      value={formData.credit_card.card_number}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors ${
                        formErrors.card_number ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                    {formErrors.card_number && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.card_number}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Expiration (MM/YY)
                      </label>
                      <input
                        type="text"
                        name="card_expiration_date"
                        value={formData.credit_card.expiration_date}
                        onChange={handleInputChange}
                        placeholder="12/25"
                        maxLength={5}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors ${
                          formErrors.expiration_date ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                      {formErrors.expiration_date && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.expiration_date}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">CVV</label>
                      <input
                        type="text"
                        name="card_cvv"
                        value={formData.credit_card.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength={4}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors ${
                          formErrors.cvv ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                      {formErrors.cvv && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.cvv}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Review Step */}
              {step === 'review' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900">Review Order</h2>

                  <div className="border-t border-b py-6 space-y-4">
                    <div>
                      <p className="text-sm text-slate-600">Contact</p>
                      <p className="font-semibold text-slate-900">
                        {formData.firstname} {formData.lastname}
                      </p>
                      <p className="text-slate-600">{formData.email}</p>
                      <p className="text-slate-600">{formData.phone}</p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-600">Pickup Time</p>
                      <p className="font-semibold text-slate-900">{formData.pickuptime}</p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-600">Billing Address</p>
                      <p className="font-semibold text-slate-900">
                        {formData.billing_address.street}
                      </p>
                      <p className="text-slate-600">
                        {formData.billing_address.city}, {formData.billing_address.state}{' '}
                        {formData.billing_address.postal_code}
                      </p>
                      <p className="text-slate-600">{formData.billing_address.country}</p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-600">Card</p>
                      <p className="font-semibold text-slate-900">
                        •••• {formData.credit_card.card_number.slice(-4)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => {
                    const steps: CheckoutStep[] = ['contact', 'shipping', 'payment', 'review'];
                    const currentIdx = steps.indexOf(step);
                    if (currentIdx > 0) setStep(steps[currentIdx - 1]);
                  }}
                  disabled={step === 'contact'}
                  className="px-6 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
                </button>

                {step !== 'review' ? (
                  <button
                    onClick={handleNextStep}
                    className="px-8 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-8 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Processing...' : 'Place Order'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Order Summary */}
          {checkoutData && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>

                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {checkoutData.data.cart.items.map(item => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{item.productvariant.name}</p>
                        <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-slate-900 ml-4 whitespace-nowrap">
                        ${(item.productvariant.selling_price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-6 space-y-3">
                  <div className="flex justify-between">
                    <p className="text-slate-600">Subtotal</p>
                    <p className="font-semibold text-slate-900">${calculateTotal().toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-slate-600">Shipping</p>
                    <p className="font-semibold text-slate-900">Free</p>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <p className="font-bold text-slate-900">Total</p>
                    <p className="text-lg font-bold text-slate-900">
                      ${calculateTotal().toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
