import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Product, FirestoreCartItem } from '../types';
import { getFirestoreCart, setFirestoreCart } from '../services/customerService';

interface CartItem extends Product {
  quantity: number;
}

export const useCart = (customerUid: string | null = null) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialLoadDone = useRef(false);

  // Load cart from Firestore when customer logs in
  useEffect(() => {
    if (customerUid && !initialLoadDone.current) {
      getFirestoreCart(customerUid)
        .then((firestoreItems) => {
          if (firestoreItems.length > 0) {
            const loadedCart: CartItem[] = firestoreItems.map((item) => ({
              id: item.productId,
              name: item.name,
              price: item.price,
              image: item.image,
              quantity: item.quantity,
              selectedModel: item.selectedModel,
              isCustom: item.isCustom,
              category: '',
              description: '',
            }));
            setCart((prev) => {
              // Merge: keep existing in-memory items + add Firestore items not already present
              const existingIds = new Set(prev.map((p) => `${p.id}-${p.selectedModel || ''}`));
              const newItems = loadedCart.filter(
                (p) => !existingIds.has(`${p.id}-${p.selectedModel || ''}`)
              );
              return [...prev, ...newItems];
            });
          }
          initialLoadDone.current = true;
        })
        .catch(() => {});
    }
    if (!customerUid) {
      initialLoadDone.current = false;
    }
  }, [customerUid]);

  // Debounced sync to Firestore
  const syncToFirestore = useCallback(
    (items: CartItem[]) => {
      if (!customerUid) return;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const firestoreItems: FirestoreCartItem[] = items.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          selectedModel: item.selectedModel,
          isCustom: item.isCustom,
          addedAt: new Date().toISOString(),
        }));
        setFirestoreCart(customerUid, firestoreItems).catch(() => {});
      }, 500);
    },
    [customerUid]
  );

  const addToCart = (product: Product) => {
    setCart((prev) => {
      let updated: CartItem[];
      if (product.isCustom) {
        updated = [...prev, { ...product, quantity: 1 }];
      } else {
        const existingIndex = prev.findIndex(
          (item) => item.id === product.id && item.selectedModel === product.selectedModel
        );
        if (existingIndex >= 0) {
          updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + 1,
          };
        } else {
          updated = [...prev, { ...product, quantity: 1 }];
        }
      }
      syncToFirestore(updated);
      return updated;
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      syncToFirestore(updated);
      return updated;
    });
  };

  const updateCartQuantity = (index: number, delta: number) => {
    setCart((prev) => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      let result: CartItem[];
      if (newQty <= 0) {
        result = prev.filter((_, i) => i !== index);
      } else {
        updated[index] = { ...updated[index], quantity: newQty };
        result = updated;
      }
      syncToFirestore(result);
      return result;
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
    cartItemCount,
  };
};

export type { CartItem };
