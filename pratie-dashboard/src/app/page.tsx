'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingBag,
  AlertTriangle,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowRight,
  Package,
  CheckCircle2
} from 'lucide-react';
import { AnalyticsMetrics, Order } from '../types/index';
import { formatPaise, MOCK_METRICS, MOCK_ORDERS, API_BASE } from '../lib/api';

export default function AdminOverviewPage() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics>(MOCK_METRICS);
  const [recentOrders, setRecentOrders] = useState<Order[]>(MOCK_ORDERS);

  useEffect(() => {
    fetch(`${API_BASE}/analytics`, {
      headers: {
        Authorization: `Bearer mock_admin_token`
      }
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setMetrics(json.data.metrics);
          if (json.data.recentOrders?.length > 0) {
            setRecentOrders(json.data.recentOrders);
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Executive Atelier Overview</h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time financial performance and consignment fulfillment metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="bg-[#c5a059] hover:bg-[#dfba73] text-black text-xs font-semibold px-4 py-2.5 rounded-md uppercase tracking-wider transition-colors"
          >
            Manage Catalog
          </Link>
          <Link
            href="/orders"
            className="bg-white/10 hover:bg-white/15 text-white text-xs font-semibold px-4 py-2.5 rounded-md uppercase tracking-wider transition-colors"
          >
            Process Orders
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1: Revenue */}
        <div className="bg-[#121418] border border-white/10 p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center text-gray-400 mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold">Total Revenue (INR)</span>
            <div className="w-8 h-8 rounded-full bg-[#c5a059]/10 text-[#c5a059] flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {formatPaise(metrics.totalRevenuePaise)}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-green-400 font-medium">
            <ArrowUpRight size={13} />
            <span>+24.8% vs last month</span>
          </div>
        </div>

        {/* Metric 2: Active Orders */}
        <div className="bg-[#121418] border border-white/10 p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center text-gray-400 mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold">Active Orders</span>
            <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShoppingBag size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{metrics.activeOrders}</div>
          <div className="text-[11px] text-gray-400">In processing & transit</div>
        </div>

        {/* Metric 3: Low Stock Alerts */}
        <div className="bg-[#121418] border border-white/10 p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center text-gray-400 mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold">Low Stock Warnings</span>
            <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{metrics.lowStockProducts}</div>
          <div className="text-[11px] text-amber-400 font-medium">Restock recommended</div>
        </div>

        {/* Metric 4: Registered Clients */}
        <div className="bg-[#121418] border border-white/10 p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center text-gray-400 mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold">Private Clients</span>
            <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{metrics.totalCustomers}</div>
          <div className="text-[11px] text-purple-400 font-medium">+18 new this week</div>
        </div>
      </div>

      {/* Recent Consignments & Orders Table */}
      <div className="bg-[#121418] border border-white/10 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-white">Recent Atelier Consignments</h2>
            <p className="text-xs text-gray-400 mt-0.5">Real-time status updates from payment to fulfillment</p>
          </div>
          <Link
            href="/orders"
            className="text-xs uppercase tracking-wider text-[#c5a059] hover:underline font-semibold flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 uppercase tracking-wider text-gray-400 text-[10px] border-b border-white/10">
              <tr>
                <th className="px-6 py-3.5">Order Number</th>
                <th className="px-6 py-3.5">Client</th>
                <th className="px-6 py-3.5">Destination</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Payment</th>
                <th className="px-6 py-3.5 text-right">Total (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-white">{ord.orderNumber}</td>
                  <td className="px-6 py-4 font-medium text-white">{ord.shippingAddress.fullName}</td>
                  <td className="px-6 py-4 text-gray-400">{ord.shippingAddress.city}, {ord.shippingAddress.state}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        ord.status === 'delivered'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : ord.status === 'processing'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {ord.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-green-400 font-medium uppercase text-[10px]">
                      {ord.paymentStatus} ({ord.paymentMethod})
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-white">
                    {formatPaise(ord.totalAmountPaise)}
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
