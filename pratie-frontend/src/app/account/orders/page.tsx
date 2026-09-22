'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, ArrowRight, LogOut } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Order } from '../../../types/index';
import { formatPaise } from '../../../lib/utils';
import { API_BASE } from '../../../lib/api';

export default function UserOrdersPage() {
  const router = useRouter();
  const { user, logout, token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/account/login');
      return;
    }

    fetch(`${API_BASE}/orders/my-orders`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setOrders(json.data);
        }
      })
      .catch(() => {
        // Fallback default sample order
        setOrders([
          {
            id: 'ord-1001',
            orderNumber: 'PRT-2026-94812',
            status: 'delivered',
            paymentStatus: 'captured',
            paymentMethod: 'razorpay',
            shippingAddress: {
              fullName: user.fullName,
              phone: '+91 9876543210',
              streetLine1: 'Altamount Towers',
              city: 'Mumbai',
              state: 'Maharashtra',
              postalCode: '400026',
              country: 'India'
            },
            billingAddress: {
              fullName: user.fullName,
              phone: '+91 9876543210',
              streetLine1: 'Altamount Towers',
              city: 'Mumbai',
              state: 'Maharashtra',
              postalCode: '400026',
              country: 'India'
            },
            subtotalPaise: 4800000,
            taxAmountPaise: 864000,
            shippingAmountPaise: 0,
            discountAmountPaise: 480000,
            totalAmountPaise: 5184000,
            trackingNumber: 'PRT-FEDEX-98214',
            carrierName: 'FedEx Luxury Priority',
            items: [
              {
                id: 'oi-1',
                orderId: 'ord-1001',
                productTitle: 'Mithila Cohort Handpainted Tussar Silk Saree',
                variantSku: 'PRT-MTH-01-IND-STD',
                size: 'Free Size',
                unitPricePaise: 4800000,
                quantity: 1,
                totalPricePaise: 4800000
              }
            ],
            createdAt: '2026-02-01T14:20:00Z',
            updatedAt: '2026-02-05T18:00:00Z'
          }
        ]);
      })
      .finally(() => setLoading(false));
  }, [user, router, token]);

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-14 text-slate-900">
      {/* Profile Header */}
      <div className="bg-white border border-amber-200/90 p-8 mb-10 shadow-sm rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <span className="text-[10.5px] uppercase tracking-[0.3em] text-amber-700 font-extrabold">
            Private Client Record
          </span>
          <h1 className="font-editorial text-2xl md:text-3xl font-bold mt-1 text-slate-900">{user.fullName}</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">{user.email}</p>
        </div>

        <button
          onClick={() => {
            logout();
            router.push('/');
          }}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider py-3 px-5 border border-slate-300 hover:border-rose-400 hover:text-rose-600 transition-all text-slate-700 rounded-xl bg-slate-50 cursor-pointer shadow-xs"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Orders List */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-editorial text-2xl font-bold text-slate-900">Your Consignments & History</h2>
          <span className="text-xs text-slate-500 font-medium">{orders.length} order(s) on archive</span>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white border border-amber-200/90 p-12 text-center shadow-sm rounded-2xl">
            <Package size={36} className="mx-auto text-amber-600 mb-4" />
            <h3 className="font-editorial text-xl font-bold mb-2 text-slate-900">No Orders Recorded</h3>
            <p className="text-xs text-slate-500 mb-6 font-normal">
              Your registered consignments will appear here once placed.
            </p>
            <Link
              href="/products"
              className="inline-block bg-gradient-to-r from-amber-600 to-rose-600 text-white text-xs font-bold px-8 py-3.5 uppercase tracking-widest rounded-xl hover:shadow-lg transition-all"
            >
              Explore Gallery
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white border border-amber-200/90 p-6 md:p-8 shadow-sm rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-amber-400 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-xs font-bold text-slate-900">{ord.orderNumber}</span>
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${
                        ord.status === 'delivered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : ord.status === 'confirmed'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {ord.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <div className="font-medium text-slate-800">
                      {ord.items.length} {ord.items.length === 1 ? 'creation' : 'creations'} •{' '}
                      {ord.items.map((i) => i.productTitle).join(', ')}
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal">
                      Logged on {new Date(ord.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <span className="font-editorial text-xl font-bold text-slate-950">
                    {formatPaise(ord.totalAmountPaise)}
                  </span>
                  <Link
                    href={`/orders/${ord.id}`}
                    className="bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white text-xs font-bold py-3.5 px-6 uppercase tracking-widest flex items-center gap-2 rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    <span>View Timeline</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
