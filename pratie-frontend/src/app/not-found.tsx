import React from 'react';
import Link from 'next/link';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-24 bg-[#faf8f5]">
      <div className="max-w-md w-full text-center bg-white border border-amber-900/10 rounded-3xl p-8 sm:p-12 shadow-sm">
        <div className="inline-flex p-4 rounded-full bg-amber-50 text-amber-800 mb-6 border border-amber-200/60 shadow-xs">
          <Compass size={28} className="text-amber-600" />
        </div>

        <div className="text-[10px] uppercase font-bold tracking-[0.25em] text-amber-800 mb-2">
          Page Not Found • 404
        </div>

        <h1 className="font-heading text-2xl sm:text-3xl text-slate-900 mb-3 font-bold">
          An Unchartered Weave
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-8">
          The heritage drape or page you are seeking could not be found in our current archives.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#4a0d18] hover:bg-[#5e111f] text-white text-xs font-bold px-6 py-3 rounded-full transition-all shadow-xs cursor-pointer"
          >
            <Home size={14} />
            <span>Return to Home</span>
          </Link>

          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold px-6 py-3 rounded-full transition-all cursor-pointer"
          >
            <span>Browse All Looms</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
