'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  MapPin,
  Scissors,
  Star,
  Search,
  Award,
  Truck,
  RotateCcw,
  CheckCircle2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  Layers,
  Clock
} from 'lucide-react';
import { Product } from '../types/index';
import { fetchProducts, FALLBACK_PRODUCTS } from '../lib/api';
import { ProductCard } from '../components/products/ProductCard';
import { STATE_CRAFTS_DIRECTORY, REGIONS_LIST, StateCraft } from '../lib/stateCraftsData';
import { toast } from 'sonner';

// Taneira-Style Iconic Weave Bubbles
const ICONIC_WEAVES = [
  {
    title: 'Banarasi',
    state: 'Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
    link: '/products?search=Banarasi'
  },
  {
    title: 'Kanjeevaram',
    state: 'Tamil Nadu',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80',
    link: '/products?search=Kanjeevaram'
  },
  {
    title: 'Mithila Haat',
    state: 'Bihar',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
    link: '/products?search=Mithila'
  },
  {
    title: 'Chikankari',
    state: 'Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
    link: '/products?search=Chikankari'
  },
  {
    title: 'Kasavu',
    state: 'Kerala',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
    link: '/products?search=Kasavu'
  },
  {
    title: 'Chanderi',
    state: 'Madhya Pradesh',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
    link: '/products?search=Chanderi'
  },
  {
    title: 'Patan Patola',
    state: 'Gujarat',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
    link: '/products?search=Patola'
  },
  {
    title: 'Paithani',
    state: 'Maharashtra',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
    link: '/products?search=Paithani'
  },
  {
    title: 'Kalamkari',
    state: 'Andhra Pradesh',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80',
    link: '/products?search=Kalamkari'
  },
  {
    title: 'Pochampally',
    state: 'Telangana',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
    link: '/products?search=Pochampally'
  }
];

// Taneira-Style Panoramic Hero Slider Campaigns
const HERO_SLIDES = [
  {
    id: 1,
    badge: '✦ TANEIRA HERITAGE CURATION • 33 STATES & UTS OF BHARAT ✦',
    titlePrefix: 'State-Wise Traditional Clothes.',
    titleHighlight: 'Pure Handcrafted Sarees & Royal Suits.',
    subtitle:
      'Celebrate the living cultural attire of all 28 States & 8 Union Territories — from Uttar Pradesh’s Banarasi silks & Tamil Nadu’s Kanjeevarams to Lucknow’s Royal Chikankari & Assam’s Golden Muga. Handcrafted directly by generational master state artisans.',
    primaryCtaText: 'Explore 33 States Attire',
    primaryCtaLink: '#weaves-matrix',
    secondaryCtaText: 'Traditional Sarees',
    secondaryCtaLink: '/products?clothingType=Saree',
    tertiaryCtaText: 'Royal Suits & Sets',
    tertiaryCtaLink: '/products?clothingType=Suit',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1800&q=90',
    featuredCraft: 'GI-Certified Handloom Archive'
  },
  {
    id: 2,
    badge: '★ SOVEREIGN IMPERIAL WEAVES • VARANASI & KANCHIPURAM ★',
    titlePrefix: 'Tested Real Gold Zari Brocades.',
    titleHighlight: 'Kashi Kadwa & Kanjeevaram Temple Silks.',
    subtitle:
      'Woven on ancient wooden pitlooms over 120 meditative artisan hours with certified Mulberry silks and pure silver-gold zari. Marked with Silk Mark and GI verification tags.',
    primaryCtaText: 'Explore Pure Silk Sarees',
    primaryCtaLink: '/products?clothingType=Saree',
    secondaryCtaText: 'View Banarasi Edit',
    secondaryCtaLink: '/products?search=Banarasi',
    tertiaryCtaText: 'View Kanjeevarams',
    tertiaryCtaLink: '/products?search=Kanjeevaram',
    image:
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1800&q=90',
    featuredCraft: 'Tested Real Zari 3-Ply Silk'
  },
  {
    id: 3,
    badge: '🪔 ROYAL NEEDLECRAFT & NOBLE SILHOUETTES 🪔',
    titlePrefix: 'Awadhi & Kashmiri Heritage.',
    titleHighlight: 'Mukaish Chikankari & Royal Sharara Sets.',
    subtitle:
      'Delicate gossamer shadow work preserving 32 historical stitches, metallic Mukaish studs, and pure silk velvet ensembles with handspun Kashmiri Pashmina drapes.',
    primaryCtaText: 'Shop Royal Suits',
    primaryCtaLink: '/products?clothingType=Suit',
    secondaryCtaText: 'Explore Chikankari',
    secondaryCtaLink: '/products?search=Chikankari',
    tertiaryCtaText: 'Royal Shararas',
    tertiaryCtaLink: '/products?search=Sharara',
    image:
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1800&q=90',
    featuredCraft: '180-Hour Artisan Needlework'
  },
  {
    id: 4,
    badge: '🌿 SACRED AHIMSA WEAVES & NORTHEASTERN SILKS 🌿',
    titlePrefix: 'Wearable Folk Tapestries.',
    titleHighlight: 'Assam Muga Silk & Mithila Tussar Drapes.',
    subtitle:
      'The naturally golden gloss of Assam wild Muga Mekhela Chador, organic Meghalaya Ryndia peace silk, and hand-drawn Mithila nature folklore onto wild Tussar silks.',
    primaryCtaText: 'Explore Northeast Looms',
    primaryCtaLink: '/products?state=Assam',
    secondaryCtaText: 'Mekhela Chador Sets',
    secondaryCtaLink: '/products?search=Muga',
    tertiaryCtaText: 'Mithila Handpainted',
    tertiaryCtaLink: '/products?state=Bihar',
    image:
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1800&q=90',
    featuredCraft: 'Ethical Ahimsa Wild Silk'
  }
];

