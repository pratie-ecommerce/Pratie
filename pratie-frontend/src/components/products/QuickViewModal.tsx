'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag } from 'lucide-react';
import { Product, ProductVariant } from '../../types/index';
import { formatPaise } from '../../lib/utils';
import { useCart } from '../../context/CartContext';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || {
      id: 'default',
      productId: product.id,
      sku: product.skuPrefix,
      additionalPricePaise: 0,
      stockQuantity: 10,
      isAvailable: true
    }
  );
  const [quantity, setQuantity] = useState(1);

  const primaryImage =
    product.media[0]?.imageUrl ||
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';

  const handleAdd = () => {
    addToCart(product, selectedVariant, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />

      {/* Modal Card */}
      <div className="relative bg-white text-slate-900 max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 shadow-2xl z-10 overflow-hidden border border-amber-200/90 rounded-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-white text-slate-700 hover:text-rose-600 rounded-full border border-slate-200 transition-colors shadow-md cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Media */}
        <div className="relative aspect-[3/4] md:aspect-auto h-72 md:h-full bg-slate-100">
          <Image
            src={primaryImage}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Details */}
        <div className="p-6 md:p-8 flex flex-col justify-between bg-white">
          <div>
            <div className="text-[10.5px] uppercase tracking-[0.25em] text-amber-800 font-extrabold mb-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>{product.brandName || 'Pratiè Atelier'}</span>
            </div>
            <h2 className="font-editorial text-xl font-bold text-slate-900 mb-2">
              {product.title}
            </h2>
            <div className="text-xl font-extrabold text-slate-900 mb-4">
              {formatPaise(product.basePricePaise + (selectedVariant.additionalPricePaise || 0))}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-6 font-normal">
              {product.description}
            </p>

            {/* Variants Selector */}
            {product.variants.length > 1 && (
              <div className="mb-6">
                <label className="text-[11px] uppercase tracking-wider font-bold text-slate-700 block mb-2">
                  Select Size / Specification:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        selectedVariant.id === v.id
                          ? 'border-transparent bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-sm'
                          : 'border-slate-200 hover:border-amber-300 text-slate-700 bg-slate-50'
                      }`}
                    >
                      {v.size || v.colorName || v.sku}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Material / Details */}
            {product.material && (
              <div className="text-[11px] text-slate-600 mb-6 bg-amber-50/60 p-3 rounded-lg border border-amber-200/70">
                <span className="font-bold text-slate-900">Craft & Material:</span> {product.material}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            <button
              onClick={handleAdd}
              className="w-full bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white text-xs font-bold py-3.5 tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all shadow-md rounded-xl cursor-pointer"
            >
              <ShoppingBag size={16} />
              <span>Add to Shopping Bag</span>
            </button>

            <Link
              href={`/products/${product.slug}`}
              onClick={onClose}
              className="text-center text-xs text-rose-600 hover:text-rose-700 font-bold underline tracking-wider"
            >
              View Full Heritage Story & Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
