'use client';

import React, { useState } from 'react';
import { MessageSquare, Sparkles, X, Phone, Compass, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const ConciergeWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Expanded Modal Box in Bright Mode */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white border border-amber-200/90 shadow-2xl p-5 text-slate-900 rounded-2xl animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-amber-600" />
              <span className="font-editorial text-sm font-bold text-slate-900">
                Pratiè Royal Concierge
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X size={17} />
            </button>
          </div>

          <p className="text-xs text-slate-600 font-normal leading-relaxed mb-4">
            Need guidance choosing an authentic state loom, silk certification details, or bespoke blouse stitching?
          </p>

          <div className="space-y-2 mb-4">
            <Link
              href="/products?state=Bihar"
              onClick={() => setIsOpen(false)}
              className="block p-3 bg-amber-50/60 hover:bg-amber-100/60 border border-amber-200/80 transition-all rounded-xl text-xs"
            >
              <div className="font-bold text-slate-900">📍 Mithila Tussar &amp; Madhubani</div>
              <div className="text-[10.5px] text-slate-500 font-normal">Explore authentic handpainted Bihar silks</div>
            </Link>

            <Link
              href="/products?state=Uttar Pradesh"
              onClick={() => setIsOpen(false)}
              className="block p-3 bg-emerald-50/60 hover:bg-emerald-100/60 border border-emerald-200/80 transition-all rounded-xl text-xs"
            >
              <div className="font-bold text-slate-900">📍 Banarasi Katan &amp; Awadh Chikankari</div>
              <div className="text-[10.5px] text-slate-500 font-normal">Pit-loom real zari and delicate Mukaish</div>
            </Link>

            <Link
              href="/products?state=Rajasthan"
              onClick={() => setIsOpen(false)}
              className="block p-3 bg-rose-50/60 hover:bg-rose-100/60 border border-rose-200/80 transition-all rounded-xl text-xs"
            >
              <div className="font-bold text-slate-900">📍 Marwari Gotapatti &amp; Leheriya</div>
              <div className="text-[10.5px] text-slate-500 font-normal">Jaipur royal court needlework</div>
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <a
              href="tel:+919871200000"
              className="flex items-center gap-1.5 text-rose-600 font-bold hover:underline"
            >
              <Phone size={13} />
              <span>Call Styling Desk</span>
            </a>
            <span className="text-slate-400 text-[10px]">10:30 AM – 7:30 PM IST</span>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 bg-white hover:bg-slate-50 border-2 border-amber-300 hover:border-amber-400 text-slate-900 px-4 py-3 shadow-xl transition-all duration-300 rounded-full cursor-pointer hover:scale-105"
        aria-label="Open Concierge"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
        </span>
        <span className="text-[11px] uppercase tracking-[0.2em] font-extrabold bg-gradient-to-r from-amber-700 via-rose-600 to-indigo-700 bg-clip-text text-transparent hidden sm:inline">
          {isOpen ? 'Close' : 'Patron Concierge'}
        </span>
        <MessageSquare size={17} className="text-amber-600 group-hover:text-rose-600 transition-colors" />
      </button>
    </div>
  );
};
