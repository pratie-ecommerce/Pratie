'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, ShoppingBag, ShieldCheck, Mail, Phone } from 'lucide-react';
import { Customer } from '../../types/index';
import { formatPaise, MOCK_CUSTOMERS, API_BASE } from '../../lib/api';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/customers`, {
      headers: { Authorization: `Bearer mock_admin_token` }
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setCustomers(json.data);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Private Client Directory</h1>
        <p className="text-xs text-gray-400 mt-1">
          Monitor VIP patron profiles, cumulative lifetime spend, and consignment frequency.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by patron name, email..."
          className="w-full bg-[#121418] text-xs text-white pl-10 pr-4 py-2.5 rounded-md border border-white/10 focus:outline-none focus:border-[#c5a059]"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-[#121418] border border-white/10 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 uppercase tracking-wider text-gray-400 text-[10px] border-b border-white/10">
              <tr>
                <th className="px-6 py-3.5">Patron Client</th>
                <th className="px-6 py-3.5">Contact Details</th>
                <th className="px-6 py-3.5">Consignments</th>
                <th className="px-6 py-3.5">Lifetime Spend (INR)</th>
                <th className="px-6 py-3.5">Client Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#c5a059]/20 text-[#c5a059] font-bold flex items-center justify-center text-xs">
                        {c.fullName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{c.fullName}</div>
                        <div className="text-[10px] text-gray-400">VIP Tier: Platinum</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 space-y-0.5 text-gray-400">
                    <div className="flex items-center gap-1.5 text-xs text-white">
                      <Mail size={12} className="text-gray-400" />
                      <span>{c.email}</span>
                    </div>
                    {c.phone && (
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Phone size={11} className="text-gray-400" />
                        <span>{c.phone}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-[11px] font-semibold text-white">
                      <ShoppingBag size={12} className="text-[#c5a059]" />
                      <span>{c.ordersCount} orders</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-white">
                    {formatPaise(c.totalSpentPaise)}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(c.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
