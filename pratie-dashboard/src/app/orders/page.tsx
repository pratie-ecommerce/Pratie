'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { Order, OrderStatus } from '../../types/index';
import { formatPaise, MOCK_ORDERS, API_BASE } from '../../lib/api';
import { toast } from 'sonner';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [search, setSearch] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [newTrackingId, setNewTrackingId] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/orders`, {
      headers: { Authorization: `Bearer mock_admin_token` }
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setOrders(json.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleUpdateStatus = (orderId: string, nextStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: nextStatus,
              trackingNumber: newTrackingId || o.trackingNumber
            }
          : o
      )
    );

    // Call backend API
    fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer mock_admin_token`
      },
      body: JSON.stringify({
        status: nextStatus,
        trackingNumber: newTrackingId || undefined
      })
    }).catch(() => {});

    setEditingOrderId(null);
    setNewTrackingId('');
    toast.success(`Consignment marked as ${nextStatus.replace('_', ' ')}`);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress.fullName.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress.city.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      selectedStatusFilter === 'all' || o.status === selectedStatusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Consignment Fulfillment Pipeline</h1>
        <p className="text-xs text-gray-400 mt-1">
          Monitor order transitions from payment confirmation to dispatch and white-glove delivery.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#121418] border border-white/10 p-4 rounded-lg">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, client name, city..."
            className="w-full bg-white/5 text-xs text-white pl-9 pr-3 py-2 rounded border border-white/10 focus:outline-none focus:border-[#c5a059]"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['all', 'confirmed', 'processing', 'shipped', 'delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatusFilter(st)}
              className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                selectedStatusFilter === st
                  ? 'bg-[#c5a059] text-black'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((ord) => (
          <div
            key={ord.id}
            className="bg-[#121418] border border-white/10 rounded-lg p-6 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
          >
            {/* Left: Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-white">{ord.orderNumber}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                    ord.status === 'delivered'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : ord.status === 'shipped'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {ord.status.replace('_', ' ')}
                </span>
                <span className="text-[11px] text-gray-400">
                  {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                </span>
              </div>

              <div className="text-xs text-gray-300">
                <strong className="text-white">{ord.shippingAddress.fullName}</strong> ({ord.shippingAddress.phone}) •{' '}
                {ord.shippingAddress.streetLine1}, {ord.shippingAddress.city}, {ord.shippingAddress.state} - {ord.shippingAddress.postalCode}
              </div>

              <div className="text-xs text-gray-400">
                Items: {ord.items.map((i) => `${i.productTitle} (x${i.quantity})`).join(', ')}
              </div>

              {ord.trackingNumber && (
                <div className="text-xs text-[#c5a059] font-mono">
                  Consignment Tracking: {ord.trackingNumber} ({ord.carrierName || 'FedEx Luxury'})
                </div>
              )}
            </div>

            {/* Right: State Modifier Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto justify-between border-t lg:border-t-0 border-white/10 pt-4 lg:pt-0">
              <div className="text-right">
                <span className="text-base font-bold text-white block">
                  {formatPaise(ord.totalAmountPaise)}
                </span>
                <span className="text-[10px] text-green-400 uppercase tracking-wider">
                  Payment: {ord.paymentStatus}
                </span>
              </div>

              {editingOrderId === ord.id ? (
                <div className="flex flex-col gap-2 bg-white/5 p-3 rounded border border-white/10">
                  <input
                    type="text"
                    placeholder="Enter Tracking ID (e.g. PRT-FEDEX-123)"
                    value={newTrackingId}
                    onChange={(e) => setNewTrackingId(e.target.value)}
                    className="bg-[#1c1e24] text-xs text-white p-2 rounded border border-white/10 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateStatus(ord.id, 'shipped')}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold px-3 py-1.5 rounded"
                    >
                      Mark Shipped
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(ord.id, 'delivered')}
                      className="bg-green-600 hover:bg-green-700 text-white text-[11px] font-semibold px-3 py-1.5 rounded"
                    >
                      Mark Delivered
                    </button>
                    <button
                      onClick={() => setEditingOrderId(null)}
                      className="bg-white/10 text-gray-300 text-[11px] px-2 py-1.5 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setEditingOrderId(ord.id);
                    setNewTrackingId(ord.trackingNumber || '');
                  }}
                  className="bg-[#c5a059] hover:bg-[#dfba73] text-black text-xs font-semibold px-4 py-2.5 rounded uppercase tracking-wider transition-colors"
                >
                  Update Fulfillment
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
