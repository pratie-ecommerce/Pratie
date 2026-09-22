'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  CheckCircle2,
  Package,
  Truck,
  Home,
  ArrowRight,
  Download,
  ShieldCheck
} from 'lucide-react';
import { Order } from '../../../types/index';
import { formatPaise } from '../../../lib/utils';
import { API_BASE } from '../../../lib/api';

export default function OrderDetailsPage() {
  const routeParams = useParams();
  const orderId = (routeParams?.id as string) || '';

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Attempt fetch from backend
    fetch(`${API_BASE}/orders/${orderId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setOrder(json.data);
        }
      })
      .catch(() => {
        // Fallback mock order if not found
        setOrder({
          id: orderId,
          orderNumber: orderId.startsWith('PRT') ? orderId : `PRT-2026-${Math.floor(10000 + Math.random() * 90000)}`,
          status: 'confirmed',
          paymentStatus: 'captured',
          paymentMethod: 'razorpay',
          shippingAddress: {
            fullName: 'Aarav Singhania',
            phone: '+91 9876543210',
            streetLine1: 'Penthouse 4B, The Imperial',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400034',
            country: 'India'
          },
          billingAddress: {
            fullName: 'Aarav Singhania',
            phone: '+91 9876543210',
            streetLine1: 'Penthouse 4B, The Imperial',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400034',
            country: 'India'
          },
          subtotalPaise: 4800000,
          taxAmountPaise: 864000,
          shippingAmountPaise: 0,
          discountAmountPaise: 480000,
          totalAmountPaise: 5184000,
          trackingNumber: 'PRT-FEDEX-94812',
          carrierName: 'FedEx White-Glove Priority',
          estimatedDelivery: '2026-03-12',
          items: [
            {
              id: 'oi-1',
              orderId,
              productTitle: 'Mithila Cohort Handpainted Tussar Silk Saree',
              variantSku: 'PRT-MTH-01-IND-STD',
              size: 'Free Size',
              colorName: 'Indigo & Natural Madder',
              unitPricePaise: 4800000,
              quantity: 1,
              totalPricePaise: 4800000,
              imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
            }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      });
  }, [orderId]);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-28 text-center text-slate-900">
        <h1 className="font-editorial text-2xl font-bold">Retrieving Atelier Consignment...</h1>
      </div>
    );
  }

  const steps = [
    { label: 'Order Confirmed', status: 'completed', icon: CheckCircle2 },
    { label: 'Atelier Preparation', status: ['processing', 'shipped', 'delivered'].includes(order.status) ? 'completed' : 'current', icon: Package },
    { label: 'Insured Transit', status: ['shipped', 'delivered'].includes(order.status) ? 'completed' : 'upcoming', icon: Truck },
    { label: 'Consignment Delivered', status: order.status === 'delivered' ? 'completed' : 'upcoming', icon: Home }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-14 text-slate-900">
      {/* Success Badge Banner */}
      <div className="bg-white text-slate-900 p-8 md:p-10 mb-10 border border-amber-200/90 rounded-2xl shadow-sm text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-[0.25em] mb-3">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>Order Confirmed & Sealed</span>
          </div>
          <h1 className="font-editorial text-3xl md:text-4xl font-bold text-slate-900">Consignment #{order.orderNumber}</h1>
          <p className="text-xs text-slate-600 mt-2 font-normal leading-relaxed max-w-lg">
            Thank you. Your bespoke piece is logged in our atelier archives and is being prepared with tamper-evident heritage packaging.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="bg-slate-100 hover:bg-slate-200 text-xs font-bold px-5 py-3.5 uppercase tracking-wider flex items-center gap-2 transition-colors flex-shrink-0 border border-slate-300 text-slate-800 rounded-xl cursor-pointer"
        >
          <Download size={15} />
          <span>Print Receipt</span>
        </button>
      </div>

      {/* Fulfillment Timeline State Machine */}
      <div className="bg-white border border-amber-200/90 rounded-2xl p-8 mb-10 shadow-sm">
        <h2 className="text-[10.5px] uppercase tracking-[0.3em] text-amber-700 font-extrabold mb-8">
          Fulfillment Lifecycle
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isCompleted = s.status === 'completed';
            const isCurrent = s.status === 'current';

            return (
              <div key={idx} className="flex flex-col items-center text-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                      : isCurrent
                      ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white ring-4 ring-amber-200 shadow-md'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  <Icon size={18} />
                </div>
                <span
                  className={`text-xs font-bold ${
                    isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-400 font-medium'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {order.trackingNumber && (
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="font-bold text-slate-900">Logistics Partner:</span> {order.carrierName || 'FedEx Luxury Priority'}
            </div>
            <div className="mt-2 sm:mt-0">
              <span className="font-bold text-slate-900">Tracking Number:</span>{' '}
              <span className="font-mono font-bold text-amber-800">{order.trackingNumber}</span>
            </div>
          </div>
        )}
      </div>

      {/* Items & Financial Summary */}
      <div className="bg-white border border-amber-200/90 rounded-2xl p-8 mb-10 divide-y divide-slate-100 shadow-sm">
        <h3 className="font-editorial text-xl font-bold text-slate-900 pb-4">Consignment Items</h3>

        <div className="py-4 space-y-4">
          {order.items.map((it) => (
            <div key={it.id} className="flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-slate-900 block">{it.productTitle}</span>
                <span className="text-slate-500 text-[11px] font-medium mt-0.5 block">
                  SKU: {it.variantSku} {it.size && `| Size: ${it.size}`} | Qty: {it.quantity}
                </span>
              </div>
              <span className="font-extrabold text-slate-900">{formatPaise(it.totalPricePaise)}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 space-y-2.5 text-xs text-slate-600">
          <div className="flex justify-between font-medium">
            <span>Subtotal</span>
            <span className="font-bold text-slate-900">{formatPaise(order.subtotalPaise)}</span>
          </div>
          {order.discountAmountPaise > 0 && (
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>Privilege Discount</span>
              <span>-{formatPaise(order.discountAmountPaise)}</span>
            </div>
          )}
          <div className="flex justify-between font-medium">
            <span>GST (18% Included)</span>
            <span className="font-bold text-slate-900">{formatPaise(order.taxAmountPaise)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Shipping</span>
            <span className="text-emerald-700 font-bold">Complimentary</span>
          </div>
          <div className="flex justify-between pt-4 border-t border-slate-200 text-base font-bold text-slate-900">
            <span className="text-xs uppercase tracking-widest font-bold text-slate-700">Total Settled</span>
            <span className="font-editorial text-2xl font-extrabold text-slate-950">{formatPaise(order.totalAmountPaise)}</span>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex justify-center">
        <Link
          href="/products"
          className="bg-gradient-to-r from-amber-600 via-rose-600 to-rose-700 hover:from-amber-700 hover:to-rose-800 text-white text-xs font-bold px-9 py-4 uppercase tracking-[0.25em] flex items-center gap-3 rounded-xl transition-all shadow-lg hover:shadow-xl cursor-pointer"
        >
          <span>Continue Exploring Creations</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
