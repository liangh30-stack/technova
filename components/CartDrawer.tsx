import React from 'react';
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
  onProceedToPayment: () => void;
  onPlaceOrder: (method: 'Stripe' | 'PayPal') => void;
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
  onProceedToPayment,
  onPlaceOrder
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm animate-in fade-in"
        onClick={() => { onClose(); setCheckoutStep('cart'); }}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold flex items-center gap-2 text-brand-dark">
            <ShoppingBag size={24} className="text-brand-pink" />
            {checkoutStep === 'cart' && 'Tu Carrito'}
            {checkoutStep === 'shipping' && 'Datos de Envío'}
            {checkoutStep === 'payment' && 'Método de Pago'}
            {checkoutStep === 'success' && 'Orden Exitosa'}
          </h3>
          <button onClick={() => { onClose(); setCheckoutStep('cart'); }} className="p-2 hover:bg-gray-200 rounded-full">
            <X size={24} />
          </button>
        </div>

        {checkoutStep !== 'success' && cart.length > 0 && (
          <div className="px-6 py-3 border-b bg-gray-50 flex items-center justify-center gap-2 text-xs">
            <span className={`px-3 py-1 rounded-full ${checkoutStep === 'cart' ? 'bg-brand-pink text-white' : 'bg-gray-200 text-gray-500'}`}>1. Carrito</span>
            <ArrowRight size={14} className="text-gray-300" />
            <span className={`px-3 py-1 rounded-full ${checkoutStep === 'shipping' ? 'bg-brand-pink text-white' : 'bg-gray-200 text-gray-500'}`}>2. Envío</span>
            <ArrowRight size={14} className="text-gray-300" />
            <span className={`px-3 py-1 rounded-full ${checkoutStep === 'payment' ? 'bg-brand-pink text-white' : 'bg-gray-200 text-gray-500'}`}>3. Pago</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {checkoutStep === 'success' && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={48} />
              </div>
              <h4 className="text-2xl font-black text-brand-dark">¡Gracias por tu compra!</h4>
              <p className="text-gray-500 text-sm">Tu pedido ha sido registrado. Te contactaremos para confirmar el pago y envío.</p>
              <button onClick={() => { onClose(); setCheckoutStep('cart'); }} className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold">Volver a la Tienda</button>
            </div>
          )}

          {checkoutStep === 'cart' && (
            <div className="space-y-4">
              {cart.length === 0 ? (
                <div className="py-20 text-center opacity-40">El carrito está vacío</div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-3 border rounded-xl bg-gray-50">
                    <img src={item.image} className="w-16 h-16 object-cover rounded-lg" alt="" />
                    <div className="flex-1">
                      <div className="text-sm font-bold text-brand-dark">{item.name}</div>
                      {item.selectedModel && <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{item.selectedModel}</div>}
                      <div className="text-brand-pink font-bold">€{(item.price * item.quantity).toFixed(2)}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateCartQuantity(idx, -1)} className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-200">
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(idx, 1)} className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-200">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(idx)} className="self-start"><Trash2 size={16} className="text-gray-300 hover:text-red-400"/></button>
                  </div>
                ))
              )}
            </div>
          )}

          {checkoutStep === 'shipping' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Nombre Completo *</label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={e => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-brand-pink outline-none ${formErrors.name ? 'border-red-400' : 'border-gray-200'}`}
                  placeholder="Juan García"
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email *</label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={e => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-brand-pink outline-none ${formErrors.email ? 'border-red-400' : 'border-gray-200'}`}
                  placeholder="juan@email.com"
                />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Teléfono *</label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={e => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className={`w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-brand-pink outline-none ${formErrors.phone ? 'border-red-400' : 'border-gray-200'}`}
                  placeholder="+34 600 123 456"
                />
                {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Dirección de Envío *</label>
                <textarea
                  value={customerInfo.address}
                  onChange={e => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                  className={`w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-brand-pink outline-none resize-none ${formErrors.address ? 'border-red-400' : 'border-gray-200'}`}
                  placeholder="Calle, número, piso, código postal, ciudad"
                  rows={3}
                />
                {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
              </div>
            </div>
          )}

          {checkoutStep === 'payment' && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border">
                <h4 className="font-bold text-sm text-brand-dark mb-2">Resumen del Pedido</h4>
                <p className="text-xs text-gray-500">{customerInfo.name}</p>
                <p className="text-xs text-gray-500">{customerInfo.email}</p>
                <p className="text-xs text-gray-500">{customerInfo.phone}</p>
                <p className="text-xs text-gray-500">{customerInfo.address}</p>
                <div className="mt-3 pt-3 border-t flex justify-between">
                  <span className="font-bold">Total:</span>
                  <span className="font-black text-brand-pink">€{cartTotal.toFixed(2)}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center">Selecciona tu método de pago preferido:</p>
              <button
                onClick={() => onPlaceOrder('Stripe')}
                className="w-full bg-[#635bff] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#5046e5] transition-colors"
              >
                <CreditCard size={20} /> Pagar con Stripe
              </button>
              <button
                onClick={() => onPlaceOrder('PayPal')}
                className="w-full bg-[#0070ba] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#005ea6] transition-colors"
              >
                PayPal
              </button>
              <p className="text-[10px] text-gray-400 text-center">Nota: En esta demo el pedido se registra como "Pendiente". En producción se integraría con pasarelas de pago reales.</p>
            </div>
          )}
        </div>

        {cart.length > 0 && checkoutStep === 'cart' && (
          <div className="p-6 border-t">
            <div className="flex justify-between items-center mb-4 text-xl font-black">
              <span>Total ({cartItemCount} items)</span>
              <span>€{cartTotal.toFixed(2)}</span>
            </div>
            <button
              onClick={() => setCheckoutStep('shipping')}
              className="w-full bg-brand-pink text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
            >
              Continuar <ArrowRight size={20} />
            </button>
          </div>
        )}

        {checkoutStep === 'shipping' && (
          <div className="p-6 border-t flex gap-3">
            <button onClick={() => setCheckoutStep('cart')} className="flex-1 bg-gray-100 text-brand-dark py-4 rounded-xl font-bold flex items-center justify-center gap-2">
              <ArrowLeft size={20} /> Atrás
            </button>
            <button onClick={onProceedToPayment} className="flex-1 bg-brand-pink text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2">
              Continuar <ArrowRight size={20} />
            </button>
          </div>
        )}

        {checkoutStep === 'payment' && (
          <div className="p-6 border-t">
            <button onClick={() => setCheckoutStep('shipping')} className="w-full bg-gray-100 text-brand-dark py-4 rounded-xl font-bold flex items-center justify-center gap-2">
              <ArrowLeft size={20} /> Volver a Envío
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
