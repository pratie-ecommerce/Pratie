'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Eye, ShoppingBag, MapPin, Check, Star } from 'lucide-react';
import { Product } from '../../types/index';
import { formatPaise } from '../../lib/utils';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { QuickViewModal } from './QuickViewModal';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const primaryImage =
    product.media?.find((m) => m.isPrimary)?.imageUrl ||
    product.media?.[0]?.imageUrl ||
    '/images/products/mithila-handpainted-tussar-silk-saree.jpeg';

  const defaultVariant = product.variants?.[0];
  const isWishlisted = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (defaultVariant) {
      setIsAdding(true);
      addToCart(product, defaultVariant, 1);
      toast.success(`${product.title} added to Bag`, {
        description: `Origin: ${product.state || 'Handcrafted Heritage'}`
      });
      setTimeout(() => setIsAdding(false), 800);
    }
  };

  // Calculate discount percentage if compare price exists
  const discountPercent =
    product.compareAtPricePaise && product.compareAtPricePaise > product.basePricePaise
      ? Math.round(((product.compareAtPricePaise - product.basePricePaise) / product.compareAtPricePaise) * 100)
      : null;

  return (
    <>
      <div className="ecom-card group relative flex flex-col overflow-hidden bg-white">
        {/* Media Container */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
          <Link href={`/products/${product.slug}`} className="block w-full h-full">
            <Image
              src={primaryImage}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </Link>

          {/* Floating Badges */}
          <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex flex-col gap-1 z-10">
            {product.state && (
              <span className="bg-pink-600 text-white text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 sm:px-2 rounded shadow-xs flex items-center gap-1">
                <MapPin size={9} className="hidden sm:inline" />
                <span>{product.state}</span>
              </span>
            )}
            {product.clothingType && (
              <span className="bg-white/95 text-slate-800 text-[7.5px] sm:text-[8.5px] font-bold uppercase px-1.5 py-0.5 rounded shadow-2xs border border-slate-200">
                {product.clothingType}
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(product)}
            className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 p-1.5 sm:p-2 bg-white/90 hover:bg-white text-slate-700 hover:text-rose-600 rounded-full shadow-md transition-all z-10 cursor-pointer hover:scale-110"
            aria-label="Wishlist"
          >
            <Heart
              size={13}
              className={isWishlisted ? 'fill-rose-600 text-rose-600' : 'text-slate-600'}
            />
          </button>

          {/* Hover / Quick Actions Bar */}
          <div className="absolute inset-x-0 bottom-0 p-1.5 sm:p-2.5 bg-gradient-to-t from-white via-white/95 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-between gap-1.5 sm:gap-2 z-10">
            <button
              onClick={() => setQuickViewOpen(true)}
              className="flex-1 bg-white hover:bg-slate-50 text-slate-900 text-[9.5px] sm:text-[11px] font-bold py-1.5 sm:py-2 px-2 sm:px-3 flex items-center justify-center gap-1 uppercase tracking-wider border border-slate-200 rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              <Eye size={12} className="text-pink-600" />
              <span>Quick View</span>
            </button>
            <button
              onClick={handleQuickAdd}
              className="bg-gradient-to-r from-pink-600 to-amber-600 hover:from-pink-700 hover:to-amber-700 text-white p-1.5 sm:p-2 rounded-xl transition-all shadow-sm cursor-pointer hover:scale-105"
              title="Add to Bag"
              aria-label="Add to Bag"
            >
              {isAdding ? <Check size={14} /> : <ShoppingBag size={14} />}
            </button>
          </div>
        </div>

        {/* Card Details */}
        <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between bg-white">
          <div>
            <div className="flex items-center justify-between text-[8.5px] sm:text-[10px] uppercase font-bold text-pink-600 mb-0.5 sm:mb-1">
              <span className="line-clamp-1">{product.craftTechnique || 'Handloom Heritage'}</span>
              <div className="flex items-center gap-0.5 text-amber-500 font-semibold shrink-0 ml-1">
                <Star size={10} className="fill-amber-400 text-amber-400" />
                <span>{product.ratingAverage?.toFixed(1) || '4.9'}</span>
              </div>
            </div>

            <Link href={`/products/${product.slug}`} className="hover:text-pink-600 transition-colors block">
              <h3 className="font-heading text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 leading-snug">
                {product.title}
              </h3>
            </Link>

            <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 line-clamp-1 font-normal">
              {product.fabric || product.shortDescription}
            </p>
          </div>
        </div>
      </div>

      {quickViewOpen && (
        <QuickViewModal product={product} onClose={() => setQuickViewOpen(false)} />
      )}
    </>
  );
};
