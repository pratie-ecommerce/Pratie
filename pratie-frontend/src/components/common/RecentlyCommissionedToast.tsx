'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, X, CheckCircle } from 'lucide-react';

const RECENT_ORDERS = [
  {
    patron: 'Priyanka S.',
    city: 'South Delhi',
    attire: 'Kashi Kadwa Real Zari Saree',
    time: '2 mins ago',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80',
    link: '/products?clothingType=Saree'
  },
  {
    patron: 'Ananya D.',
    city: 'Bengaluru',
    attire: 'Awadh Mukaish Chikankari Anarkali',
    time: '6 mins ago',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=150&q=80',
    link: '/products?clothingType=Suit'
  },
  {
    patron: 'Meera K.',
    city: 'Mumbai',
    attire: 'Kanjeevaram Temple Silk Saree',
    time: '11 mins ago',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=150&q=80',
    link: '/products?search=Kanjeevaram'
  },
  {
    patron: 'Radhika R.',
    city: 'Jaipur',
    attire: 'Mithila Handpainted Tussar Saree',
    time: '18 mins ago',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80',
    link: '/products?state=Bihar'
  }
];

export const RecentlyCommissionedToast: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    // Show after initial 4 seconds
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 4000);

    // Cycle every 16 seconds
    const cycleInterval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % RECENT_ORDERS.length);
        setIsVisible(true);
      }, 1000);
    }, 16000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(cycleInterval);
    };
  }, [isDismissed]);

  // Auto-hide each toast after 5 seconds
  useEffect(() => {
    if (!isVisible) return;
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 5500);
    return () => clearTimeout(hideTimer);
  }, [isVisible, currentIndex]);

  if (isDismissed) return null;

  const current = RECENT_ORDERS[currentIndex];

  return (
    <div
      className={`fixed bottom-16 lg:bottom-6 left-4 z-40 max-w-xs sm:max-w-sm transition-all duration-500 transform ${
        isVisible
          ? 'translate-y-0 opacity-100 scale-100'
          : 'translate-y-8 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div className="bg-white/95 backdrop-blur-xl border border-pink-200/90 rounded-2xl p-3 shadow-xl flex items-center gap-3 relative">
        <button
          onClick={() => {
            setIsVisible(false);
            setIsDismissed(true);
          }}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center text-xs shadow-xs"
          aria-label="Dismiss notification"
        >
          <X size={11} />
        </button>

        {/* Thumbnail */}
        <Link href={current.link} className="relative w-12 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-200">
          <Image
            src={current.image}
            alt={current.attire}
            fill
            className="object-cover"
          />
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[9.5px] font-bold text-pink-600 uppercase tracking-wide">
            <CheckCircle size={10} className="text-emerald-600 shrink-0" />
            <span>Recently Commissioned</span>
          </div>
          <Link href={current.link} className="hover:text-pink-600 transition-colors block">
            <div className="text-xs font-bold text-slate-900 line-clamp-1 leading-tight mt-0.5">
              {current.attire}
            </div>
          </Link>
          <div className="text-[10px] text-slate-500 mt-0.5 flex items-center justify-between">
            <span>
              By <strong className="text-slate-700">{current.patron}</strong> ({current.city})
            </span>
            <span className="text-[9.5px] text-slate-400 font-mono">{current.time}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
