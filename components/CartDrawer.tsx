import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Trash2, ShoppingBag, CheckCircle2, CreditCard, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  selectedModel?: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  cart: CartItem[];
  cartTotal: number;
  cartItemCount: number;
  checkoutStep: 'cart' | 'shipping' | 'payment' | 'success';
  setCheckoutStep: (step: 'cart' | 'shipping' | 'payment' | 'success') => void;
  onClose: () => void;
  updateCartQuantity: (index: number, delta: number) => void;
  removeFromCart: (index: number) => void;
  customerInfo: CustomerInfo;
  setCustomerInfo: (info: CustomerInfo | ((prev: CustomerInfo) => CustomerInfo)) => void;
  formErrors: Record<string, string>;
  acceptTerms: boolean;
  setAcceptTerms: (v: boolean) => void;
  acceptPrivacy: boolean;
  setAcceptPrivacy: (v: boolean) => void;
  onProceedToPayment: () => void;
  onPlaceOrder: (method: 'Stripe' | 'PayPal') => void;
  customer: { displayName: string; email: string } | null;
  onSignInClick: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  cart,
  cartTotal,
  cartItemCount,
  checkoutStep,
  setCheckoutStep,
  onClose,
  updateCartQuantity,
  removeFromCart,
  customerInfo,
  setCustomerInfo,
  formErrors,
  acceptTerms,
  setAcceptTerms,
  acceptPrivacy,
  setAcceptPrivacy,
  onProceedToPayment,
  onPlaceOrder,
  customer,
  onSignInClick
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm animate-in fade-in"
        onClick={() => { onClose(); setCheckoutStep('cart'); }}
        role="presentation"
      />
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-label={t('cartTitle') || 'Your Cart'}
      >
        <div className="p-6 border-b border-brand-border flex justify-between items-center bg-brand-light">
          <h3 className="text-xl font-bold flex items-center gap-2 text-brand-dark">
            <ShoppingBag size={24} className="text-brand-primary" />
            {checkoutStep === 'cart' && (t('cartTitle') || 'Your Cart')}
            {checkoutStep === 'shipping' && (t('cartShippingTitle') || 'Shipping Details')}
            {checkoutStep === 'payment' && (t('cartPaymentTitle') || 'Payment Method')}
            {checkoutStep === 'success' && (t('cartSuccessTitle') || 'Order Successful')}
          </h3>
          <button
            onClick={() => { onClose(); setCheckoutStep('cart'); }}
            className="p-2 hover:bg-brand-border rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>

        {checkoutStep !== 'success' && cart.length > 0 && (
          <div className="px-6 py-3 border-b border-brand-border bg-brand-light flex items-center justify-center gap-2 text-xs" role="navigation" aria-label="Checkout steps">
            <span className={`px-3 py-1 rounded-lg ${checkoutStep === 'cart' ? 'bg-brand-primary text-white' : 'bg-brand-border text-brand-muted'}`}>{t('cartStep1') || '1. Cart'}</span>
            <ArrowRight size={14} className="text-brand-border" />
            <span className={`px-3 py-1 rounded-lg ${checkoutStep === 'shipping' ? 'bg-brand-primary text-white' : 'bg-brand-border text-brand-muted'}`}>{t('cartStep2') || '2. Shipping'}</span>
            <ArrowRight size={14} className="text-brand-border" />
            <span className={`px-3 py-1 rounded-lg ${checkoutStep === 'payment' ? 'bg-brand-primary text-white' : 'bg-brand-border text-brand-muted'}`}>{t('cartStep3') || '3. Payment'}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {checkoutStep === 'success' && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4" role="status" aria-label={t('cartSuccessTitle') || 'Order Successful'}>
              <div className="w-20 h-20 bg-brand-primary-light text-brand-primary rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={48} />
              </div>
              <h4 className="text-2xl font-black text-brand-dark">{t('cartThankYou') || 'Thank you for your purchase!'}</h4>
              <p className="text-brand-muted text-sm">{t('cartConfirmationMsg') || 'Your order has been registered. We will contact you to confirm payment and shipping.'}</p>
              <button
                onClick={() => { onClose(); setCheckoutStep('cart'); }}
                className="w-full bg-brand-dark text-white py-4 rounded-lg font-bold"
                aria-label={t('cartBackToShop') || 'Back to Shop'}
              >
                {t('cartBackToShop') || 'Back to Shop'}
              </button>
            </div>
          )}

          {checkoutStep === 'cart' && (
            <div className="space-y-4" role="list" aria-label={t('cartTitle') || 'Your Cart'}>
              {!customer && cart.length > 0 && (
                <div className="bg-brand-primary-light border border-brand-primary/20 rounded-lg p-3 mb-4 flex items-center justify-between">
                  <span className="text-sm text-brand-dark">{t('cartSignInToSave') || 'Sign in to save your cart'}</span>
                  <button
                    onClick={onSignInClick}
                    className="text-sm font-semibold text-brand-primary hover:text-brand-primary-dark transition-colors"
                  >
                    {t('customerLogin') || 'Sign In'}
                  </button>
                </div>
              )}
              {cart.length === 0 ? (
                <div className="py-20 text-center text-brand-muted opacity-60">{t('cartEmpty') || 'Your cart is empty'}</div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-3 bg-white rounded-lg border border-brand-border shadow-sm" role="listitem">
                    <img src={item.image} className="w-16 h-16 object-cover rounded-lg" alt={item.name} />
                    <div className="flex-1">
                      <div className="text-sm font-bold text-brand-dark">{item.name}</div>
                      {item.selectedModel && <div className="text-[10px] text-brand-muted font-bold uppercase tracking-widest">{item.selectedModel}</div>}
                      <div className="text-brand-primary font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateCartQuantity(idx, -1)}
                          className="w-7 h-7 rounded-lg border border-brand-border flex items-center justify-center hover:bg-brand-light transition-colors"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(idx, 1)}
                          className="w-7 h-7 rounded-lg border border-brand-border flex items-center justify-center hover:bg-brand-light transition-colors"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(idx)} className="self-start" aria-label={`Remove ${item.name} from cart`}>
                      <Trash2 size={16} className="text-brand-text-tertiary hover:text-brand-critical transition-colors"/>
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {checkoutStep === 'shipping' && (
            <form className="space-y-4" role="form" aria-label={t('cartShippingTitle') || 'Shipping Details'}>
              <div>
                <label className="text-xs font-bold text-brand-muted uppercase tracking-wide">{t('cartFullName') || 'Full Name *'}</label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={e => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-brand-primary outline-none ${formErrors.name ? 'border-brand-critical' : 'border-brand-border'}`}
                  placeholder="John Smith"
                  aria-label={t('cartFullName') || 'Full Name'}
                  aria-invalid={!!formErrors.name}
                />
                {formErrors.name && <p className="text-brand-critical text-xs mt-1" role="alert">{formErrors.name}</p>}
              </div>
              <div>
                <label className="text-xs font-bold text-brand-muted uppercase tracking-wide">{t('cartEmail') || 'Email *'}</label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={e => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-brand-primary outline-none ${formErrors.email ? 'border-brand-critical' : 'border-brand-border'}`}
                  placeholder="john@email.com"
                  aria-label={t('cartEmail') || 'Email'}
                  aria-invalid={!!formErrors.email}
                />
                {formErrors.email && <p className="text-brand-critical text-xs mt-1" role="alert">{formErrors.email}</p>}
              </div>
              <div>
                <label className="text-xs font-bold text-brand-muted uppercase tracking-wide">{t('cartPhone') || 'Phone *'}</label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={e => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className={`w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-brand-primary outline-none ${formErrors.phone ? 'border-brand-critical' : 'border-brand-border'}`}
                  placeholder="+1 555 123 4567"
                  aria-label={t('cartPhone') || 'Phone'}
                  aria-invalid={!!formErrors.phone}
                />
                {formErrors.phone && <p className="text-brand-critical text-xs mt-1" role="alert">{formErrors.phone}</p>}
              </div>
              <div>
                <label className="text-xs font-bold text-brand-muted uppercase tracking-wide">{t('cartAddress') || 'Shipping Address *'}</label>
                <textarea
                  value={customerInfo.address}
                  onChange={e => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                  className={`w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-brand-primary outline-none resize-none ${formErrors.address ? 'border-brand-critical' : 'border-brand-border'}`}
                  placeholder="Street, number, apt, zip code, city"
                  rows={3}
                  aria-label={t('cartAddress') || 'Shipping Address'}
                  aria-invalid={!!formErrors.address}
                />
                {formErrors.address && <p className="text-brand-critical text-xs mt-1" role="alert">{formErrors.address}</p>}
              </div>

              {/* Legal consent checkboxes */}
              <div className="space-y-3 pt-2 border-t border-brand-border">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={e => setAcceptTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary/20"
                  />
                  <span className="text-xs text-brand-muted">
                    {t('checkoutAcceptTerms') || 'I accept the Terms and Conditions'} *
                  </span>
                </label>
                {formErrors.terms && <p className="text-brand-critical text-xs ml-6" role="alert">{t('checkoutTermsRequired') || formErrors.terms}</p>}

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptPrivacy}
                    onChange={e => setAcceptPrivacy(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary/20"
                  />
                  <span className="text-xs text-brand-muted">
                    {t('checkoutAcceptPrivacy') || 'I have read and accept the Privacy Policy'} *
                  </span>
                </label>
                {formErrors.privacy && <p className="text-brand-critical text-xs ml-6" role="alert">{t('checkoutPrivacyRequired') || formErrors.privacy}</p>}
              </div>
            </form>
          )}

          {checkoutStep === 'payment' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-brand-border shadow-sm">
                <h4 className="font-bold text-sm text-brand-dark mb-2">{t('cartOrderSummary') || 'Order Summary'}</h4>
                <p className="text-xs text-brand-muted">{customerInfo.name}</p>
                <p className="text-xs text-brand-muted">{customerInfo.email}</p>
                <p className="text-xs text-brand-muted">{customerInfo.phone}</p>
                <p className="text-xs text-brand-muted">{customerInfo.address}</p>
                <div className="mt-3 pt-3 border-t border-brand-border flex justify-between">
                  <span className="font-bold text-brand-dark">{t('cartTotal') || 'Total:'}</span>
                  <span className="font-black text-brand-primary">${cartTotal.toFixed(2)}</span>
                </div>
              </div>
              <p className="text-xs text-brand-muted text-center">{t('cartSelectPayment') || 'Select your preferred payment method:'}</p>
              <button
                onClick={() => onPlaceOrder('Stripe')}
                className="w-full bg-[#635bff] text-white py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#5046e5] transition-colors"
                aria-label={t('cartPayStripe') || 'Pay with Card'}
              >
                <CreditCard size={20} /> {t('cartPayStripe') || 'Pay with Card'}
              </button>
              <button
                onClick={() => onPlaceOrder('PayPal')}
                className="w-full bg-[#0070ba] text-white py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#005ea6] transition-colors"
                aria-label={t('cartPayPaypal') || 'PayPal'}
              >
                {t('cartPayPaypal') || 'PayPal'}
              </button>
              <p className="text-[10px] text-brand-text-tertiary text-center">{t('cartDemoNote') || 'Note: In this demo, the order is registered as "Pending". In production, real payment gateways would be integrated.'}</p>
            </div>
          )}
        </div>

        {cart.length > 0 && checkoutStep === 'cart' && (
          <div className="p-6 border-t border-brand-border">
            <div className="flex justify-between items-center mb-4 text-xl font-black text-brand-dark">
              <span>{t('cartTotal') || 'Total:'} ({cartItemCount} {t('cartItems') || 'items'})</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <button
              onClick={() => setCheckoutStep('shipping')}
              className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-colors"
              aria-label={t('cartContinue') || 'Continue'}
            >
              {t('cartContinue') || 'Continue'} <ArrowRight size={20} />
            </button>
          </div>
        )}

        {checkoutStep === 'shipping' && (
          <div className="p-6 border-t border-brand-border flex gap-3">
            <button
              onClick={() => setCheckoutStep('cart')}
              className="flex-1 bg-brand-light text-brand-dark py-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-brand-border transition-colors"
              aria-label={t('cartBack') || 'Back'}
            >
              <ArrowLeft size={20} /> {t('cartBack') || 'Back'}
            </button>
            <button
              onClick={onProceedToPayment}
              className="flex-1 bg-brand-primary hover:bg-brand-primary-dark text-white py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
              aria-label={t('cartContinue') || 'Continue'}
            >
              {t('cartContinue') || 'Continue'} <ArrowRight size={20} />
            </button>
          </div>
        )}

        {checkoutStep === 'payment' && (
          <div className="p-6 border-t border-brand-border">
            <button
              onClick={() => setCheckoutStep('shipping')}
              className="w-full bg-brand-light text-brand-dark py-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-brand-border transition-colors"
              aria-label={t('cartBackToShipping') || 'Back to Shipping'}
            >
              <ArrowLeft size={20} /> {t('cartBackToShipping') || 'Back to Shipping'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
