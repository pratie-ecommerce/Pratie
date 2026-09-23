'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Scissors,
  ChevronLeft,
  ChevronRight,
  Clock,
  Check,
  Copy,
  Award
} from 'lucide-react';
import { Product } from '../types/index';
import { fetchProducts, FALLBACK_PRODUCTS } from '../lib/api';
import { ProductCard } from '../components/products/ProductCard';
import { STATE_CRAFTS_DIRECTORY, REGIONS_LIST, StateCraft } from '../lib/stateCraftsData';
import { ICONIC_WEAVES, HERO_SLIDES, OCCASIONS_DATA } from '../config/site-config';
import { toast } from 'sonner';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<'all' | 'saree' | 'suit'>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('All Regions');
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  useEffect(() => {
    fetchProducts({ limit: '46' }).then((res) => {
      if (res.products && res.products.length > 0) {
        setProducts(res.products);
      }
    });
  }, []);

  // Automatic hero slider transition every 6.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const copyCouponCode = () => {
    navigator.clipboard.writeText('FESTIVE15');
    setCopiedCoupon(true);
    toast.success('Coupon Code FESTIVE15 copied! Apply at checkout for 15% off.');
    setTimeout(() => setCopiedCoupon(false), 3000);
  };

  // Filtered products for showcase
  const showcaseProducts = useMemo(() => {
    if (activeTab === 'saree') {
      return products.filter((p) => p.clothingType === 'Saree').slice(0, 8);
    }
    if (activeTab === 'suit') {
      return products.filter((p) => p.clothingType === 'Suit').slice(0, 8);
    }
    return products.slice(0, 8);
  }, [products, activeTab]);

  // Regional breakdown counts
  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All Regions': STATE_CRAFTS_DIRECTORY.length };
    STATE_CRAFTS_DIRECTORY.forEach((s) => {
      counts[s.region] = (counts[s.region] || 0) + 1;
    });
    return counts;
  }, []);

  // Filtered states
  const filteredStates = useMemo(() => {
    if (selectedRegion === 'All Regions') return STATE_CRAFTS_DIRECTORY;
    return STATE_CRAFTS_DIRECTORY.filter((s) => s.region === selectedRegion);
  }, [selectedRegion]);

  const currentSlide = HERO_SLIDES[activeSlide];

  return (
    <div className="flex flex-col gap-14 sm:gap-20">
      {/* 1. LUXURY EDITORIAL HERO BANNER */}
      <section className="relative overflow-hidden bg-[#0c0204] text-white border-b border-amber-500/20">
        <div className="relative min-h-[580px] sm:min-h-[660px] lg:min-h-[720px] flex items-center justify-center">
          {/* Background Image with Cinematic Dark Gradient & Amber Ambient Glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 transition-all duration-1000">
            <Image
              src={currentSlide.image}
              alt={currentSlide.titleHighlight}
              fill
              priority
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              className="brightness-[0.70] scale-100 transition-transform duration-1000 ease-out"
            />
            {/* Atmospheric gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0204] via-[#0e0204]/60 to-[#0e0204]/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0e0204]/90 via-[#0e0204]/30 to-[#0e0204]/85" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-rose-950/15 to-transparent" />
          </div>

          {/* Hero Content Overlay */}
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-20 pointer-events-auto">
            {/* Top Provenance Monogram Capsule */}
            <div className="inline-flex items-center gap-2.5 bg-black/40 backdrop-blur-md border border-amber-400/40 text-amber-200 px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-medium tracking-[0.25em] uppercase mb-6 shadow-lg">
              <Sparkles size={12} className="text-amber-300 animate-pulse" />
              <span>{currentSlide.badge}</span>
            </div>

            {/* Grand Serif Headline */}
            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl xl:text-[76px] text-white leading-[1.2] sm:leading-[1.15] mb-6 drop-shadow-md">
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-100 to-amber-300 font-normal italic font-heading pb-3 sm:pb-4 pt-1 px-1.5 -mb-2">
                {currentSlide.titlePrefix}
              </span>
              <span className="block text-white font-medium mt-1 sm:mt-1.5 leading-[1.16] pb-1">
                {currentSlide.titleHighlight}
              </span>
            </h1>

            {/* Editorial Subtitle */}
            <p className="text-sm sm:text-base text-pink-100/90 font-light leading-relaxed mb-9 max-w-xl mx-auto drop-shadow-sm">
              {currentSlide.subtitle}
            </p>

            {/* High-Fashion CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <a
                href={currentSlide.primaryCtaLink}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs px-9 py-4 rounded-full uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 shadow-xl shadow-amber-950/40 hover:scale-[1.02] transition-all cursor-pointer"
              >
                <span>{currentSlide.primaryCtaText}</span>
                <ArrowRight size={14} />
              </a>

              <Link
                href={currentSlide.secondaryCtaLink}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-amber-300/60 backdrop-blur-md font-semibold text-xs px-9 py-4 rounded-full uppercase tracking-[0.2em] transition-all cursor-pointer text-center shadow-md"
              >
                {currentSlide.secondaryCtaText}
              </Link>
            </div>
          </div>

          {/* Floating Provenance Seal on Slide (Desktop) */}
          <div className="hidden lg:flex absolute bottom-12 right-12 z-20 items-center gap-3.5 bg-black/60 backdrop-blur-xl border border-amber-400/40 px-5 py-3 rounded-2xl shadow-2xl text-left pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <div>
              <div className="text-[9.5px] uppercase font-bold text-amber-300 tracking-[0.2em]">{currentSlide.cluster}</div>
              <div className="text-xs font-heading font-semibold text-white mt-0.5">{currentSlide.craft} • {currentSlide.artisanHours}</div>
            </div>
          </div>

          {/* Editorial Numeric Slide Counter (Desktop) */}
          <div className="hidden lg:flex absolute bottom-12 left-12 z-20 items-center gap-3 text-white/80 font-mono text-xs">
            <span className="text-amber-300 font-bold text-sm">0{activeSlide + 1}</span>
            <span className="w-10 h-[1.5px] bg-amber-400/60" />
            <span className="text-white/40">0{HERO_SLIDES.length}</span>
          </div>

          {/* Slider Pagination Controls */}
          <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center gap-2.5">
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setActiveSlide(idx)}
                className={`transition-all duration-500 rounded-full cursor-pointer ${
                  activeSlide === idx
                    ? 'w-10 h-2 bg-gradient-to-r from-amber-400 to-amber-300 shadow-sm shadow-amber-400/50'
                    : 'w-2.5 h-2 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Prev / Next Arrows */}
          <button
            onClick={() => setActiveSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
            className="absolute left-5 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-black/70 text-amber-200 border border-amber-400/30 backdrop-blur-md transition-all cursor-pointer hidden md:flex hover:scale-105"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
            className="absolute right-5 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-black/70 text-amber-200 border border-amber-400/30 backdrop-blur-md transition-all cursor-pointer hidden md:flex hover:scale-105"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Minimal Luxury Trust Hallmark Bar */}
        <div className="bg-[#0e0204] border-t border-amber-500/20 py-4 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-pink-100/90 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 shrink-0">
                <ShieldCheck size={16} />
              </div>
              <div>
                <span className="font-bold text-white block tracking-wide">Silk Mark Certified</span>
                <span className="text-[10px] text-amber-200/70">100% Pure Natural Fibres</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 shrink-0">
                <Award size={16} />
              </div>
              <div>
                <span className="font-bold text-white block tracking-wide">Tested Pure Zari</span>
                <span className="text-[10px] text-amber-200/70">Certified Silver &amp; Gold Threads</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-rose-400/10 border border-rose-400/30 text-rose-300 shrink-0">
                <Scissors size={16} />
              </div>
              <div>
                <span className="font-bold text-white block tracking-wide">Complimentary Fall &amp; Piko</span>
                <span className="text-[10px] text-amber-200/70">Finished Ready-To-Drape</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 shrink-0">
                <Sparkles size={16} />
              </div>
              <div>
                <span className="font-bold text-white block tracking-wide">Atelier Concierge</span>
                <span className="text-[10px] text-amber-200/70">Bespoke Blouse Tailoring</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ICONIC WEAVES STORY HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-amber-800 text-[11px] font-bold uppercase tracking-[0.22em] mb-1">
            <Sparkles size={11} className="text-amber-600" />
            <span>The Sacred Pitlooms</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl text-slate-900">
            Shop By Iconic Weaves
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Centuries of generational pitloom artistry.
          </p>
        </div>

        <div className="flex items-center gap-5 sm:gap-7 overflow-x-auto pb-4 scrollbar-none justify-start lg:justify-center">
          {ICONIC_WEAVES.map((w) => (
            <Link
              key={w.title}
              href={w.link}
              className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer"
            >
              <div className="relative w-18 h-18 sm:w-22 sm:h-22 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-rose-500 to-pink-500 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white bg-slate-100">
                  <Image
                    src={w.image}
                    alt={w.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="text-center">
                <span className="text-xs font-bold text-slate-900 group-hover:text-pink-700 block leading-tight">
                  {w.title}
                </span>
                <span className="text-[10px] text-slate-400 block">{w.state}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. TRENDING LOOMS & NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
          <div>
            <div className="text-amber-800 text-[11px] font-bold uppercase tracking-[0.2em] mb-1">
              Curated Masterpieces
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl text-slate-900">
              Trending Looms &amp; New Arrivals
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Masterpiece creations, freshly off the pitloom.
            </p>
          </div>

          {/* Minimalist Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { label: 'All', value: 'all' },
              { label: 'Sarees', value: 'saree' },
              { label: 'Suits', value: 'suit' }
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.value
                    ? 'bg-[#4a0d18] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Column Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {showcaseProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* Minimalist View All Button */}
        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 border border-slate-900 hover:border-pink-700 hover:text-pink-700 font-bold text-xs px-8 py-3 rounded-full uppercase tracking-wider transition-all shadow-xs cursor-pointer"
          >
            <span>Explore All Handlooms</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* 4. FESTIVE PRIVILEGE VOUCHER BANNER */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="bg-gradient-to-r from-[#4a0d18] via-rose-900 to-amber-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-amber-500/20">
          <div className="text-center md:text-left">
            <div className="inline-block bg-amber-400/20 text-amber-200 font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full mb-2">
              Festive Privilege
            </div>
            <h3 className="font-heading text-2xl sm:text-3xl text-white">
              Flat 15% Off Your First Commission
            </h3>
            <p className="text-xs sm:text-sm text-pink-100/80 mt-1">
              Apply code at checkout on all pure silk sarees and royal attire.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/15 p-2 rounded-2xl border border-white/25 backdrop-blur-md">
            <div className="px-4 py-1.5 font-mono font-bold text-base sm:text-lg tracking-widest text-amber-300">
              FESTIVE15
            </div>
            <button
              onClick={copyCouponCode}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              {copiedCoupon ? <Check size={13} className="text-emerald-950" /> : <Copy size={13} />}
              <span>{copiedCoupon ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5. SHOP BY OCCASION (EDITORIAL MINIMALISM) */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-amber-800 text-[11px] font-bold uppercase tracking-[0.25em] mb-1">
            <Sparkles size={11} className="text-amber-600" />
            <span>Curated Celebrations</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl text-slate-900">
            Shop By Occasion
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ancestral handlooms tailored for your most cherished milestones.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {OCCASIONS_DATA.map((occ) => (
            <Link
              key={occ.id}
              href={occ.href}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4.2] shadow-sm hover:shadow-xl transition-all duration-500 bg-slate-950 flex flex-col justify-between p-5 text-left"
            >
              <Image
                src={occ.image}
                alt={occ.title}
                fill
                className="object-cover opacity-85 group-hover:scale-105 group-hover:opacity-95 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

              {/* Top Tag & Count */}
              <div className="relative z-10 flex items-center justify-between gap-2">
                <span className="bg-black/60 backdrop-blur-md border border-amber-400/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  {occ.tag}
                </span>
                <span className="bg-white/15 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/20">
                  {occ.count}
                </span>
              </div>

              {/* Bottom Card Content */}
              <div className="relative z-10 text-white">
                <span className="text-amber-400 text-[10px] font-semibold uppercase tracking-wider block mb-1">
                  {occ.subtitle}
                </span>
                <h3 className="font-heading text-xl font-bold leading-tight group-hover:text-amber-200 transition-colors mb-3">
                  {occ.title}
                </h3>

                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-300 group-hover:text-amber-200 transition-colors">
                  <span>Explore Edit</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. THE 33 STATES & UTS TRADITIONAL WEAVES MATRIX */}
      <section id="weaves-matrix" className="max-w-7xl mx-auto px-6 w-full scroll-mt-28">
        {/* Spotlight Editorial Banner */}
        <div className="bg-[#faf8f5] border border-amber-900/10 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden mb-10">
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
            <div className="w-full lg:w-5/12 shrink-0">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] border border-amber-300/40 shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=85"
                  alt="Assam Golden Muga Mekhela Chador"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 bg-[#4a0d18] text-amber-200 text-[9.5px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-amber-400/30 flex items-center gap-1">
                  <Award size={11} className="text-amber-400" />
                  <span>GI Tagged • Silk Mark Certified</span>
                </div>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <div className="font-heading text-base font-bold">Golden Muga Mekhela Chador</div>
                  <div className="text-[11px] text-amber-300">Assam Weavers Guild</div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-7/12 flex flex-col items-start text-left">
              <div className="text-amber-800 text-[10px] font-bold uppercase tracking-widest mb-1.5">
                Craft Spotlight • Brahmaputra Valley
              </div>

              <h3 className="font-heading text-2xl sm:text-3xl text-slate-900 leading-tight">
                Assam: The Living Golden Thread
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed max-w-xl">
                Endemic exclusively to the Brahmaputra basin, wild Muga Silk’s amber-golden lustre naturally intensifies over time, surviving as an heirloom drape across three generations.
              </p>

              <div className="flex items-center gap-3 mt-5">
                <Link
                  href="/products?state=Assam"
                  className="inline-flex items-center gap-1.5 bg-[#4a0d18] hover:bg-[#5e111f] text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all shadow-xs"
                >
                  <span>Explore Assam Looms</span>
                  <ArrowRight size={12} />
                </Link>
                <Link
                  href="/products?search=Muga"
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold px-4 py-2.5 rounded-full transition-all"
                >
                  <span>Mekhela Chador</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 33 States Matrix Title & Region Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
          <div>
            <div className="text-amber-800 text-[11px] font-bold uppercase tracking-[0.2em] mb-1">
              National Handloom Archive
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl text-slate-900">
              The 33 States &amp; UTs Heritage Matrix
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Select a region to explore verified traditional attire from master weaver clusters.
            </p>
          </div>

          {/* Regional Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
            {REGIONS_LIST.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  selectedRegion === reg
                    ? 'bg-[#4a0d18] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{reg}</span>
                <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  selectedRegion === reg ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {regionCounts[reg] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Clean, Visual-First States Grid (No paragraph clutter) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredStates.map((st: StateCraft) => {
            const isBihar = st.name.toLowerCase() === 'bihar';

            return isBihar ? (
              <Link
                key={st.slug}
                href={`/products?state=${encodeURIComponent(st.name)}`}
                className="group rounded-2xl bg-white border border-amber-300 hover:border-[#4a0d18] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-left overflow-hidden ring-2 ring-amber-400/20"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <Image
                    src={st.image}
                    alt={st.featuredWear || st.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/20" />

                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-amber-200 border border-amber-400/30">
                      {st.region}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[9.5px] font-bold uppercase tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span>Live</span>
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-3 right-3 pointer-events-none">
                    <h3 className="font-heading text-xl font-bold text-white tracking-wide">
                      {st.name}
                    </h3>
                    <p className="text-amber-200/90 text-xs italic line-clamp-1">
                      {st.featuredWear}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 flex items-center justify-between bg-white border-t border-slate-100">
                  <div className="flex gap-1">
                    {st.crafts.slice(0, 2).map((craft) => (
                      <span
                        key={craft}
                        className="text-[9.5px] font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200/60"
                      >
                        {craft}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#4a0d18]">
                    <span>Explore</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ) : (
              <div
                key={st.slug}
                onClick={() =>
                  toast.info(`✨ ${st.name} Heritage Looms are Coming Soon! Master artisans are weaving the next cohort.`)
                }
                className="group rounded-2xl bg-white border border-slate-200 hover:border-amber-300 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between text-left overflow-hidden cursor-pointer"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <Image
                    src={st.image}
                    alt={st.featuredWear || st.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/20" />

                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-slate-200 border border-white/20">
                      {st.region}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-[9.5px] font-bold uppercase border border-amber-400/30">
                      <Clock size={10} className="text-amber-400" />
                      <span>Soon</span>
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-3 right-3 pointer-events-none">
                    <h3 className="font-heading text-xl font-bold text-white tracking-wide">
                      {st.name}
                    </h3>
                    <p className="text-amber-200/90 text-xs italic line-clamp-1">
                      {st.featuredWear}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 flex items-center justify-between bg-white border-t border-slate-100">
                  <div className="flex gap-1">
                    {st.crafts.slice(0, 2).map((craft) => (
                      <span
                        key={craft}
                        className="text-[9.5px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200"
                      >
                        {craft}
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Coming Soon
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. THE PRATIÈ CHARTER */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="bg-[#1f070b] text-white rounded-3xl p-8 sm:p-12 border border-amber-500/25 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-amber-500/10 via-rose-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
              <ShieldCheck size={12} />
              <span>The Pratiè Charter</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl leading-tight text-white mb-4">
              Direct From The Pitloom. <br />
              <span className="italic font-normal text-amber-200">
                No Middlemen. No Powerloom Imitations.
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-pink-100/80 leading-relaxed mb-6">
              Commissioned directly from generational pitloom families across Bharat. Pure verified silks, tested silver-gold zari, and certified Silk Mark authenticity in every box.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left border-t border-white/15 pt-5 mb-6">
              <div>
                <div className="font-heading text-xl sm:text-2xl font-bold text-amber-300">33</div>
                <div className="text-[10px] sm:text-[11px] text-pink-200">Regional Guilds</div>
              </div>
              <div>
                <div className="font-heading text-xl sm:text-2xl font-bold text-amber-300">100%</div>
                <div className="text-[10px] sm:text-[11px] text-pink-200">Certified Silk</div>
              </div>
              <div>
                <div className="font-heading text-xl sm:text-2xl font-bold text-amber-300">0%</div>
                <div className="text-[10px] sm:text-[11px] text-pink-200">Powerloom Duplicates</div>
              </div>
              <div>
                <div className="font-heading text-xl sm:text-2xl font-bold text-amber-300">180h</div>
                <div className="text-[10px] sm:text-[11px] text-pink-200">Handloom Hours</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/products"
                className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-7 py-3 rounded-full uppercase tracking-wider transition-all shadow-md text-center cursor-pointer"
              >
                Shop Authentic Handlooms
              </Link>
              <a
                href="tel:+919876543210"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold text-xs px-7 py-3 rounded-full uppercase tracking-wider backdrop-blur-md transition-all text-center cursor-pointer"
              >
                Atelier Concierge
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 8. BESPOKE FINISHING GUARANTEE */}
      <section className="max-w-7xl mx-auto px-6 w-full pb-10">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-pink-50 text-pink-700 rounded-xl shrink-0">
              <Scissors size={20} />
            </div>
            <div>
              <h4 className="font-heading text-sm sm:text-base font-bold text-slate-900">
                Ready to Drape
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Complimentary fall, pico &amp; edging finished by hand.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="font-heading text-sm sm:text-base font-bold text-slate-900">
                Pure Silk Blouse Fabric
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Coordinating pure silk blouse piece included with every saree.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="font-heading text-sm sm:text-base font-bold text-slate-900">
                Silk Mark Verification
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Tested purity seal with verifiable digital credentials.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
