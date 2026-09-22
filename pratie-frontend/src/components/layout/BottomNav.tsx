'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Search, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();

  const isHome = pathname === '/';
  const isCatalog = pathname.startsWith('/products');

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/90 py-1.5 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 transition-colors ${
            isHome ? 'text-pink-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home size={20} className={isHome ? 'stroke-[2.5]' : 'stroke-2'} />
          <span className="text-[10px] tracking-tight">Home</span>
        </Link>

        {/* Explore Looms */}
        <Link
          href="/products"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 transition-colors ${
            isCatalog ? 'text-pink-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass size={20} className={isCatalog ? 'stroke-[2.5]' : 'stroke-2'} />
          <span className="text-[10px] tracking-tight">Looms</span>
        </Link>

        {/* Search */}
        <Link
          href="/products"
          className="flex flex-col items-center gap-0.5 py-1 px-3 text-slate-500 hover:text-pink-600 transition-colors"
        >
          <Search size={20} className="stroke-2" />
          <span className="text-[10px] tracking-tight">Search</span>
        </Link>

        {/* Wishlist */}
        <Link
          href="/products?wishlist=true"
          className="relative flex flex-col items-center gap-0.5 py-1 px-3 text-slate-500 hover:text-pink-600 transition-colors"
        >
          <Heart size={20} className="stroke-2" />
          {wishlist.length > 0 && (
            <span className="absolute top-0.5 right-2 bg-rose-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {wishlist.length}
            </span>
          )}
          <span className="text-[10px] tracking-tight">Saved</span>
        </Link>

        {/* Bag */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-0.5 py-1 px-3 text-slate-500 hover:text-pink-600 transition-colors cursor-pointer"
        >
          <ShoppingBag size={20} className="stroke-2" />
          {itemCount > 0 && (
            <span className="absolute top-0.5 right-2 bg-gradient-to-r from-pink-600 to-amber-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {itemCount}
            </span>
          )}
          <span className="text-[10px] tracking-tight">Bag</span>
        </button>
      </div>
    </nav>
  );
};
