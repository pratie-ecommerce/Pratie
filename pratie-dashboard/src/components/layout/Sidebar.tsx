'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Settings,
  ExternalLink,
  Store
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', href: '/', icon: LayoutDashboard },
    { label: 'Product Catalog', href: '/products', icon: Package },
    { label: 'Order Fulfillment', href: '/orders', icon: ShoppingBag },
    { label: 'Client Ledger', href: '/customers', icon: Users }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between flex-shrink-0 min-h-screen shadow-xs">
      <div>
        {/* Logo & Atelier Tag */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="font-serif text-2xl tracking-[0.15em] font-bold text-slate-900 block">
              Pratiè
            </span>
            <span className="text-[8.5px] uppercase tracking-[0.3em] font-extrabold bg-gradient-to-r from-amber-700 via-rose-600 to-indigo-700 bg-clip-text text-transparent">
              HERITAGE MANAGEMENT
            </span>
          </div>
          <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-mono font-bold">
            v1.0
          </span>
        </div>

        {/* Navigation items */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-md shadow-amber-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon size={17} className={isActive ? 'text-white' : 'text-slate-500'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Storefront switch */}
      <div className="p-4 border-t border-slate-100 space-y-2">
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-amber-900 bg-amber-50/70 hover:bg-amber-100 border border-amber-200/80 transition-all shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <Store size={15} className="text-rose-600" />
            <span>Storefront Live View</span>
          </div>
          <ExternalLink size={13} />
        </a>

        <div className="px-3.5 py-1.5 text-[10.5px] text-slate-500 font-mono font-medium">
          Currency: INR (Paise convention)
        </div>
      </div>
    </aside>
  );
};
