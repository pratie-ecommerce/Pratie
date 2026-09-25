import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Award, Sparkles, MapPin, Phone, Clock, ArrowRight, Truck } from 'lucide-react';
import { STATE_CRAFTS_DIRECTORY, StateCraft } from '../../lib/stateCraftsData';

const REGION_DOTS: Record<string, string> = {
  North: 'bg-orange-500',
  South: 'bg-emerald-500',
  East: 'bg-rose-500',
  West: 'bg-purple-500',
  Central: 'bg-amber-500',
  'North-East': 'bg-cyan-500'
};

export const Footer: React.FC = () => {
  const popularStates = STATE_CRAFTS_DIRECTORY.filter((s: StateCraft) => s.isPopular).slice(0, 8);

  return (
    <footer className="bg-white text-slate-700 border-t border-slate-200 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
        {/* Col 1: Brand & Official Logo */}
        <div className="lg:col-span-2">
          <Link href="/" className="inline-block mb-4">
            <div className="brand-logo-wrap">
              <Image
                src="/images/pratie-logo.png"
                alt="Pratiè — Heritage Redefined"
                width={170}
                height={50}
                className="h-9 w-auto brand-logo-img"
              />
            </div>
            <span className="text-[8.5px] tracking-[0.28em] text-amber-900/80 font-bold uppercase -mt-0.5 block">
              wear india differently
            </span>
          </Link>
          <p className="text-xs text-slate-600 leading-relaxed font-normal mb-5 max-w-sm">
            &ldquo;Some stories are meant to be worn.&rdquo; Pratiè preserves India’s sovereign regional textile traditions—from sacred Mithila kalams and Andhra Kalamkari to Kashi pit-looms and Kanchipuram Korvai temple silks.
          </p>
          <div className="flex flex-col gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-pink-600 shrink-0" />
              <span>Flagship Atelier: 18 MG Road, Mehrauli, New Delhi</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-amber-600 shrink-0" />
              <span>Concierge: +91 98765 43210 / +91 11 4050 9000</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-emerald-600 shrink-0" />
              <span>Private Appointments: Mon – Sat (10:30 AM – 7:30 PM IST)</span>
            </div>
          </div>
        </div>

        {/* Col 2: The Saree Treasury */}
        <div>
          <h4 className="text-xs uppercase tracking-wider text-pink-700 font-bold mb-3 flex items-center gap-1.5">
            <Sparkles size={13} className="text-pink-600" />
            <span>The Saree Treasury</span>
          </h4>
          <ul className="space-y-2 text-xs text-slate-600">
            <li>
              <Link href="/products?search=Banarasi" className="hover:text-pink-600 transition-colors">
                Banarasi Katan &amp; Kadwa
              </Link>
            </li>
            <li>
              <Link href="/products?search=Kanjeevaram" className="hover:text-pink-600 transition-colors">
                Kanjeevaram Temple Silks
              </Link>
            </li>
            <li>
              <Link href="/products?state=Bihar" className="hover:text-pink-600 transition-colors">
                Mithila Handpainted Tussar
              </Link>
            </li>
            <li>
              <Link href="/products?search=Chanderi" className="hover:text-pink-600 transition-colors">
                Chanderi Tissue Silks
              </Link>
            </li>
            <li>
              <Link href="/products?search=Paithani" className="hover:text-pink-600 transition-colors">
                Maharashtra Paithani
              </Link>
            </li>
            <li>
              <Link href="/products?search=Bandhani" className="hover:text-pink-600 transition-colors">
                Kutch Bandhani &amp; Patola
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Royal Suits & Kurtas */}
        <div>
          <h4 className="text-xs uppercase tracking-wider text-amber-700 font-bold mb-3 flex items-center gap-1.5">
            <Award size={13} className="text-amber-600" />
            <span>Suits &amp; Ensembles</span>
          </h4>
          <ul className="space-y-2 text-xs text-slate-600">
            <li>
              <Link href="/products?search=Chikankari" className="hover:text-pink-600 transition-colors">
                Awadhi Chikankari Anarkalis
              </Link>
            </li>
            <li>
              <Link href="/products?search=Sharara" className="hover:text-pink-600 transition-colors">
                Regal Shararas &amp; Ghararas
              </Link>
            </li>
            <li>
              <Link href="/products?search=Tilla" className="hover:text-pink-600 transition-colors">
                Kashmiri Tilla Embroidered Kurtas
              </Link>
            </li>
            <li>
              <Link href="/products?clothingType=Suit" className="hover:text-pink-600 transition-colors">
                Chanderi Zari Suit Sets
              </Link>
            </li>
            <li>
              <Link href="/account/orders" className="hover:text-pink-600 transition-colors">
                Custom Blouse &amp; Fall Stitching
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: 33 States Index */}
        <div>
          <h4 className="text-xs uppercase tracking-wider text-emerald-700 font-bold mb-3 flex items-center gap-1.5">
            <MapPin size={13} className="text-emerald-600" />
            <span>33 States Craft Index</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-600">
            {popularStates.map((st: StateCraft) => {
              const dot = REGION_DOTS[st.region] || 'bg-pink-500';
              return (
                <li key={st.slug}>
                  <Link
                    href={`/products?state=${encodeURIComponent(st.name)}`}
                    className="hover:text-pink-600 transition-colors flex items-center gap-1.5"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                    <span>{st.name} ({st.crafts[0]})</span>
                  </Link>
                </li>
              );
            })}
            <li className="pt-1.5">
              <Link href="/products" className="text-pink-600 font-bold underline hover:text-pink-700">
                View All 33 States &amp; UTs Directory →
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Newsletter Strip */}
      <div className="max-w-7xl mx-auto px-6 py-6 border-t border-b border-slate-200 my-6 bg-gradient-to-r from-pink-50 via-amber-50 to-rose-50 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase font-bold text-pink-700 tracking-wider">
            Join Pratiè Privé Circle
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Receive exclusive bespoke handloom updates &amp; private artisanal drop previews.
          </p>
        </div>

        <div className="flex w-full md:w-auto rounded-full overflow-hidden border border-pink-300 bg-white shadow-2xs">
          <input
            type="email"
            placeholder="Enter your email address..."
            className="px-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none w-full md:w-64"
          />
          <button className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs px-5 py-2 transition-colors cursor-pointer shrink-0">
            Subscribe
          </button>
        </div>
      </div>

      {/* Authenticity Credentials */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 border-b border-slate-200">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-bold text-slate-700">AUTHENTICITY GUARANTEE:</span>
          <span className="text-emerald-700 font-bold">✦ 100% Silk Mark Certified</span>
          <span className="text-pink-700 font-bold">✦ Geographical Indication (GI) Verified</span>
          <span className="text-amber-700 font-bold">✦ Handloom Mark Certified</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span>UPI / CARDS / COD</span>
          <span>•</span>
          <span>256-BIT ENCRYPTED</span>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto px-6 pt-5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
        <div>© 2026 PRATIÈ ETHNIC ATELIER • ALL RIGHTS RESERVED.</div>
        <div className="flex gap-4 mt-3 sm:mt-0">
          <Link href="/products" className="hover:text-pink-600 transition-colors">Weaver Charter</Link>
          <Link href="/products" className="hover:text-pink-600 transition-colors">Insured Shipping</Link>
          <Link href="/products" className="hover:text-pink-600 transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};
