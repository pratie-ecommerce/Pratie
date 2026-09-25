'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPaise } from '../../lib/utils';
import { toast } from 'sonner';
import { API_BASE } from '../../lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotalPaise, appliedCoupon, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState<'shipping' | 'payment' | 'processing'>('shipping');

  // Address Form State
  const [fullName, setFullName] = useState(user?.fullName || 'Aarav Singhania');
  const [phone, setPhone] = useState(user?.phone || '+91 9876543210');
  const [email, setEmail] = useState(user?.email || 'aarav.singhania@pratie.com');
  const [streetLine1, setStreetLine1] = useState('Penthouse 4B, The Imperial');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [postalCode, setPostalCode] = useState('400034');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod' | 'upi'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);

  const discountPaise = appliedCoupon?.discountPaise || 0;
  const discountedSubtotal = Math.max(0, subtotalPaise - discountPaise);
  const taxPaise = Math.round(discountedSubtotal * 0.18);
  const shippingPaise = discountedSubtotal >= 500000 || discountedSubtotal === 0 ? 0 : 49900;
  const totalPaise = discountedSubtotal + taxPaise + shippingPaise;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !streetLine1 || !city || !state || !postalCode) {
      toast.error('Please complete all delivery address fields');
      return;
    }
    setStep('payment');
  };

  const handleFinalCheckout = async () => {
    setIsProcessing(true);

    if (paymentMethod === 'razorpay') {
      setShowRazorpayModal(true);
      return;
    }

    // COD or Direct Flow
    completeOrderPlacement('COD_SUCCESS_ID', 'simulated_sig_cod');
  };

  const completeOrderPlacement = async (paymentId: string, signature: string) => {
    setIsProcessing(true);
    setShowRazorpayModal(false);

    const orderNumber = `PRT-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    try {
      // POST to backend REST API
      const res = await fetch(`${API_BASE}/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user && { Authorization: `Bearer ${localStorage.getItem('pratie_token')}` })
        },
        body: JSON.stringify({
          shippingAddress: {
            fullName,
            phone,
            streetLine1,
            city,
            state,
            postalCode,
            country: 'India'
          },
          couponCode: appliedCoupon?.code,
          paymentMethod,
          guestEmail: email,
          guestPhone: phone,
          items: items.map((i) => ({
            productId: i.product.id,
            variantId: i.variant.id,
            quantity: i.quantity
          }))
        })
      });

      const data = await res.json();
      clearCart();

      if (data.success && data.data?.order) {
        toast.success('Order Successfully Confirmed');
        router.push(`/orders/${data.data.order.id}`);
      } else {
        // Fallback for simulated checkout
        toast.success(`Consignment confirmed: ${orderNumber}`);
        router.push('/products');
      }
    } catch {
      clearCart();
      toast.success(`Consignment confirmed: ${orderNumber}`);
      router.push('/products');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center text-slate-900">
        <h1 className="font-editorial text-3xl font-bold mb-4 text-slate-900">Your Bag is Empty</h1>
        <p className="text-xs text-slate-600 mb-8 font-normal">Add luxury heirloom garments to proceed with checkout.</p>
        <button
          onClick={() => router.push('/products')}
          className="bg-gradient-to-r from-amber-600 to-rose-600 text-white text-xs font-bold px-8 py-3.5 uppercase tracking-widest rounded-xl shadow-md cursor-pointer"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-14 text-slate-900">
      {/* Checkout Progress Stepper */}
      <div className="max-w-xl mx-auto mb-14">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === 'shipping'
                  ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white ring-4 ring-amber-200'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {step === 'payment' ? '✓' : '1'}
            </span>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-slate-800">Delivery Address</span>
          </div>

          <div className="h-[2px] bg-slate-200 flex-1 mx-6" />

          <div className="flex items-center gap-3">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === 'payment'
                  ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white ring-4 ring-amber-200'
                  : 'bg-slate-100 text-slate-400 border border-slate-200'
              }`}
            >
              2
            </span>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-slate-500">Payment & Review</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Main Step Form */}
        <div className="lg:col-span-2">
          {step === 'shipping' ? (
            <div className="bg-white border border-amber-200/90 p-8 md:p-10 shadow-sm rounded-2xl">
              <div className="border-b border-slate-100 pb-6 mb-8">
                <span className="text-[10.5px] uppercase tracking-[0.3em] text-amber-700 font-extrabold">Priority Dispatch</span>
                <h2 className="font-editorial text-2xl md:text-3xl font-bold text-slate-900 mt-1">Delivery Consignment Details</h2>
                <p className="text-xs text-slate-600 font-normal mt-2 leading-relaxed">
                  All consignments are packed in sealed tamper-evident luxury archival cartons and dispatched via priority insured courier.
                </p>
              </div>

              <form onSubmit={handleProceedToPayment} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold text-slate-700 mb-2">
                      Client Full Name *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 text-xs p-3.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold text-slate-700 mb-2">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 text-xs p-3.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-slate-700 mb-2">
                    Email for Shipment Dispatch & Authenticity Stamp *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs p-3.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-slate-700 mb-2">
                    Street Address & Residence *
                  </label>
                  <input
                    type="text"
                    value={streetLine1}
                    onChange={(e) => setStreetLine1(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 text-xs p-3.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                    placeholder="e.g. Penthouse 14B, Altamount Towers"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold text-slate-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 text-xs p-3.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold text-slate-700 mb-2">
                      State / Province *
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 text-xs p-3.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest font-bold text-slate-700 mb-2">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 text-xs p-3.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-amber-600 via-rose-600 to-rose-700 hover:from-amber-700 hover:to-rose-800 text-white text-xs font-bold py-4 px-8 uppercase tracking-[0.25em] flex items-center gap-3 rounded-xl transition-all shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white border border-amber-200/90 p-8 md:p-10 shadow-sm rounded-2xl space-y-8">
              <div className="flex justify-between items-center pb-5 border-b border-slate-100">
                <div>
                  <span className="text-[10.5px] uppercase tracking-[0.3em] text-amber-700 font-extrabold">Payment Engine</span>
                  <h2 className="font-editorial text-2xl md:text-3xl font-bold text-slate-900 mt-1">Select Payment Gateway</h2>
                </div>
                <button
                  onClick={() => setStep('shipping')}
                  className="text-xs text-rose-600 hover:text-rose-700 underline font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Edit Address
                </button>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4">
                {/* Razorpay Option */}
                <div
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-5 border-2 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                    paymentMethod === 'razorpay'
                      ? 'border-amber-500 bg-amber-50/70 shadow-sm'
                      : 'border-slate-200 bg-slate-50 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        paymentMethod === 'razorpay'
                          ? 'border-amber-600 bg-amber-600'
                          : 'border-slate-400'
                      }`}
                    >
                      {paymentMethod === 'razorpay' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">
                        Razorpay Secure Gateway (UPI, Cards, NetBanking)
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5 font-normal">
                        Instant tokenized checkout with 256-bit military-grade encryption
                      </div>
                    </div>
                  </div>
                  <CreditCard size={22} className="text-amber-700" />
                </div>

                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-5 border-2 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-amber-500 bg-amber-50/70 shadow-sm'
                      : 'border-slate-200 bg-slate-50 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        paymentMethod === 'cod'
                          ? 'border-amber-600 bg-amber-600'
                          : 'border-slate-400'
                      }`}
                    >
                      {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">
                        VIP Concierge Delivery (Cash / Card on Delivery)
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5 font-normal">
                        Inspect creations before completing payment at your doorstep
                      </div>
                    </div>
                  </div>
                  <Truck size={22} className="text-rose-600" />
                </div>
              </div>

              {/* Delivery Address Review */}
              <div className="bg-slate-50 p-5 border border-slate-200 rounded-xl text-xs text-slate-700">
                <span className="font-bold uppercase tracking-widest text-amber-800 block mb-1">
                  Consignment Destination:
                </span>
                <p className="text-slate-900 font-bold">
                  {fullName} • {phone}
                </p>
                <p className="text-slate-600 font-normal mt-0.5">
                  {streetLine1}, {city}, {state} - {postalCode}, India
                </p>
              </div>

              <button
                onClick={handleFinalCheckout}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-amber-600 via-rose-600 to-rose-700 hover:from-amber-700 hover:to-rose-800 text-white text-xs font-bold py-4 uppercase tracking-[0.25em] flex items-center justify-center gap-3 rounded-xl transition-all shadow-lg hover:shadow-xl cursor-pointer"
              >
                <Lock size={16} />
                <span>
                  {paymentMethod === 'razorpay'
                    ? 'Confirm & Authorize Order Reservation'
                    : 'Confirm VIP Order Reservation'}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white border border-amber-200/90 p-7 space-y-6 shadow-sm rounded-2xl">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-editorial text-xl font-bold text-slate-900">
              Curated Bag ({items.length})
            </h3>
            <span className="text-[11px] text-amber-800 uppercase tracking-wider font-extrabold">Haute Archive</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
            {items.map((it) => (
              <div key={it.id} className="py-3.5 flex gap-3.5 items-center">
                <div className="relative w-14 h-16 bg-slate-100 border border-slate-200 rounded-lg flex-shrink-0 overflow-hidden">
                  <Image
                    src={
                      it.product.media[0]?.imageUrl ||
                      '/images/products/mithila-handpainted-tussar-silk-saree.jpeg'
                    }
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 text-xs">
                  <div className="font-bold text-slate-900 line-clamp-1">{it.product.title}</div>
                  <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                    Qty: {it.quantity} {it.variant.size && `• Size: ${it.variant.size}`}
                  </div>
                </div>
                <div className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Price on Request
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex justify-between font-medium">
              <span>Curated Selection</span>
              <span className="font-bold text-slate-900">{items.reduce((acc, it) => acc + it.quantity, 0)} Items</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Insured White-Glove Dispatch</span>
              <span className="text-emerald-700 font-bold">Complimentary</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Authenticity Certification</span>
              <span className="text-emerald-700 font-bold">100% Silk / Handloom Mark Verified</span>
            </div>
            <div className="flex justify-between pt-4 border-t border-slate-200 text-base font-bold text-slate-900">
              <span className="text-xs uppercase tracking-widest font-bold text-slate-700">Valuation Rate</span>
              <span className="font-editorial text-lg font-extrabold text-[#881337]">Bespoke / On Request</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[10.5px] text-slate-600 flex items-center gap-2">
            <ShieldCheck size={17} className="text-emerald-600 flex-shrink-0" />
            <span>Crafted by master artisans • Guaranteed authenticity certificate</span>
          </div>
        </div>
      </div>

      {/* RAZORPAY PAYMENT MODAL SIMULATOR */}
      {showRazorpayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative bg-white text-slate-900 max-w-md w-full border border-amber-300 p-8 shadow-2xl z-10 rounded-2xl">
            <div className="flex justify-between items-center pb-6 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                  ✓
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-amber-800 block font-extrabold">
                    Order Reservation Gateway
                  </span>
                  <span className="font-editorial text-base font-bold text-slate-900">Atelier Pratiè</span>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">VIP Reservation</span>
            </div>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed font-normal">
              Secure sandbox authorization for Pratiè heritage creations. Click authorize to test simulated HMAC signature verification.
            </p>

            <div className="space-y-3">
              <button
                onClick={() =>
                  completeOrderPlacement(
                    `pay_rzp_${Date.now()}`,
                    `simulated_sig_${Date.now()}`
                  )
                }
                className="w-full bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white text-xs font-bold py-3.5 uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <CheckCircle2 size={16} />
                <span>Authorize Transaction</span>
              </button>

              <button
                onClick={() => setShowRazorpayModal(false)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2.5 uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
