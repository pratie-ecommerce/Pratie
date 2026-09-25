'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPaise } from '../../lib/utils';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotalPaise,
    itemCount
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white text-slate-900 shadow-2xl flex flex-col border-l border-amber-200">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-editorial text-xl font-bold tracking-wider text-slate-900">Your Bag</span>
              <span className="text-xs bg-gradient-to-r from-amber-600 to-rose-600 text-white font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X size={22} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-500 font-normal text-sm mb-6">Your shopping bag is currently empty.</p>
                <Link
                  href="/products"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-block bg-gradient-to-r from-amber-600 to-rose-600 text-white text-xs font-bold px-7 py-3.5 tracking-widest uppercase rounded-xl hover:shadow-lg transition-all"
                >
                  Explore Creations
                </Link>
              </div>
            ) : (
              items.map((item) => {
                const itemPrice = item.product.basePricePaise + (item.variant.additionalPricePaise || 0);
                const img = item.product.media[0]?.imageUrl || '/images/products/mithila-handpainted-tussar-silk-saree.jpeg';

                return (
                  <div key={item.id} className="py-5 flex gap-4">
                    <div className="relative w-20 h-24 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden border border-slate-200">
                      <Image
                        src={img}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-bold tracking-wide text-slate-900 line-clamp-1">
                            {item.product.title}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-400 hover:text-rose-600 transition-colors ml-2 cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          {item.variant.size && <span>Size: {item.variant.size}</span>}
                          {item.variant.colorName && <span className="ml-2">• {item.variant.colorName}</span>}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-slate-300 rounded-md bg-white shadow-xs">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 hover:bg-slate-100 text-slate-600 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2.5 py-1 text-xs font-bold text-slate-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 hover:bg-slate-100 text-slate-600 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Silk Mark
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Call-to-Action */}
          {items.length > 0 && (
            <div className="p-6 border-t border-amber-200 bg-slate-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Total Selection</span>
                <span className="font-editorial text-sm font-bold text-slate-900">{itemCount} {itemCount === 1 ? 'Attire Piece' : 'Attire Pieces'}</span>
              </div>
              <p className="text-[10px] text-slate-500 mb-5">
                Complimentary insured delivery &amp; certificate of authenticity included.
              </p>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white font-bold text-xs py-4 tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all shadow-lg rounded-xl"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </Link>

              <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-slate-500 tracking-wider">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Insured Global Courier • Authentic Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
