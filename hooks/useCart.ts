import { useMemo, useState } from 'react';
import { Product } from '../types';

interface CartItem extends Product {
  quantity: number;
}

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      if (product.isCustom) {
        return [...prev, { ...product, quantity: 1 }];
      }
      const existingIndex = prev.findIndex(item =>
        item.id === product.id && item.selectedModel === product.selectedModel
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1
        };
        return updated;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateCartQuantity = (index: number, delta: number) => {
    setCart(prev => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      updated[index] = { ...updated[index], quantity: newQty };
      return updated;
    });
  };

  const cartTotal = useMemo(() => cart.reduce((acc, p) => acc + p.price * p.quantity, 0), [cart]);
  const cartItemCount = useMemo(() => cart.reduce((acc, p) => acc + p.quantity, 0), [cart]);

  return {
    cart,
    setCart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    cartTotal,
    cartItemCount
  };
};

export type { CartItem };
