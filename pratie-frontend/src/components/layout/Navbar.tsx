'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Heart,
  Search,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  MapPin,
  ChevronDown,
  ArrowRight,
  Phone,
  Store,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { STATE_CRAFTS_DIRECTORY, REGIONS_LIST, StateCraft } from '../../lib/stateCraftsData';
import { formatPaise } from '../../lib/utils';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { itemCount, subtotalPaise, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const { user } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All Regions');
  const [megaSearch, setMegaSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const filteredMegaStates = useMemo(() => {
    return STATE_CRAFTS_DIRECTORY.filter((item: StateCraft) => {
      const matchRegion = selectedRegion === 'All Regions' || item.region === selectedRegion;
      const matchQuery =
        !megaSearch.trim() ||
        item.name.toLowerCase().includes(megaSearch.toLowerCase()) ||
        item.crafts.some((c: string) => c.toLowerCase().includes(megaSearch.toLowerCase()));
      return matchRegion && matchQuery;
    });
  }, [selectedRegion, megaSearch]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-xs">
      {/* 1. TOP UTILITY ANNOUNCEMENT RIBBON */}
      <div className="bg-[#1f070b] text-amber-200/90 py-1.5 px-4 sm:px-8 text-[10px] tracking-[0.2em] uppercase font-medium flex items-center justify-between border-b border-amber-500/15">
        <div className="hidden lg:flex items-center gap-1.5 text-pink-200/80">
          <ShieldCheck size={12} className="text-amber-400" />
          <span>Silk Mark Certified Handlooms</span>
        </div>

        <div className="mx-auto flex items-center gap-2 text-center">
          <span className="text-white/90">Complimentary Pan-India Delivery</span>
          <span className="text-amber-400/50">•</span>
          <span className="text-amber-300 font-semibold">100% Authentic Handloom Purity</span>
        </div>

        <div className="hidden lg:flex items-center gap-3 text-pink-200/70 text-[9.5px]">
          <Link href="/products" className="hover:text-white transition-colors">
            Atelier Directory
          </Link>
        </div>
      </div>

      {/* 2. TANEIRA PRIMARY ROW (LOGO + PROMINENT SEARCH PILL + UTILITIES) */}
      <div className="border-b border-slate-200/90 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4 sm:gap-8">
          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-slate-800 hover:text-pink-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            aria-label="Open menu"
          >
            <Menu size={23} />
          </button>

          {/* Brand Logo */}
          <Link href="/" className="group inline-flex flex-col items-center sm:items-start shrink-0">
            <div className="brand-logo-wrap">
              <Image
                src="/images/pratie-logo.png"
                alt="Pratiè — Heritage Redefined"
                width={170}
                height={48}
                className="h-7 sm:h-10 w-auto brand-logo-img object-contain"
                priority
              />
            </div>
            <span className="text-[7.5px] sm:text-[8.5px] tracking-[0.22em] sm:tracking-[0.28em] text-amber-900/85 font-bold uppercase -mt-0.5 block whitespace-nowrap">
              wear india differently
            </span>
          </Link>

          {/* Taneira-Style Centered Prominent Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xl mx-auto relative items-center"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for Banarasi, Kanjeevaram, Kasavu, Royal Suits, Mekhela Chador..."
              className="w-full bg-[#fbf9f6] hover:bg-slate-50 focus:bg-white text-slate-900 placeholder:text-slate-400 text-xs px-5 py-3 pl-11 rounded-full border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 outline-none transition-all shadow-2xs font-sans"
            />
            <Search size={16} className="absolute left-4 text-slate-400 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-2 bg-gradient-to-r from-pink-600 to-amber-600 text-white p-1.5 rounded-full hover:scale-105 transition-transform cursor-pointer shadow-xs"
              aria-label="Submit Search"
            >
              <ArrowRight size={13} />
            </button>
          </form>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            {/* Mobile Search Trigger */}
            <Link
              href="/products"
              className="md:hidden p-2 text-slate-700 hover:text-pink-600 rounded-full"
              aria-label="Search"
            >
              <Search size={20} />
            </Link>

            {/* Account / Login - Temporarily hidden per user request */}
            {/* 
            <Link
              href={user ? '/account/orders' : '/account/login'}
              className="p-2 text-slate-700 hover:text-pink-600 hover:bg-slate-50 rounded-full transition-colors hidden sm:flex items-center gap-1.5 cursor-pointer"
              aria-label="Account"
            >
              <UserIcon size={19} />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                {user ? 'Account' : 'Login'}
              </span>
            </Link>
            */}

            {/* Wishlist */}
            <Link
              href="/products?wishlist=true"
              className="relative p-2 text-slate-700 hover:text-pink-600 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart size={19} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-rose-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Bag Pill Button (Taneira Style) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-[#4a0d18] hover:bg-rose-900 text-white px-3.5 sm:px-4 py-2 rounded-full transition-all shadow-sm cursor-pointer"
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={17} className="text-amber-200" />
              <span className="text-xs font-bold font-sans">
                {itemCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. TANEIRA SECONDARY CATEGORY MENU RIBBON (WITH MULTI-COLUMN MEGA-MENUS) */}
      <nav className="hidden lg:block bg-[#faf8f5] border-b border-slate-200/80 relative">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-center gap-9 text-[11.5px] font-bold tracking-[0.16em] uppercase text-slate-800">
          {/* New In */}
          <Link
            href="/products?sort=newest"
            className="py-3 hover:text-pink-700 transition-colors flex items-center gap-1 cursor-pointer text-pink-700"
          >
            <Sparkles size={11} className="text-amber-600" />
            <span>New In</span>
          </Link>

          {/* SAREES MEGA MENU */}
          <div className="group/saree py-3">
            <Link
              href="/products?clothingType=Saree"
              className="hover:text-pink-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Sarees</span>
              <ChevronDown size={11} className="text-slate-400 group-hover/saree:rotate-180 transition-transform" />
            </Link>

            <div className="absolute top-full left-1/2 -translate-x-1/2 w-[900px] max-w-[95vw] bg-white border border-slate-200 rounded-2xl shadow-2xl p-7 opacity-0 invisible group-hover/saree:opacity-100 group-hover/saree:visible transition-all z-50 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3">
              <div className="grid grid-cols-4 gap-6 text-left">
                {/* Column 1: By Craft */}
                <div>
                  <h4 className="text-[10.5px] font-extrabold text-amber-800 uppercase tracking-widest mb-3 border-b border-amber-100 pb-1.5">
                    Shop By Craft
                  </h4>
                  <ul className="space-y-2 text-xs font-normal text-slate-700">
                    <li><Link href="/products?search=Banarasi" className="hover:text-pink-700 block transition-colors">Banarasi Katan &amp; Kadwa</Link></li>
                    <li><Link href="/products?search=Kanjeevaram" className="hover:text-pink-700 block transition-colors">Kanjeevaram Temple Silks</Link></li>
                    <li><Link href="/products?search=Chanderi" className="hover:text-pink-700 block transition-colors">Chanderi Zari Tissue</Link></li>
                    <li><Link href="/products?search=Paithani" className="hover:text-pink-700 block transition-colors">Maharashtra Royal Paithani</Link></li>
                    <li><Link href="/products?search=Patola" className="hover:text-pink-700 block transition-colors">Patan Double-Ikat Patola</Link></li>
                    <li><Link href="/products?search=Kasavu" className="hover:text-pink-700 block transition-colors">Kerala Balaramapuram Kasavu</Link></li>
                    <li><Link href="/products?search=Jamdani" className="hover:text-pink-700 block transition-colors">Dhakai Muslin Jamdani</Link></li>
                  </ul>
                </div>

                {/* Column 2: By Fabric */}
                <div>
                  <h4 className="text-[10.5px] font-extrabold text-amber-800 uppercase tracking-widest mb-3 border-b border-amber-100 pb-1.5">
                    Shop By Fabric
                  </h4>
                  <ul className="space-y-2 text-xs font-normal text-slate-700">
                    <li><Link href="/products?clothingType=Saree&search=Pure+Silk" className="hover:text-pink-700 block transition-colors">Pure Mulberry Silk</Link></li>
                    <li><Link href="/products?clothingType=Saree&search=Tussar" className="hover:text-pink-700 block transition-colors">Bhagalpur Wild Tussar</Link></li>
                    <li><Link href="/products?clothingType=Saree&search=Muga" className="hover:text-pink-700 block transition-colors">Assam Golden Muga</Link></li>
                    <li><Link href="/products?clothingType=Saree&search=Tissue" className="hover:text-pink-700 block transition-colors">Pure Zari Tissue</Link></li>
                    <li><Link href="/products?clothingType=Saree&search=Organza" className="hover:text-pink-700 block transition-colors">Silk Organza Sheers</Link></li>
                    <li><Link href="/products?clothingType=Saree&search=Georgette" className="hover:text-pink-700 block transition-colors">Hand-Dyed Pure Georgette</Link></li>
                    <li><Link href="/products?clothingType=Saree&search=Cotton" className="hover:text-pink-700 block transition-colors">Handspun Khadi &amp; Cotton</Link></li>
                  </ul>
                </div>

                {/* Column 3: By Occasion */}
                <div>
                  <h4 className="text-[10.5px] font-extrabold text-amber-800 uppercase tracking-widest mb-3 border-b border-amber-100 pb-1.5">
                    Shop By Occasion
                  </h4>
                  <ul className="space-y-2 text-xs font-normal text-slate-700">
                    <li><Link href="/products?search=Bridal" className="hover:text-pink-700 block transition-colors">The Royal Bridal Trousseau</Link></li>
                    <li><Link href="/products?search=Wedding" className="hover:text-pink-700 block transition-colors">Wedding &amp; Reception</Link></li>
                    <li><Link href="/products?search=Festive" className="hover:text-pink-700 block transition-colors">Festive Celebrations</Link></li>
                    <li><Link href="/products?search=Pooja" className="hover:text-pink-700 block transition-colors">Morning Temple &amp; Pooja</Link></li>
                    <li><Link href="/products?search=Cocktail" className="hover:text-pink-700 block transition-colors">Cocktail &amp; Evening Soirée</Link></li>
                  </ul>
                </div>

                {/* Column 4: Featured Story Card */}
                <div className="bg-gradient-to-br from-amber-50 to-pink-50 p-4 rounded-xl border border-amber-200/80 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-extrabold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full uppercase">
                      Curated Masterpiece
                    </span>
                    <h5 className="font-heading text-sm font-bold text-slate-900 mt-2">
                      Kashi Kadwa Pure Katan
                    </h5>
                    <p className="text-[11px] text-slate-600 font-normal mt-1 leading-relaxed">
                      120 hours of authentic pitloom weaving with tested real gold zari jaal.
                    </p>
                  </div>
                  <Link
                    href="/products?search=Banarasi"
                    className="text-[11px] font-bold text-pink-700 hover:text-pink-800 flex items-center gap-1 mt-3"
                  >
                    <span>View Saree Edit</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* SUITS & KURTAS MEGA MENU */}
          <div className="group/suit py-3">
            <Link
              href="/products?clothingType=Suit"
              className="hover:text-pink-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Suits &amp; Kurtas</span>
              <ChevronDown size={11} className="text-slate-400 group-hover/suit:rotate-180 transition-transform" />
            </Link>

            <div className="absolute top-full left-1/2 -translate-x-1/2 w-[820px] max-w-[95vw] bg-white border border-slate-200 rounded-2xl shadow-2xl p-7 opacity-0 invisible group-hover/suit:opacity-100 group-hover/suit:visible transition-all z-50 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3">
              <div className="grid grid-cols-3 gap-6 text-left">
                <div>
                  <h4 className="text-[10.5px] font-extrabold text-amber-800 uppercase tracking-widest mb-3 border-b border-amber-100 pb-1.5">
                    Silhouettes
                  </h4>
                  <ul className="space-y-2 text-xs font-normal text-slate-700">
                    <li><Link href="/products?search=Anarkali" className="hover:text-pink-700 block transition-colors">Floor-Length Royal Anarkalis</Link></li>
                    <li><Link href="/products?search=Sharara" className="hover:text-pink-700 block transition-colors">Ghararas &amp; Flared Shararas</Link></li>
                    <li><Link href="/products?clothingType=Suit" className="hover:text-pink-700 block transition-colors">Straight Cut Kurta Sets</Link></li>
                    <li><Link href="/products?search=Chanderi" className="hover:text-pink-700 block transition-colors">Chanderi Zari Suit Sets</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[10.5px] font-extrabold text-amber-800 uppercase tracking-widest mb-3 border-b border-amber-100 pb-1.5">
                    Craft Traditions
                  </h4>
                  <ul className="space-y-2 text-xs font-normal text-slate-700">
                    <li><Link href="/products?search=Chikankari" className="hover:text-pink-700 block transition-colors">Awadh Mukaish Chikankari</Link></li>
                    <li><Link href="/products?search=Tilla" className="hover:text-pink-700 block transition-colors">Kashmiri Tilla &amp; Aari Velvet</Link></li>
                    <li><Link href="/products?search=Phulkari" className="hover:text-pink-700 block transition-colors">Amritsari Resham Phulkari</Link></li>
                    <li><Link href="/products?search=Ajrakh" className="hover:text-pink-700 block transition-colors">Kutch Ajrakh Indigo Modal</Link></li>
                    <li><Link href="/products?search=Zardozi" className="hover:text-pink-700 block transition-colors">Shahjahanabad Zardozi Gold</Link></li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-xl border border-pink-200/80 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-extrabold bg-pink-200 text-pink-900 px-2 py-0.5 rounded-full uppercase">
                      Royal Needlework
                    </span>
                    <h5 className="font-heading text-sm font-bold text-slate-900 mt-2">
                      Awadh Chikankari Anarkali
                    </h5>
                    <p className="text-[11px] text-slate-600 font-normal mt-1 leading-relaxed">
                      Hand-drawn shadow work with metallic Mukaish studs on pure georgette.
                    </p>
                  </div>
                  <Link
                    href="/products?search=Chikankari"
                    className="text-[11px] font-bold text-pink-700 hover:text-pink-800 flex items-center gap-1 mt-3"
                  >
                    <span>Shop Royal Suits</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* SHOP BY CRAFT */}
          <div className="relative group/craft py-3">
            <button className="hover:text-pink-700 transition-colors flex items-center gap-1 cursor-pointer">
              <span>Shop By Craft</span>
              <ChevronDown size={11} className="text-slate-400 group-hover/craft:rotate-180 transition-transform" />
            </button>

            <div className="absolute top-full left-1/2 -translate-x-1/2 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 opacity-0 invisible group-hover/craft:opacity-100 group-hover/craft:visible transition-all z-50 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3">
              <div className="text-[10px] font-bold text-amber-800 uppercase tracking-widest mb-2 border-b border-slate-100 pb-1.5">
                Iconic Looms of India
              </div>
              <div className="space-y-2 text-xs font-normal text-slate-700">
                <Link href="/products?search=Banarasi" className="block hover:text-pink-700 hover:translate-x-1 transition-all">Banarasi Weaves (UP)</Link>
                <Link href="/products?search=Kanjeevaram" className="block hover:text-pink-700 hover:translate-x-1 transition-all">Kanjeevaram Silks (TN)</Link>
                <Link href="/products?search=Chanderi" className="block hover:text-pink-700 hover:translate-x-1 transition-all">Chanderi Tissue (MP)</Link>
                <Link href="/products?search=Muga" className="block hover:text-pink-700 hover:translate-x-1 transition-all">Muga Mekhela Chador (Assam)</Link>
                <Link href="/products?search=Patola" className="block hover:text-pink-700 hover:translate-x-1 transition-all">Patan Patola (Gujarat)</Link>
                <Link href="/products?search=Paithani" className="block hover:text-pink-700 hover:translate-x-1 transition-all">Royal Paithani (Maharashtra)</Link>
                <Link href="/products?search=Kalamkari" className="block hover:text-pink-700 hover:translate-x-1 transition-all">Kalamkari Tapestry (AP)</Link>
                <Link href="/products?search=Kasavu" className="block hover:text-pink-700 hover:translate-x-1 transition-all">Kasavu Zari (Kerala)</Link>
                <Link href="/products?search=Sambalpuri" className="block hover:text-pink-700 hover:translate-x-1 transition-all">Sambalpuri Ikat (Odisha)</Link>
              </div>
            </div>
          </div>

          {/* 33 STATES & UTS WEAVES (MEGA MATRIX) */}
          <div className="group/state py-3">
            <button className="hover:text-pink-700 transition-colors flex items-center gap-1.5 cursor-pointer text-amber-800">
              <MapPin size={12} className="text-pink-600" />
              <span>33 Weaves (By State)</span>
              <ChevronDown size={11} className="text-slate-400 group-hover/state:rotate-180 transition-transform" />
            </button>

            <div className="absolute top-full left-1/2 -translate-x-1/2 w-[880px] max-w-[95vw] bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 opacity-0 invisible group-hover/state:opacity-100 group-hover/state:visible transition-all z-50 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3">
              <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-amber-500" />
                  <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    All 33 States &amp; UTs Traditional Crafts Directory
                  </span>
                </div>
                <Link href="/products" className="text-pink-700 text-[11px] font-bold hover:underline">
                  Explore Full Catalog (46 Products) →
                </Link>
              </div>

              {/* Regional Tabs */}
              <div className="flex items-center gap-1 mb-3.5 overflow-x-auto pb-1">
                {REGIONS_LIST.map((reg) => (
                  <button
                    key={reg}
                    onClick={() => setSelectedRegion(reg)}
                    className={`px-3 py-1 rounded-full text-[10.5px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      selectedRegion === reg
                        ? 'bg-[#4a0d18] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-pink-50 hover:text-pink-700'
                    }`}
                  >
                    {reg}
                  </button>
                ))}
              </div>

              {/* States Grid */}
              <div className="grid grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {filteredMegaStates.map((item: StateCraft) => (
                  <Link
                    key={item.slug}
                    href={`/products?state=${encodeURIComponent(item.name)}`}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-pink-50/70 border border-slate-100 hover:border-pink-200 transition-all block group/card text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 group-hover/card:text-pink-700 text-xs">
                        {item.name}
                      </span>
                      <span className="text-[9px] text-slate-400 uppercase font-semibold">{item.region}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                      {item.crafts.join(', ')}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bridal Edit */}
          <Link href="/products?search=Bridal" className="py-3 hover:text-pink-700 transition-colors">
            Bridal Trousseau
          </Link>

          {/* Ready to Ship */}
          <Link href="/products?sort=popular" className="py-3 hover:text-pink-700 transition-colors">
            Ready To Ship
          </Link>
        </div>
      </nav>

      {/* 4. MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex flex-col items-start">
                  <Image
                    src="/images/pratie-logo.png"
                    alt="Pratiè"
                    width={140}
                    height={40}
                    className="h-8 w-auto object-contain"
                  />
                  <span className="text-[8px] tracking-[0.25em] text-amber-900/80 font-bold uppercase -mt-0.5">
                    wear india differently
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="mt-4 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search traditional clothes..."
                  className="w-full bg-slate-50 text-xs px-4 py-2.5 pl-9 rounded-full border border-slate-200 outline-none"
                />
                <Search size={14} className="absolute left-3 top-3 text-slate-400" />
              </form>

              {/* Mobile Menu Links */}
              <div className="mt-6 space-y-3 text-sm font-bold uppercase tracking-wider text-slate-800">
                <Link
                  href="/products?sort=newest"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-pink-700"
                >
                  ✦ New In
                </Link>
                <Link
                  href="/products?clothingType=Saree"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-pink-700"
                >
                  Sarees
                </Link>
                <Link
                  href="/products?clothingType=Suit"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-pink-700"
                >
                  Suits &amp; Kurtas
                </Link>
                <Link
                  href="/products?search=Bridal"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-pink-700"
                >
                  Bridal Trousseau
                </Link>
                <Link
                  href="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-pink-700"
                >
                  All 33 States Weaves
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 text-xs text-slate-500 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <ShieldCheck size={16} className="text-amber-600" />
                <span>Silk Mark Certified &amp; GI Tagged</span>
              </div>
              <p>Complimentary Pan-India Delivery</p>
              <p>Atelier Concierge: +91 98765 43210</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
