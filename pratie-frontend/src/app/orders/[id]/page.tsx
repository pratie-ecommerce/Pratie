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
  ShieldCheck,
  Clock
} from 'lucide-react';
import { Order } from '../../../types/index';
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
          paymentStatus: 'authorized',
          paymentMethod: 'cod',
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
          subtotalPaise: 0,
          taxAmountPaise: 0,
          shippingAmountPaise: 0,
          discountAmountPaise: 0,
          totalAmountPaise: 0,
          trackingNumber: 'PRT-FEDEX-94812',
          carrierName: 'FedEx White-Glove Priority',
          estimatedDelivery: '2026-03-12',
          items: [
            {
              id: 'oi-1',
              orderId,
              productTitle: 'Cotton Saree',
              variantSku: 'PRT-COT-01',
              size: 'Free Size',
              colorName: 'Natural Indigo',
              unitPricePaise: 0,
              quantity: 1,
              totalPricePaise: 0,
              imageUrl: '/images/products/mithila-handpainted-tussar-silk-saree.jpeg'
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
    { label: 'Order Logged', status: 'completed', icon: CheckCircle2 },
    { label: 'Atelier Verification', status: 'current', icon: ShieldCheck },
    { label: 'Bespoke Packaging', status: ['processing', 'shipped', 'delivered'].includes(order.status) ? 'completed' : 'upcoming', icon: Package },
    { label: 'Insured Transit', status: ['shipped', 'delivered'].includes(order.status) ? 'completed' : 'upcoming', icon: Truck },
    { label: 'Consignment Delivered', status: order.status === 'delivered' ? 'completed' : 'upcoming', icon: Home }
  ];

  const customerName = order.shippingAddress?.fullName || 'Valued Patron';

  return (
    <div className="max-w-4xl mx-auto px-6 py-14 text-slate-900">
      {/* Success Badge Banner */}
      <div className="bg-white text-slate-900 p-8 md:p-10 mb-8 border border-amber-200/90 rounded-2xl shadow-sm text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-[0.25em] mb-3">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>Order Reserved & Logged</span>
          </div>
          <h1 className="font-editorial text-3xl md:text-4xl font-bold text-slate-900">Consignment #{order.orderNumber}</h1>
          <p className="text-xs text-slate-600 mt-2 font-normal leading-relaxed max-w-lg">
            Thank you, <strong className="text-slate-900">{customerName}</strong>. Your bespoke selection is securely registered in our atelier system.
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

      {/* Atelier Verification & Private Review Card */}
      <div className="bg-gradient-to-br from-amber-50/70 via-rose-50/20 to-white border-2 border-amber-200/90 rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#4a0d18] text-amber-300 flex items-center justify-center flex-shrink-0 shadow-md">
              <ShieldCheck size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-amber-900">
                  Consignment Under Private Review
                </span>
              </div>
              <h2 className="font-editorial text-xl font-bold text-slate-900">
                Routed to Master Curators
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
                Your order specifications, measurements, and delivery address have been securely received by our atelier. Our curatorial team will inspect the handloom weave, confirm availability, and contact you directly with your bespoke quotation and transit schedule.
              </p>
            </div>
          </div>

          <div className="text-right sm:text-right flex-shrink-0">
            <span className="inline-block bg-amber-100 text-amber-900 font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full">
              Status: In Review
            </span>
          </div>
        </div>
      </div>

      {/* Fulfillment Timeline */}
      <div className="bg-white border border-amber-200/90 rounded-2xl p-8 mb-8 shadow-sm">
        <h2 className="text-[10.5px] uppercase tracking-[0.3em] text-amber-700 font-extrabold mb-8">
          Fulfillment Lifecycle
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
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

      {/* Customer & Shipping Destination */}
      <div className="bg-white border border-amber-200/90 rounded-2xl p-8 mb-8 shadow-sm">
        <h3 className="font-editorial text-xl font-bold text-slate-900 pb-4 border-b border-slate-100">
          Consignment Destination & Recipient
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-5 text-xs">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block mb-1">
              Patron Details
            </span>
            <div className="font-bold text-slate-900">{order.shippingAddress?.fullName || customerName}</div>
            <div className="text-slate-600 mt-0.5">{order.shippingAddress?.phone || order.guestPhone || 'Phone on file'}</div>
            <div className="text-slate-600 mt-0.5">{order.guestEmail || 'Email on file'}</div>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block mb-1">
              Delivery Address
            </span>
            <div className="text-slate-800 font-medium leading-relaxed">
              {order.shippingAddress?.streetLine1}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}<br />
              {order.shippingAddress?.country || 'India'}
            </div>
          </div>
        </div>
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
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                Price on Request
              </span>
            </div>
          ))}
        </div>

        <div className="pt-4 space-y-2.5 text-xs text-slate-600">
          <div className="flex justify-between font-medium">
            <span>Curated Attire Units</span>
            <span className="font-bold text-slate-900">
              {order.items.reduce((acc, it) => acc + it.quantity, 0)} Pieces
            </span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Authenticity Guarantee</span>
            <span className="text-emerald-700 font-bold">100% Handloom Certified</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>White-Glove Insured Courier</span>
            <span className="text-emerald-700 font-bold">Complimentary</span>
          </div>
          <div className="flex justify-between pt-4 border-t border-slate-200 text-base font-bold text-slate-900">
            <span className="text-xs uppercase tracking-widest font-bold text-slate-700">Valuation Rate</span>
            <span className="font-editorial text-xl font-extrabold text-[#881337]">
              Bespoke / Quoted on Request
            </span>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/products"
          className="w-full sm:w-auto bg-[#4a0d18] hover:bg-[#3a0a13] text-white text-xs font-bold px-10 py-4 uppercase tracking-[0.2em] flex items-center justify-center gap-3 rounded-xl transition-all shadow-md cursor-pointer"
        >
          <span>Continue Exploring Creations</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
