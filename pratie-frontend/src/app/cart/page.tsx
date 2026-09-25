'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPaise } from '../../lib/utils';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    subtotalPaise,
    itemCount,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = React.useState('');

  const discountPaise = appliedCoupon?.discountPaise || 0;
  const discountedSubtotal = Math.max(0, subtotalPaise - discountPaise);
  const taxPaise = Math.round(discountedSubtotal * 0.18);
  const shippingPaise = discountedSubtotal >= 500000 || discountedSubtotal === 0 ? 0 : 49900;
  const totalPaise = discountedSubtotal + taxPaise + shippingPaise;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center text-slate-900">
        <span className="text-[10.5px] uppercase tracking-[0.3em] text-amber-700 font-extrabold">
          Your Collection
        </span>
        <h1 className="font-editorial text-4xl font-bold mt-2 mb-4 text-slate-900">Your Bag is Empty</h1>
        <p className="text-xs text-slate-600 font-normal mb-8 max-w-md mx-auto">
          Explore our regional heritage collections in Mithila art, Kashi Kadwa weaves, and Chanderi silks.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white text-xs font-bold px-8 py-4 uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg"
        >
          <span>Discover Heritage Stories</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-slate-900">
      <div className="mb-10">
        <span className="text-[10.5px] uppercase tracking-[0.3em] text-amber-700 font-extrabold">
          Review Curation
        </span>
        <h1 className="font-editorial text-3xl md:text-4xl font-bold mt-1 text-slate-900">Shopping Bag ({itemCount})</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-amber-200/90 rounded-2xl divide-y divide-slate-100 shadow-sm overflow-hidden">
            {items.map((item) => {
              const itemPrice =
                item.product.basePricePaise + (item.variant.additionalPricePaise || 0);
              const img =
                item.product.media[0]?.imageUrl ||
                '/images/products/mithila-handpainted-tussar-silk-saree.jpeg';

              return (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 items-start">
                  <div className="relative w-28 h-36 bg-slate-100 border border-slate-200 rounded-xl flex-shrink-0 overflow-hidden">
                    <Image
                      src={img}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between h-full w-full">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] uppercase tracking-[0.2em] text-amber-800 font-extrabold">
                            {item.product.brandName || 'Pratiè Atelier'}
                          </span>
                          <Link href={`/products/${item.product.slug}`} className="hover:text-rose-600 transition-colors block">
                            <h3 className="font-editorial text-lg font-bold text-slate-900">
                              {item.product.title}
                            </h3>
                          </Link>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>

                      <div className="text-xs text-slate-500 mt-2 space-x-3 font-medium">
                        {item.variant.size && <span>Size: {item.variant.size}</span>}
                        {item.variant.colorName && <span>Color: {item.variant.colorName}</span>}
                        <span>SKU: {item.variant.sku}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                      <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-bold transition-colors"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="px-3 py-1.5 text-xs font-bold text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-bold transition-colors"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <span className="text-xs uppercase font-extrabold tracking-wider text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200/80">
                        Price on Request
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary Box */}
        <div className="bg-white border border-amber-200/90 rounded-2xl p-6 space-y-6 shadow-sm">
          <h2 className="font-editorial text-xl font-bold text-slate-900 pb-4 border-b border-slate-100">
            Selection Summary
          </h2>

          <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-950 space-y-1">
            <span className="font-bold block uppercase tracking-wider text-[10.5px] text-amber-900">
              ✦ Backend Pricing Architecture
            </span>
            <p className="text-[11px] text-amber-900/80 font-normal">
              Product valuations and live rates will be supplied directly from the backend atelier upon inquiry.
            </p>
          </div>

          {/* Breakdown */}
          <div className="space-y-3 pt-2 text-xs text-slate-700">
            <div className="flex justify-between font-medium">
              <span>Total Selected Attires</span>
              <span className="font-bold text-slate-900">{itemCount} {itemCount === 1 ? 'Creation' : 'Creations'}</span>
            </div>

            <div className="flex justify-between font-medium">
              <span>Insured White-Glove Courier</span>
              <span className="text-emerald-700 font-bold">Complimentary (Pan-India)</span>
            </div>

            <div className="flex justify-between font-medium">
              <span>Authenticity Certification</span>
              <span className="text-emerald-700 font-bold">Silk Mark &amp; GI Tag Verified</span>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-200 text-sm font-bold text-slate-900">
              <span>Pricing Valuation</span>
              <span className="font-editorial text-base font-extrabold text-[#881337]">Bespoke / On Request</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full bg-gradient-to-r from-amber-600 via-rose-600 to-rose-700 hover:from-amber-700 hover:to-rose-800 text-white text-xs font-bold py-4 uppercase tracking-[0.25em] flex items-center justify-center gap-2 rounded-xl transition-all shadow-lg hover:shadow-xl cursor-pointer"
          >
            <span>Proceed to Reservation</span>
            <ArrowRight size={16} />
          </Link>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
            <ShieldCheck size={15} className="text-emerald-600" />
            <span>Guaranteed Masterpiece Provenance</span>
          </div>
        </div>
      </div>
    </div>
  );
}
