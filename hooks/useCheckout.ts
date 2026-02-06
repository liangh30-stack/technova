import { useState } from 'react';
import { Order, Product, CustomerOrder } from '../types';
import { saveCustomerOrder, clearFirestoreCart } from '../services/customerService';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface UseCheckoutOptions<TCartItem extends { price: number; quantity: number }> {
  cart: TCartItem[];
  cartTotal: number;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  setCart: (items: TCartItem[]) => void;
  customerUid?: string | null;
}

export const useCheckout = <TCartItem extends { price: number; quantity: number }>({
  cart,
  cartTotal,
  orders,
  setOrders,
  setCart,
  customerUid,
}: UseCheckoutOptions<TCartItem>) => {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'payment' | 'success'>('cart');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);

  const validateCustomerInfo = () => {
    const errors: Record<string, string> = {};
    if (!customerInfo.name.trim()) errors.name = 'El nombre es requerido';
    if (!customerInfo.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      errors.email = 'Email inválido';
    }
    if (!customerInfo.phone.trim()) errors.phone = 'El teléfono es requerido';
    if (!customerInfo.address.trim()) errors.address = 'La dirección es requerida';
    if (!acceptTerms) errors.terms = 'Debe aceptar los términos y condiciones';
    if (!acceptPrivacy) errors.privacy = 'Debe aceptar la política de privacidad';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToPayment = () => {
    if (validateCustomerInfo()) {
      setCheckoutStep('payment');
    }
  };

  const handlePlaceOrder = (paymentMethod: 'Stripe' | 'PayPal') => {
    const expandedItems: Product[] = cart.flatMap((item) =>
      Array(item.quantity)
        .fill(null)
        .map(
          () =>
            ({
              ...item,
              quantity: undefined,
            } as Product)
        )
    );

    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: orderId,
      customerName: customerInfo.name,
      email: customerInfo.email,
      phone: customerInfo.phone,
      address: customerInfo.address,
      items: expandedItems,
      total: cartTotal,
      status: 'Pending',
      paymentMethod,
      date: new Date().toISOString(),
    };

    // Save to localStorage (existing behavior)
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);

    // Save to Firestore if customer is logged in
    if (customerUid) {
      const customerOrder: CustomerOrder = {
        ...newOrder,
        customerId: customerUid,
      };
      saveCustomerOrder(customerUid, customerOrder).catch(() => {});
      clearFirestoreCart(customerUid).catch(() => {});
    }

    setCart([] as TCartItem[]);
    setCustomerInfo({ name: '', email: '', phone: '', address: '' });
    setAcceptTerms(false);
    setAcceptPrivacy(false);
    setCheckoutStep('success');
  };

  return {
    checkoutStep,
    setCheckoutStep,
    customerInfo,
    setCustomerInfo,
    formErrors,
    acceptTerms,
    setAcceptTerms,
    acceptPrivacy,
    setAcceptPrivacy,
    handleProceedToPayment,
    handlePlaceOrder,
  };
};
