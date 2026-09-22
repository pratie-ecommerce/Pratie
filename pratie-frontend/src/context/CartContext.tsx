'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant } from '../types/index';
import { toast } from 'sonner';

export interface CartItemType {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

interface CartContextType {
  items: CartItemType[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  subtotalPaise: number;
  itemCount: number;
  appliedCoupon: { code: string; discountPaise: number } | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  isCartOpen: false,
  setIsCartOpen: () => {},
  addToCart: () => {},
  updateQuantity: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  subtotalPaise: 0,
  itemCount: 0,
  appliedCoupon: null,
  applyCoupon: () => false,
  removeCoupon: () => {}
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPaise: number } | null>(null);

  // Hydrate from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pratie_cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load cart from storage', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('pratie_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, variant: ProductVariant, quantity = 1) => {
    setItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.product.id === product.id && i.variant.id === variant.id
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      } else {
        const newItem: CartItemType = {
          id: `${product.id}_${variant.id}`,
          product,
          variant,
          quantity
        };
        return [...prev, newItem];
      }
    });

    toast.success(`Added ${product.title} to your bag`, {
      description: `Size: ${variant.size || 'Standard'} | Qty: ${quantity}`
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((it) => (it.id === cartItemId ? { ...it, quantity } : it))
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((it) => it.id !== cartItemId));
    toast('Item removed from your bag');
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const subtotalPaise = items.reduce(
    (acc, it) =>
      acc + (it.product.basePricePaise + (it.variant.additionalPricePaise || 0)) * it.quantity,
    0
  );

  const itemCount = items.reduce((acc, it) => acc + it.quantity, 0);

  const applyCoupon = (code: string): boolean => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'HERITAGE10' || normalized === 'WELCOME10') {
      const discount = Math.min(Math.round(subtotalPaise * 0.1), 250000);
      setAppliedCoupon({ code: 'HERITAGE10', discountPaise: discount });
      toast.success('Promo code HERITAGE10 applied (10% off)');
      return true;
    } else if (normalized === 'PRATIEVIP') {
      const discount = Math.min(Math.round(subtotalPaise * 0.2), 500000);
      setAppliedCoupon({ code: 'PRATIEVIP', discountPaise: discount });
      toast.success('VIP promo code PRATIEVIP applied (20% off)');
      return true;
    } else if (normalized === 'MITHILA2000' || normalized === 'LUXE2000') {
      setAppliedCoupon({ code: 'MITHILA2000', discountPaise: 200000 });
      toast.success('Promo code MITHILA2000 applied (₹2,000 off)');
      return true;
    } else {
      toast.error('Invalid or expired promotional voucher');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast('Promo code removed');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotalPaise,
        itemCount,
        appliedCoupon,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