// Taneira-Style Curated Occasion Collections
const OCCASIONS_DATA = [
  {
    id: 'bridal',
    title: 'The Royal Bridal Trousseau',
    subtitle: 'Tested Real Zari Pitloom Silks',
    tag: 'Holy Mandap & Pheras',
    count: '14 Heirloom Silks',
    search: 'Bridal',
    href: '/products?search=Bridal',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=90',
    description: 'Ancestral pitloom sarees with certified Mulberry silk and 3-ply gold zari borders for sacred wedding ceremonies.'
  },
  {
    id: 'sangeet',
    title: 'Sangeet & Festive Soirée',
    subtitle: 'Twirling Shararas & Royal Anarkalis',
    tag: 'Sangeet & Mehendi',
    count: '12 Festive Ensembles',
    search: 'Sharara',
    href: '/products?search=Sharara',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=90',
    description: 'Awadhi Mukaish needlework, flared Georgette ghararas, and hand-embroidered regal silk kurtas.'
  },
  {
    id: 'pooja',
    title: 'Morning Temple & Puja Sanctum',
    subtitle: 'Sacred Kasavu & Ahimsa Drapes',
    tag: 'Auspicious Rituals',
    count: '10 Sacred Weaves',
    search: 'Kasavu',
    href: '/products?search=Kasavu',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=90',
    description: 'Unbleached handspun Kerala Kasavu with pure gold thread, Mithila Tussar, and peaceful Ahimsa drapes.'
  },
  {
    id: 'cocktail',
    title: 'Cocktail & Evening Gala',
    subtitle: 'Diaphanous Chanderi & Jamdani',
    tag: 'Reception & Soirée',
    count: '10 Sheer Masterpieces',
    search: 'Chanderi',
    href: '/products?search=Chanderi',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=90',
    description: 'Light-as-air tissue silks, gossamer Chanderi organza, and narrative Baluchari conversation pieces.'
  }
];

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

  // Filtered products for the Taneira "Trending Now & Masterpieces" section
  const showcaseProducts = useMemo(() => {
    if (activeTab === 'saree') {
      return products.filter((p) => p.clothingType === 'Saree').slice(0, 8);
    }
    if (activeTab === 'suit') {
      return products.filter((p) => p.clothingType === 'Suit').slice(0, 8);
    }
    return products.slice(0, 8);
  }, [products, activeTab]);

  // Regional breakdown counts for 33 states
  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All Regions': STATE_CRAFTS_DIRECTORY.length };
    STATE_CRAFTS_DIRECTORY.forEach((s) => {
      counts[s.region] = (counts[s.region] || 0) + 1;
    });
    return counts;
  }, []);

  // Filtered states for the 33 States Weaves Matrix
  const filteredStates = useMemo(() => {
    if (selectedRegion === 'All Regions') return STATE_CRAFTS_DIRECTORY;
    return STATE_CRAFTS_DIRECTORY.filter((s) => s.region === selectedRegion);
  }, [selectedRegion]);

  const currentSlide = HERO_SLIDES[activeSlide];

  return (
    <div className="flex flex-col gap-14 sm:gap-20">
      {/* 1. TANEIRA PANORAMIC HERO BANNER SLIDER */}
      <section className="relative overflow-hidden bg-[#1f070b] text-white">
        <div className="relative min-h-[580px] sm:min-h-[660px] lg:min-h-[720px] flex items-center justify-center">
          {/* Background Image with Cinematic Dark Gradient */}
          <div className="absolute inset-0 transition-all duration-1000">
            <Image
              src={currentSlide.image}
              alt={currentSlide.titleHighlight}
              fill
              priority
              className="object-cover object-center brightness-75 scale-100 transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#140406] via-[#140406]/55 to-[#140406]/35" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#140406]/85 via-transparent to-[#140406]/80" />
          </div>

          {/* Hero Content Overlay */}
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-20">
            {/* Top Provenance Badge */}
            <div className="inline-flex items-center gap-2 bg-amber-400/20 backdrop-blur-md border border-amber-400/50 text-amber-200 px-4 py-1.5 rounded-full text-[10.5px] sm:text-[11px] font-bold mb-6 shadow-sm uppercase tracking-[0.2em]">
              <Sparkles size={13} className="text-amber-300 animate-pulse" />
              <span>{currentSlide.badge}</span>
            </div>

            {/* Grand Modern Serif Headline */}
            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-[1.12] mb-6 tracking-tight">
              {currentSlide.titlePrefix} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-amber-300 font-normal italic">
                {currentSlide.titleHighlight}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-pink-100/90 font-normal leading-relaxed mb-9 max-w-3xl mx-auto">
              {currentSlide.subtitle}
            </p>

            {/* Action CTAs (Taneira Style) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto">
              <a
                href={currentSlide.primaryCtaLink}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 via-rose-600 to-pink-600 hover:from-amber-600 hover:to-pink-700 text-white font-bold text-xs px-9 py-4 rounded-full uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl transition-all cursor-pointer"
              >
                <MapPin size={15} />
                <span>{currentSlide.primaryCtaText}</span>
                <ArrowRight size={15} />
              </a>

              <Link
                href={currentSlide.secondaryCtaLink}
                className="w-full sm:w-auto bg-white/95 hover:bg-white text-slate-950 font-bold text-xs px-8 py-4 rounded-full uppercase tracking-wider shadow-md hover:scale-102 transition-all cursor-pointer text-center"
              >
                {currentSlide.secondaryCtaText}
              </Link>

              <Link
                href={currentSlide.tertiaryCtaLink}
                className="w-full sm:w-auto bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/60 font-bold text-xs px-8 py-4 rounded-full uppercase tracking-wider backdrop-blur-md transition-all cursor-pointer text-center"
              >
                {currentSlide.tertiaryCtaText}
              </Link>
            </div>
          </div>

          {/* Slider Pagination Controls */}
          <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center gap-3">
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setActiveSlide(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  activeSlide === idx
                    ? 'w-9 h-2.5 bg-amber-400'
                    : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Prev / Next Arrows */}
          <button
            onClick={() => setActiveSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 transition-all cursor-pointer hidden md:flex"
            aria-label="Previous slide"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 transition-all cursor-pointer hidden md:flex"
            aria-label="Next slide"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Taneira 5-Pillar Trust Ribbon */}
        <div className="bg-[#140406] border-t border-amber-500/20 py-4 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-4 text-left text-pink-100/90 text-xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={18} className="text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">Silk Mark Certified</span>
                <span className="text-[10px] text-amber-200/80">100% Pure Natural Fibres</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <MapPin size={18} className="text-rose-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">33 States &amp; UTs</span>
                <span className="text-[10px] text-amber-200/80">Geographical Indication</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Truck size={18} className="text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">Complimentary Delivery</span>
                <span className="text-[10px] text-amber-200/80">Insured Pan-India Transit</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Scissors size={18} className="text-pink-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">Free Fall &amp; Piko</span>
                <span className="text-[10px] text-amber-200/80">Finished Ready-To-Drape</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Sparkles size={18} className="text-amber-300 shrink-0" />
              <div>
                <span className="font-bold text-white block">Bespoke Concierge</span>
                <span className="text-[10px] text-amber-200/80">Custom Blouse Tailoring</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TANEIRA "SHOP BY ICONIC WEAVES" CIRCULAR CRAFT HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-amber-800 text-[11px] font-bold uppercase tracking-[0.22em] mb-1">
            <Sparkles size={12} className="text-amber-600" />
            <span>The Sacred Pitlooms</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl text-slate-900">
            Shop By Iconic Indian Weaves
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl mx-auto">
            Each craft represents centuries of regional devotion, hand-dyed natural yarns, and generational pitloom artistry.
          </p>
        </div>

        <div className="flex items-center gap-5 sm:gap-7 overflow-x-auto pb-4 scrollbar-none justify-start lg:justify-center">
          {ICONIC_WEAVES.map((w) => (
            <Link
              key={w.title}
              href={w.link}
              className="flex flex-col items-center gap-2.5 shrink-0 group cursor-pointer"
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-rose-500 to-pink-500 group-hover:scale-105 transition-transform duration-300 shadow-md">
                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white bg-slate-100">
                  <Image
                    src={w.image}
                    alt={w.title}
                    fill
                    className="object-cover group-hover:scale-115 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="text-center">
                <span className="text-xs font-bold text-slate-900 group-hover:text-pink-700 block leading-tight">
                  {w.title}
                </span>
                <span className="text-[10px] text-slate-500 block">{w.state}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. TANEIRA-STYLE "TRENDING NOW & MASTERPIECE LOOMS" (TABBED PRODUCT SHOWCASE) */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
          <div>
            <div className="text-amber-800 text-[11px] font-bold uppercase tracking-[0.2em] mb-1">
              Curated Masterpieces
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl text-slate-900">
              Trending Looms &amp; New Arrivals
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Handpicked from master weaver clusters across India. Every attire is authentic, certified, and ready for your celebration.
            </p>
          </div>

          {/* Filter Tabs (Taneira Style) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { label: 'All Masterpieces', value: 'all' },
              { label: 'Pure Silk Sarees', value: 'saree' },
              { label: 'Royal Suits & Sets', value: 'suit' }
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value as any)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.value
                    ? 'bg-[#4a0d18] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
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

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-900 hover:border-pink-700 hover:text-pink-700 font-bold text-xs px-8 py-3.5 rounded-full uppercase tracking-wider transition-all shadow-xs cursor-pointer"
          >
            <span>View Complete 46-Piece Catalog</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* 4. TANEIRA FESTIVE PROMO VOUCHER BANNER */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="bg-gradient-to-r from-[#4a0d18] via-rose-900 to-amber-900 rounded-3xl p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-amber-500/20">
          <div className="text-center md:text-left">
            <div className="inline-block bg-amber-400/20 text-amber-200 font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full mb-2.5">
              Festive Season Privilege
            </div>
            <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-white">
              Flat 15% Off Your First Heritage Commission
            </h3>
            <p className="text-xs sm:text-sm text-pink-100/90 mt-1.5 max-w-xl">
              Enjoy 15% off across all pure silk Sarees, Awadhi Anarkalis, Sharara sets, and handwoven stoles.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/15 p-2.5 rounded-2xl border border-white/30 backdrop-blur-md">
            <div className="px-5 py-2 font-mono font-bold text-lg sm:text-xl tracking-widest text-amber-300">
              FESTIVE15
            </div>
            <button
              onClick={copyCouponCode}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              {copiedCoupon ? <Check size={14} className="text-emerald-950" /> : <Copy size={14} />}
              <span>{copiedCoupon ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5. TANEIRA "SHOP BY OCCASION & TROUSSEAU" EDITORIAL GRID */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-amber-800 text-[11px] font-bold uppercase tracking-[0.25em] mb-2 px-3 py-1 rounded-full bg-amber-50/80 border border-amber-200/60">
            <Sparkles size={12} className="text-amber-600" />
            <span>Curated Celebrations</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-slate-900">
            Shop By Occasion &amp; Trousseau
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl mx-auto">
            From the sanctified wedding mandap to festive sangeet evenings, discover certified handlooms tailored for your most cherished milestones.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {OCCASIONS_DATA.map((occ) => (
            <Link
              key={occ.id}
              href={occ.href}
              className="group relative rounded-t-[54px] sm:rounded-t-[64px] rounded-b-3xl overflow-hidden aspect-[3/4.2] shadow-md hover:shadow-2xl hover:ring-2 hover:ring-[#c9a64e]/80 transition-all duration-500 bg-slate-950 flex flex-col justify-between p-6 text-left"
            >
              {/* Image with smooth zoom */}
              <Image
                src={occ.image}
                alt={occ.title}
                fill
                className="object-cover opacity-85 group-hover:scale-108 group-hover:opacity-95 transition-all duration-700"
              />
              {/* Rich gradient overlay for impeccable contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20" />

              {/* Top Bar: Occasion Tag & Count */}
              <div className="relative z-10 flex items-center justify-between gap-2">
                <span className="bg-black/60 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  {occ.tag}
                </span>
                <span className="bg-white/15 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/20">
                  {occ.count}
                </span>
              </div>

              {/* Bottom Card Content */}
              <div className="relative z-10 text-white">
                <span className="text-amber-400 text-[10px] font-bold uppercase tracking-widest block mb-1">
                  {occ.subtitle}
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold leading-tight group-hover:text-amber-200 transition-colors mb-2">
                  {occ.title}
                </h3>
                <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed mb-4">
                  {occ.description}
                </p>

                {/* Explore Pill Button */}
                <div className="inline-flex items-center gap-2 text-[11px] font-bold text-slate-900 bg-amber-400 group-hover:bg-amber-300 px-4 py-2 rounded-full transition-all duration-300 shadow-sm">
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
        {/* Spotlight Feature: State Weave of the Week (Assam Muga Silk) */}
        <div className="bg-[#faf8f5] border border-amber-900/15 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden mb-12">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-10">
            {/* Left: Image with Arch Frame & Silk Mark Ribbon */}
            <div className="w-full lg:w-5/12 shrink-0">
              <div className="relative rounded-t-[48px] rounded-b-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/11] border-2 border-amber-300/60 shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=85"
                  alt="Assam Golden Muga Mekhela Chador"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 bg-[#4a0d18] text-amber-200 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-amber-400/30 flex items-center gap-1.5 shadow-md">
                  <Award size={13} className="text-amber-400" />
                  <span>GI Tagged #56 • Silk Mark Certified</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-xs font-mono text-amber-300 font-bold">Assam Weavers Guild</div>
                  <div className="font-heading text-lg font-bold">Golden Muga Mekhela Chador</div>
                </div>
              </div>
            </div>

            {/* Right: Editorial Narrative */}
            <div className="w-full lg:w-7/12 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-1.5 bg-[#4a0d18]/10 text-[#4a0d18] font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full mb-3 border border-[#4a0d18]/20">
                <Compass size={12} className="text-[#4a0d18]" />
                <span>State Craft of the Week • Brahmaputra Valley</span>
              </div>

              <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-tight">
                Assam: The Living Golden Thread of Sualkuchi
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                Known as the pride of Northeast India, Assam’s wild <strong>Muga Silk</strong> is spun from cocoons endemic solely to the Brahmaputra basin. With every hand-wash, its amber-golden lustre naturally intensifies rather than fading, surviving as an heirloom drape across three generations.
              </p>

              {/* Master Cluster Micro-Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full my-5 py-3 border-y border-amber-900/10 text-slate-800">
                <div>
                  <div className="text-[10px] uppercase font-extrabold text-amber-800 tracking-wider">Cluster</div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">Sualkuchi Guilds</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-extrabold text-amber-800 tracking-wider">Weaving Technique</div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">Ahimsa Wild Pitloom</div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <div className="text-[10px] uppercase font-extrabold text-amber-800 tracking-wider">Longevity</div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">100+ Years Heirloom</div>
                </div>
              </div>

              {/* Quick CTAs */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/products?state=Assam"
                  className="inline-flex items-center gap-2 bg-[#4a0d18] hover:bg-[#5e111f] text-white text-xs font-bold px-6 py-3 rounded-full transition-all shadow-sm"
                >
                  <span>Explore Assam Looms</span>
                  <ArrowRight size={13} />
                </Link>
                <Link
                  href="/products?search=Muga"
                  className="inline-flex items-center gap-2 bg-white hover:bg-amber-50 text-slate-800 border border-slate-300 text-xs font-bold px-5 py-3 rounded-full transition-all"
                >
                  <span>Mekhela Chador Sets</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 33 States Matrix Title & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-amber-800 text-[11px] font-bold uppercase tracking-[0.2em] mb-1">
              <MapPin size={13} className="text-pink-600" />
              <span>National Handloom Archive • 33 States &amp; UTs</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl text-slate-900">
              The 33 States &amp; UTs Traditional Craft Matrix
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Every state of India possesses an ancestral weaving lineage. Select a region or click any state to explore verified traditional attire.
            </p>
          </div>

          {/* Regional Selector Tabs with Live Item Counts */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
            {REGIONS_LIST.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  selectedRegion === reg
                    ? 'bg-[#4a0d18] text-white shadow-xs ring-1 ring-amber-400/40'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-pink-50 hover:text-pink-700'
                }`}
              >
                <span>{reg}</span>
                <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  selectedRegion === reg ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {regionCounts[reg] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* States Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {filteredStates.map((st: StateCraft) => {
            const isBihar = st.name.toLowerCase() === 'bihar';

            return isBihar ? (
              <Link
                key={st.slug}
                href={`/products?state=${encodeURIComponent(st.name)}`}
                className="group rounded-2xl bg-white border-2 border-amber-400 hover:border-[#4a0d18] shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-between text-left overflow-hidden ring-4 ring-amber-400/15"
              >
                {/* Visual Image Header */}
                <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-900">
                  <Image
                    src={st.image}
                    alt={st.featuredWear || st.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {/* Atmospheric gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="text-[9.5px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-200 border border-amber-400/40 tracking-wider">
                      {st.region}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wide shadow-md border border-emerald-400/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span>Live Collection</span>
                    </span>
                  </div>

                  {/* Bottom Text in Image */}
                  <div className="absolute bottom-3 left-4 right-4 pointer-events-none">
                    <h3 className="font-heading text-2xl font-bold text-white tracking-wide drop-shadow-md">
                      {st.name}
                    </h3>
                    <p className="text-amber-200/95 text-xs font-serif italic line-clamp-1 drop-shadow-sm">
                      {st.featuredWear}
                    </p>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-white">
                  <div>
                    {/* Crafts as Individual Micro-Pills */}
                    <div className="flex flex-wrap gap-1 mb-2.5">
                      {st.crafts.map((craft) => (
                        <span
                          key={craft}
                          className="inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-950 border border-amber-200/80 font-sans"
                        >
                          {craft}
                        </span>
                      ))}
                    </div>

                    {/* Summary */}
                    <p className="text-[11.5px] text-slate-600 line-clamp-2 leading-relaxed mb-3">
                      {st.summary}
                    </p>
                  </div>

                  {/* Card Footer: Explore Link */}
                  <div className="pt-3 border-t border-amber-100 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-700 group-hover:text-[#4a0d18] transition-colors">
                      <span>Explore Looms</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                      Shop Now
                    </span>
                  </div>
                </div>
              </Link>
            ) : (
              <div
                key={st.slug}
                onClick={() =>
                  toast.info(`✨ ${st.name} Heritage Looms are Coming Soon! Master artisans are weaving the next release cohort.`)
                }
                className="group rounded-2xl bg-white border border-slate-200 hover:border-amber-300 shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col justify-between text-left overflow-hidden cursor-pointer"
              >
                {/* Visual Image Header with Coming Soon Overlay */}
                <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-900">
                  <Image
                    src={st.image}
                    alt={st.featuredWear || st.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {/* Atmospheric overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/30" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="text-[9.5px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-slate-200 border border-white/20 tracking-wider">
                      {st.region}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-extrabold uppercase tracking-wide border border-amber-400/40">
                      <Clock size={11} className="text-amber-400" />
                      <span>Coming Soon</span>
                    </span>
                  </div>

                  {/* Bottom Text in Image */}
                  <div className="absolute bottom-3 left-4 right-4 pointer-events-none">
                    <h3 className="font-heading text-2xl font-bold text-white tracking-wide drop-shadow-md">
                      {st.name}
                    </h3>
                    <p className="text-amber-200/90 text-xs font-serif italic line-clamp-1 drop-shadow-sm">
                      {st.featuredWear}
                    </p>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-white">
                  <div>
                    {/* Crafts as Individual Micro-Pills */}
                    <div className="flex flex-wrap gap-1 mb-2.5">
                      {st.crafts.map((craft) => (
                        <span
                          key={craft}
                          className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100/90 text-slate-700 border border-slate-200 font-sans"
                        >
                          {craft}
                        </span>
                      ))}
                    </div>

                    {/* Summary */}
                    <p className="text-[11.5px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                      {st.summary}
                    </p>
                  </div>

                  {/* Card Footer: Coming Soon Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 group-hover:bg-amber-100/80 text-amber-900 border border-amber-200 text-[11px] font-bold tracking-wide transition-colors">
                      <Clock size={12} className="text-amber-600" />
                      <span>Coming Soon</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      GI Verified
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. TANEIRA "THE MASTER WEAVER'S TALE" BRAND PROMISE BANNER */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="bg-[#1f070b] text-white rounded-3xl p-8 sm:p-14 border border-amber-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-amber-500/10 via-rose-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
              <ShieldCheck size={13} />
              <span>The Pratiè Atelier Charter</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl leading-tight text-white mb-5">
              Direct From The Pitloom. <br />
              <span className="italic font-normal text-amber-200">
                No Middlemen. No Powerloom Imitations.
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-pink-100/90 leading-relaxed mb-8">
              Every saree and suit at Pratiè is commissioned directly from generational pitloom families across 33 States &amp; Union Territories of Bharat. We guarantee verified Mulberry silks, tested pure silver &amp; gold zari, fair artisan compensation, and individual Silk Mark authentication certificates in every presentation box.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left border-t border-white/15 pt-6 mb-8">
              <div>
                <div className="font-heading text-2xl font-bold text-amber-300">33</div>
                <div className="text-[11px] text-pink-200">States &amp; UTs Crafts</div>
              </div>
              <div>
                <div className="font-heading text-2xl font-bold text-amber-300">100%</div>
                <div className="text-[11px] text-pink-200">Natural Certified Silk</div>
              </div>
              <div>
                <div className="font-heading text-2xl font-bold text-amber-300">0%</div>
                <div className="text-[11px] text-pink-200">Powerloom Duplicates</div>
              </div>
              <div>
                <div className="font-heading text-2xl font-bold text-amber-300">180h</div>
                <div className="text-[11px] text-pink-200">Avg Handloom Hours</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/products"
                className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-8 py-3.5 rounded-full uppercase tracking-wider transition-all shadow-md text-center cursor-pointer"
              >
                Shop Authentic Handlooms
              </Link>
              <a
                href="tel:+919876543210"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold text-xs px-8 py-3.5 rounded-full uppercase tracking-wider backdrop-blur-md transition-all text-center cursor-pointer"
              >
                Speak To Master Weaver Concierge
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 8. BESPOKE SAREE FINISHING & TAILORING CONCIERGE */}
      <section className="max-w-7xl mx-auto px-6 w-full pb-10">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-pink-50 text-pink-700 rounded-2xl shrink-0">
              <Scissors size={24} />
            </div>
            <div>
              <h4 className="font-heading text-base font-bold text-slate-900">
                Complimentary Fall &amp; Piko
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Every saree arrives finished, prepped, and ready to drape straight out of the luxury presentation box.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl shrink-0">
              <Sparkles size={24} />
            </div>
            <div>
              <h4 className="font-heading text-base font-bold text-slate-900">
                Pure Silk Blouse Fabric
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                0.8m to 1.0m matching unstitched pure silk blouse piece with coordinating zari border included with all sarees.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-heading text-base font-bold text-slate-900">
                Silk Mark QR Verification
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Scan the tamper-proof QR certificate on your box to authenticate the silk testing credentials.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
