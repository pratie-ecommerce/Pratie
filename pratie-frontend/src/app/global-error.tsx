'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home, Sparkles } from 'lucide-react';
import '../styles/globals.css';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Pratiè Global Root Error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center px-6 py-24 bg-[#faf8f5] text-slate-900 font-sans">
        <div className="max-w-md w-full text-center bg-white border border-amber-900/10 rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="inline-flex p-4 rounded-full bg-amber-50 text-amber-800 mb-6 border border-amber-200/60 shadow-xs">
            <Sparkles size={28} className="text-amber-600 animate-pulse" />
          </div>

          <div className="text-[10px] uppercase font-bold tracking-[0.25em] text-amber-800 mb-2">
            Atelier Concierge Notice
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl text-slate-900 mb-3 font-bold">
            System Synchronization
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-8">
            The atelier is updating handloom archives. Please reload to restore connection.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#4a0d18] hover:bg-[#5e111f] text-white text-xs font-bold px-6 py-3 rounded-full transition-all shadow-xs cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Reload Page</span>
            </button>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold px-6 py-3 rounded-full transition-all cursor-pointer"
            >
              <Home size={14} />
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
