'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  SlidersHorizontal,
  Search,
  RotateCcw,
  Heart,
  MapPin,
  Sparkles,
  X,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Award,
  Check,
  LayoutGrid,
  Grid2X2,
  ShieldCheck,
  Tag,
  Filter
} from 'lucide-react';
import { Product } from '../../types/index';
import { fetchProducts, FALLBACK_PRODUCTS } from '../../lib/api';
import { ProductCard } from '../../components/products/ProductCard';
import { useWishlist } from '../../context/WishlistContext';
import { STATE_CRAFTS_DIRECTORY, REGIONS_LIST, StateCraft } from '../../lib/stateCraftsData';

// Taneira-Style Taxonomy Constants
const CLOTHING_TYPES = [
  { label: 'All Masterpieces', value: '' },
  { label: 'Pure Silk Sarees', value: 'Saree' },
  { label: 'Royal Suits & Sets', value: 'Suit' }
];

const FABRICS_LIST = [
  'Pure Katan Silk',
  'Muga Wild Silk',
  'Bhagalpuri Tussar',
  'Mulberry Silk',
  'Cotton-Silk Blend',
  'Chanderi Tissue',
  'Fine Muslin Jamdani',
  'Pure Cotton',
  'Georgette',
  'Handspun Khadi'
];

const OCCASIONS_LIST = [
  { label: 'The Royal Bridal Trousseau', query: 'Bridal' },
  { label: 'Sangeet & Festive Soirée', query: 'Sharara' },
  { label: 'Morning Temple & Puja', query: 'Kasavu' },
  { label: 'Cocktail & Evening Gala', query: 'Chanderi' },
  { label: 'Everyday Luxury', query: 'Cotton' }
];

const COLOR_SWATCHES = [
  { name: 'Crimson Red', hex: '#881337', query: 'red' },
  { name: 'Rani Pink', hex: '#BE185D', query: 'pink' },
  { name: 'Mustard Gold', hex: '#B45309', query: 'gold' },
  { name: 'Peacock Blue', hex: '#1E3A8A', query: 'blue' },
  { name: 'Emerald Green', hex: '#047857', query: 'green' },
  { name: 'Sandalwood Ivory', hex: '#FDF8F0', border: '#D1C7B7', query: 'ivory' },
  { name: 'Sunset Coral', hex: '#EA580C', query: 'orange' },
  { name: 'Jet Black', hex: '#18181B', query: 'black' }
];

const PRICE_BRACKETS = [
  { label: 'Under ₹15,000', min: 0, max: 1500000 },
  { label: '₹15,000 – ₹25,000', min: 1500000, max: 2500000 },
  { label: '₹25,000 – ₹40,000', min: 2500000, max: 4000000 },
  { label: 'Heirloom Luxury (₹40,000+)', min: 4000000, max: 15000000 }
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCategory = searchParams.get('category') || '';
  const initialState = searchParams.get('state') || '';
  const initialClothingType = searchParams.get('clothingType') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialCraft = searchParams.get('craft') || '';
  const initialWishlist = searchParams.get('wishlist') === 'true';

  const { wishlist } = useWishlist();

  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [, setLoading] = useState(true);

  // Filter States
  const [selectedState, setSelectedState] = useState<string>(initialState);
  const [selectedClothingType, setSelectedClothingType] = useState<string>(initialClothingType);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedCraft, setSelectedCraft] = useState<string>(initialCraft);
  const [selectedFabric, setSelectedFabric] = useState<string>('');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedPriceBracket, setSelectedPriceBracket] = useState<number | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>(initialSearch);
  const [silkMarkOnly, setSilkMarkOnly] = useState<boolean>(false);
  const [giTaggedOnly, setGiTaggedOnly] = useState<boolean>(false);
  const [festiveOffersOnly, setFestiveOffersOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(10000000); // 1,00,000 INR
  const [showWishlistOnly, setShowWishlistOnly] = useState<boolean>(initialWishlist);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [stateRegionFilter, setStateRegionFilter] = useState<string>('All Regions');
  const [craftSearchText, setCraftSearchText] = useState<string>('');
  const [gridCols, setGridCols] = useState<3 | 4>(3);

  // Accordion open/collapse states (Taneira Style)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    clothingType: true,
    craft: true,
    fabric: true,
    state: true,
    price: true,
    color: true,
    occasion: true,
    certification: true
  });

  const toggleSection = (sec: string) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  useEffect(() => {
    setSelectedState(searchParams.get('state') || '');
    setSelectedClothingType(searchParams.get('clothingType') || '');
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedCraft(searchParams.get('craft') || '');
    setSearchKeyword(searchParams.get('search') || '');
    setShowWishlistOnly(searchParams.get('wishlist') === 'true');
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    fetchProducts({ limit: '60' })
      .then((res) => {
        if (res.products && res.products.length > 0) {
          setProducts(res.products);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Distinct Craft Techniques
  const allCrafts = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => {
      if (p.craftTechnique) {
        map.set(p.craftTechnique, (map.get(p.craftTechnique) || 0) + 1);
      }
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [products]);

  const filteredCrafts = useMemo(() => {
    if (!craftSearchText.trim()) return allCrafts;
    const q = craftSearchText.toLowerCase();
    return allCrafts.filter(([name]) => name.toLowerCase().includes(q));
  }, [allCrafts, craftSearchText]);

  // Selected State Detail from Directory
  const activeStateDetail = useMemo(() => {
    if (!selectedState) return null;
    return STATE_CRAFTS_DIRECTORY.find(
      (s: StateCraft) =>
        s.name.toLowerCase() === selectedState.toLowerCase() ||
        s.slug.toLowerCase() === selectedState.toLowerCase()
    );
  }, [selectedState]);

  // Filtered States for the sidebar state selector
  const visibleStates = useMemo(() => {
    return STATE_CRAFTS_DIRECTORY.filter((s: StateCraft) => {
      if (stateRegionFilter === 'All Regions') return true;
      return s.region === stateRegionFilter;
    });
  }, [stateRegionFilter]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (showWishlistOnly) {
      const wishlistIds = new Set(wishlist.map((w) => w.id));
      list = list.filter((p) => wishlistIds.has(p.id));
    }

    if (selectedState) {
      list = list.filter(
        (p) =>
          p.state?.toLowerCase() === selectedState.toLowerCase() ||
          (activeStateDetail &&
            activeStateDetail.crafts.some((c: string) =>
              p.craftTechnique?.toLowerCase().includes(c.toLowerCase())
            ))
      );
    }

    if (selectedClothingType) {
      list = list.filter(
        (p) =>
          p.clothingType?.toLowerCase() === selectedClothingType.toLowerCase() ||
          p.title.toLowerCase().includes(selectedClothingType.toLowerCase())
      );
    }

    if (selectedCategory) {
      list = list.filter((p) => p.categoryName?.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (selectedCraft) {
      list = list.filter(
        (p) =>
          p.craftTechnique?.toLowerCase().includes(selectedCraft.toLowerCase()) ||
          p.title.toLowerCase().includes(selectedCraft.toLowerCase())
      );
    }

    if (selectedFabric) {
      const q = selectedFabric.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedOccasion) {
      const q = selectedOccasion.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          (p.craftTechnique && p.craftTechnique.toLowerCase().includes(q))
      );
    }

    if (selectedColor) {
      const q = selectedColor.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedPriceBracket !== null) {
      const bracket = PRICE_BRACKETS[selectedPriceBracket];
      if (bracket) {
        list = list.filter((p) => p.basePricePaise >= bracket.min && p.basePricePaise <= bracket.max);
      }
    } else {
      list = list.filter((p) => p.basePricePaise <= maxPriceFilter);
    }

    if (silkMarkOnly) {
      list = list.filter(
        (p) =>
          p.tags.some((t) => t.toLowerCase().includes('silk mark')) ||
          p.title.toLowerCase().includes('silk') ||
          p.description.toLowerCase().includes('silk') ||
          p.material?.toLowerCase().includes('silk')
      );
    }

    if (giTaggedOnly) {
      list = list.filter(
        (p) =>
          p.tags.some((t) => t.toLowerCase().includes('gi')) ||
          p.description.toLowerCase().includes('gi') ||
          Boolean(p.craftTechnique)
      );
    }

    if (festiveOffersOnly) {
      list = list.filter((p) => p.compareAtPricePaise && p.compareAtPricePaise > p.basePricePaise);
    }

    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          (p.state && p.state.toLowerCase().includes(q)) ||
          (p.craftTechnique && p.craftTechnique.toLowerCase().includes(q)) ||
          (p.clothingType && p.clothingType.toLowerCase().includes(q))
      );
    }

    // Taneira Sort Options
    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.basePricePaise - b.basePricePaise);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.basePricePaise - a.basePricePaise);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.ratingAverage - a.ratingAverage);
    } else if (sortBy === 'discount') {
      list.sort((a, b) => {
        const discA = a.compareAtPricePaise ? a.compareAtPricePaise - a.basePricePaise : 0;
        const discB = b.compareAtPricePaise ? b.compareAtPricePaise - b.basePricePaise : 0;
        return discB - discA;
      });
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    // 'featured' keeps curated order

    return list;
  }, [
    products,
    showWishlistOnly,
    wishlist,
    selectedState,
    activeStateDetail,
    selectedClothingType,
    selectedCraft,
    selectedFabric,
    selectedOccasion,
    selectedColor,
    selectedPriceBracket,
    maxPriceFilter,
    silkMarkOnly,
    giTaggedOnly,
    festiveOffersOnly,
    selectedCategory,
    searchKeyword,
    sortBy
  ]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedState) count++;
    if (selectedClothingType) count++;
    if (selectedCraft) count++;
    if (selectedFabric) count++;
    if (selectedOccasion) count++;
    if (selectedColor) count++;
    if (selectedPriceBracket !== null) count++;
    if (silkMarkOnly) count++;
    if (giTaggedOnly) count++;
    if (festiveOffersOnly) count++;
    if (searchKeyword) count++;
    return count;
  }, [
    selectedState,
    selectedClothingType,
    selectedCraft,
    selectedFabric,
    selectedOccasion,
    selectedColor,
    selectedPriceBracket,
    silkMarkOnly,
    giTaggedOnly,
    festiveOffersOnly,
    searchKeyword
  ]);

  const resetFilters = () => {
    setSelectedState('');
    setSelectedClothingType('');
    setSelectedCraft('');
    setSelectedFabric('');
    setSelectedOccasion('');
    setSelectedColor('');
    setSelectedPriceBracket(null);
    setSelectedCategory('');
    setSearchKeyword('');
    setSilkMarkOnly(false);
    setGiTaggedOnly(false);
    setFestiveOffersOnly(false);
    setSortBy('featured');
    setMaxPriceFilter(10000000);
    setShowWishlistOnly(false);
    router.push('/products');
  };

  return (
    <div className="bg-[#faf8f5] text-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
          <Link href="/" className="hover:text-[#4a0d18] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#4a0d18] transition-colors">Traditional Looms</Link>
          {selectedState && (
            <>
              <span>/</span>
              <span className="text-[#4a0d18] font-bold">{selectedState}</span>
            </>
          )}
          {selectedClothingType && (
            <>
              <span>/</span>
              <span className="text-[#4a0d18] font-bold">{selectedClothingType}</span>
            </>
          )}
          {selectedCraft && (
            <>
              <span>/</span>
              <span className="text-[#4a0d18] font-bold">{selectedCraft}</span>
            </>
          )}
        </div>

        {/* Taneira-Style Editorial Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e5d9c5] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#4a0d18]/10 border border-[#4a0d18]/20 text-[#4a0d18] px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest mb-2">
              <Sparkles size={12} className="text-amber-600" />
              <span>Wear India Differently • 33 States &amp; UTs</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-slate-900">
              {showWishlistOnly
                ? 'Saved Heirloom Pieces'
                : selectedState
                ? `${selectedState} Heritage Collection`
                : selectedClothingType === 'Saree'
                ? 'Pure Silk & Handcrafted Sarees'
                : selectedClothingType === 'Suit'
                ? 'Royal Suits & Festive Sets'
                : selectedCraft
                ? `${selectedCraft} Masterpiece Looms`
                : 'State-Wise Traditional Clothes'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-normal mt-1.5 max-w-2xl leading-relaxed">
              Every drape is certified with Silk Mark and GI verification, handwoven directly by generational pitloom families across Bharat.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-slate-900 font-bold">{filteredProducts.length}</strong> creations
            </span>
          </div>
        </div>

        {/* Top Control Bar: Search Bar + Grid View Switcher + Wishlist + Taneira Sort Dropdown */}
        <div className="bg-white border border-[#e5d9c5] rounded-2xl p-3 sm:p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
          {/* Quick Search Input */}
          <div className="relative w-full md:w-80">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search by state, craft, silk, weave..."
              className="w-full bg-[#faf8f5] text-xs text-slate-900 pl-10 pr-4 py-2.5 border border-[#e5d9c5] rounded-full focus:outline-none focus:border-[#4a0d18] placeholder-slate-400"
            />
            {searchKeyword && (
              <button
                onClick={() => setSearchKeyword('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end flex-wrap">
            {/* Mobile Filter Drawer Trigger */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider py-2 px-3.5 border border-[#4a0d18] text-[#4a0d18] bg-amber-50/50 rounded-full cursor-pointer"
            >
              <Filter size={13} />
              <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>

            {/* Grid Toggle: 3 vs 4 columns */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-full border border-slate-200">
              <button
                onClick={() => setGridCols(3)}
                title="Spacious 3-Column View"
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  gridCols === 3 ? 'bg-white text-[#4a0d18] shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Grid2X2 size={15} />
              </button>
              <button
                onClick={() => setGridCols(4)}
                title="Compact 4-Column View"
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  gridCols === 4 ? 'bg-white text-[#4a0d18] shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid size={15} />
              </button>
            </div>

            {/* Wishlist toggle */}
            <button
              onClick={() => setShowWishlistOnly(!showWishlistOnly)}
              className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full border transition-all cursor-pointer ${
                showWishlistOnly
                  ? 'bg-rose-700 text-white border-rose-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-rose-300'
              }`}
            >
              <Heart size={13} className={showWishlistOnly ? 'fill-white text-white' : 'text-rose-600'} />
              <span>Wishlist ({wishlist.length})</span>
            </button>

            {/* Taneira Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#faf8f5] text-xs text-slate-900 font-bold px-3.5 py-2 border border-[#e5d9c5] rounded-full focus:outline-none focus:border-[#4a0d18] shadow-2xs cursor-pointer"
              >
                <option value="featured">Featured Masterpieces</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest Additions</option>
                <option value="rating">Highest Rated</option>
                <option value="discount">Highest Discount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Selected State Provenance Banner (When a State is Picked) */}
        {activeStateDetail && (
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-amber-50 via-[#faf5ec] to-white text-slate-900 p-6 border border-amber-300/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-amber-900 text-xs uppercase tracking-wider font-extrabold mb-1">
                <Award size={14} className="text-amber-700" />
                <span>{activeStateDetail.region} Region • Geographical Indication Archive</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
                {activeStateDetail.name}
              </h2>
              <div className="flex flex-wrap items-center gap-1.5 my-2">
                <span className="text-xs text-slate-700 font-bold">Traditional Crafts:</span>
                {activeStateDetail.crafts.map((cr: string) => (
                  <span
                    key={cr}
                    className="text-[11px] bg-white border border-amber-200 text-amber-900 px-2.5 py-0.5 rounded-md font-semibold"
                  >
                    {cr}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                {activeStateDetail.description}
              </p>
            </div>

            <button
              onClick={() => setSelectedState('')}
              className="text-xs text-[#4a0d18] hover:bg-[#4a0d18] hover:text-white transition-all flex items-center gap-1 border border-[#4a0d18] px-4 py-2 rounded-full whitespace-nowrap bg-white cursor-pointer shadow-xs font-bold"
            >
              <span>View All 33 States</span>
              <ChevronRight size={13} />
            </button>
          </div>
        )}

        {/* Active Filter Chips Bar (Taneira Style) */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white border border-[#e5d9c5] rounded-xl">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Active Filters ({activeFiltersCount}):</span>

            {selectedState && (
              <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 text-xs font-bold rounded-full">
                State: {selectedState}
                <button onClick={() => setSelectedState('')} className="cursor-pointer hover:text-rose-700"><X size={12} /></button>
              </span>
            )}

            {selectedClothingType && (
              <span className="inline-flex items-center gap-1.5 bg-[#4a0d18]/10 text-[#4a0d18] border border-[#4a0d18]/20 px-3 py-1 text-xs font-bold rounded-full">
                Type: {selectedClothingType}
                <button onClick={() => setSelectedClothingType('')} className="cursor-pointer hover:text-rose-700"><X size={12} /></button>
              </span>
            )}

            {selectedCraft && (
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 text-xs font-bold rounded-full">
                Craft: {selectedCraft}
                <button onClick={() => setSelectedCraft('')} className="cursor-pointer hover:text-rose-700"><X size={12} /></button>
              </span>
            )}

            {selectedFabric && (
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 text-xs font-bold rounded-full">
                Fabric: {selectedFabric}
                <button onClick={() => setSelectedFabric('')} className="cursor-pointer hover:text-rose-700"><X size={12} /></button>
              </span>
            )}

            {selectedOccasion && (
              <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-800 border border-purple-200 px-3 py-1 text-xs font-bold rounded-full">
                Occasion: {selectedOccasion}
                <button onClick={() => setSelectedOccasion('')} className="cursor-pointer hover:text-rose-700"><X size={12} /></button>
              </span>
            )}

            {selectedColor && (
              <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 border border-slate-300 px-3 py-1 text-xs font-bold rounded-full">
                Color: {selectedColor}
                <button onClick={() => setSelectedColor('')} className="cursor-pointer hover:text-rose-700"><X size={12} /></button>
              </span>
            )}

            {selectedPriceBracket !== null && (
              <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 border border-slate-300 px-3 py-1 text-xs font-bold rounded-full">
                {PRICE_BRACKETS[selectedPriceBracket]?.label}
                <button onClick={() => setSelectedPriceBracket(null)} className="cursor-pointer hover:text-rose-700"><X size={12} /></button>
              </span>
            )}

            {silkMarkOnly && (
              <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-950 border border-amber-300 px-3 py-1 text-xs font-bold rounded-full">
                Silk Mark Certified Only
                <button onClick={() => setSilkMarkOnly(false)} className="cursor-pointer hover:text-rose-700"><X size={12} /></button>
              </span>
            )}

            {giTaggedOnly && (
              <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-950 border border-amber-300 px-3 py-1 text-xs font-bold rounded-full">
                GI Tagged Only
                <button onClick={() => setGiTaggedOnly(false)} className="cursor-pointer hover:text-rose-700"><X size={12} /></button>
              </span>
            )}

            {festiveOffersOnly && (
              <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1 text-xs font-bold rounded-full">
                Festive Offers
                <button onClick={() => setFestiveOffersOnly(false)} className="cursor-pointer hover:text-rose-700"><X size={12} /></button>
              </span>
            )}

            {searchKeyword && (
              <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 border border-slate-300 px-3 py-1 text-xs font-bold rounded-full">
                &ldquo;{searchKeyword}&rdquo;
                <button onClick={() => setSearchKeyword('')} className="cursor-pointer hover:text-rose-700"><X size={12} /></button>
              </span>
            )}

            <button
              onClick={resetFilters}
              className="text-xs text-[#4a0d18] hover:underline font-bold cursor-pointer ml-auto flex items-center gap-1"
            >
              <RotateCcw size={11} />
              <span>Clear All</span>
            </button>
          </div>
        )}

        {/* 2-Column Layout: Taneira Multi-Faceted Sticky Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* ============================================================ */}
          {/* TANEIRA MULTI-FACETED FILTER SIDEBAR (DESKTOP)               */}
          {/* ============================================================ */}
          <aside className="hidden lg:block bg-white border border-[#e5d9c5] rounded-2xl p-5 space-y-5 sticky top-36 shadow-xs max-h-[85vh] overflow-y-auto scrollbar-thin">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal size={15} className="text-[#4a0d18]" />
                <span>Filters</span>
              </span>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] font-bold text-[#4a0d18] hover:underline cursor-pointer"
                >
                  Clear All ({activeFiltersCount})
                </button>
              )}
            </div>

            {/* Accordion 1: Clothing Type */}
            <div className="border-b border-slate-100 pb-4">
              <button
                onClick={() => toggleSection('clothingType')}
                className="flex items-center justify-between w-full text-xs uppercase font-extrabold tracking-wider text-slate-900 cursor-pointer mb-2"
              >
                <span>Garment Silhouette</span>
                {openSections.clothingType ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {openSections.clothingType && (
                <div className="space-y-1 pt-1">
                  {CLOTHING_TYPES.map((t) => {
                    const count = t.value
                      ? products.filter((p) => p.clothingType === t.value).length
                      : products.length;
                    const isSelected = selectedClothingType === t.value;
                    return (
                      <button
                        key={t.label}
                        onClick={() => setSelectedClothingType(isSelected ? '' : t.value)}
                        className={`flex items-center justify-between w-full text-left text-xs py-1.5 px-2 rounded-lg transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#4a0d18] text-white font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{t.label}</span>
                        <span className={`text-[10px] ${isSelected ? 'text-amber-200' : 'text-slate-400'}`}>
                          ({count})
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Accordion 2: Craft & Weave (with search box) */}
            <div className="border-b border-slate-100 pb-4">
              <button
                onClick={() => toggleSection('craft')}
                className="flex items-center justify-between w-full text-xs uppercase font-extrabold tracking-wider text-slate-900 cursor-pointer mb-2"
              >
                <span>Craft &amp; Weave Technique</span>
                {openSections.craft ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {openSections.craft && (
                <div>
                  <div className="relative my-2">
                    <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={craftSearchText}
                      onChange={(e) => setCraftSearchText(e.target.value)}
                      placeholder="Search craft..."
                      className="w-full bg-slate-50 text-[11px] pl-7 pr-3 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:border-[#4a0d18]"
                    />
                  </div>
                  <div className="space-y-1 max-h-44 overflow-y-auto pr-1 scrollbar-thin text-xs">
                    <button
                      onClick={() => setSelectedCraft('')}
                      className={`block text-left w-full transition-colors cursor-pointer py-1 px-2 rounded ${
                        !selectedCraft ? 'font-bold text-[#4a0d18] bg-amber-50' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      All Crafts ({allCrafts.length})
                    </button>
                    {filteredCrafts.map(([cr, count]) => {
                      const isSelected = selectedCraft.toLowerCase() === cr.toLowerCase();
                      return (
                        <button
                          key={cr}
                          onClick={() => setSelectedCraft(isSelected ? '' : cr)}
                          className={`flex items-center justify-between text-left w-full transition-colors cursor-pointer py-1 px-2 rounded ${
                            isSelected
                              ? 'font-bold text-[#4a0d18] bg-amber-50'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <span className="truncate">{cr}</span>
                          <span className="text-[10px] text-slate-400 ml-1">({count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 3: Fabric */}
            <div className="border-b border-slate-100 pb-4">
              <button
                onClick={() => toggleSection('fabric')}
                className="flex items-center justify-between w-full text-xs uppercase font-extrabold tracking-wider text-slate-900 cursor-pointer mb-2"
              >
                <span>Fabric &amp; Texture</span>
                {openSections.fabric ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {openSections.fabric && (
                <div className="space-y-1 pt-1 max-h-40 overflow-y-auto pr-1 scrollbar-thin text-xs">
                  <button
                    onClick={() => setSelectedFabric('')}
                    className={`block text-left w-full transition-colors cursor-pointer py-1 px-2 rounded ${
                      !selectedFabric ? 'font-bold text-[#4a0d18] bg-amber-50' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All Fabrics
                  </button>
                  {FABRICS_LIST.map((fab) => {
                    const isSelected = selectedFabric === fab;
                    return (
                      <button
                        key={fab}
                        onClick={() => setSelectedFabric(isSelected ? '' : fab)}
                        className={`block text-left w-full transition-colors cursor-pointer py-1 px-2 rounded ${
                          isSelected ? 'font-bold text-[#4a0d18] bg-amber-50' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {fab}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Accordion 4: Occasion */}
            <div className="border-b border-slate-100 pb-4">
              <button
                onClick={() => toggleSection('occasion')}
                className="flex items-center justify-between w-full text-xs uppercase font-extrabold tracking-wider text-slate-900 cursor-pointer mb-2"
              >
                <span>Occasion &amp; Trousseau</span>
                {openSections.occasion ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {openSections.occasion && (
                <div className="space-y-1 pt-1 text-xs">
                  <button
                    onClick={() => setSelectedOccasion('')}
                    className={`block text-left w-full transition-colors cursor-pointer py-1 px-2 rounded ${
                      !selectedOccasion ? 'font-bold text-[#4a0d18] bg-amber-50' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All Celebrations
                  </button>
                  {OCCASIONS_LIST.map((occ) => {
                    const isSelected = selectedOccasion === occ.query;
                    return (
                      <button
                        key={occ.label}
                        onClick={() => setSelectedOccasion(isSelected ? '' : occ.query)}
                        className={`block text-left w-full transition-colors cursor-pointer py-1 px-2 rounded ${
                          isSelected ? 'font-bold text-[#4a0d18] bg-amber-50' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {occ.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Accordion 5: State & Region of Origin (All 33 States) */}
            <div className="border-b border-slate-100 pb-4">
              <button
                onClick={() => toggleSection('state')}
                className="flex items-center justify-between w-full text-xs uppercase font-extrabold tracking-wider text-slate-900 cursor-pointer mb-2"
              >
                <span>State of Origin (33 States &amp; UTs)</span>
                {openSections.state ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {openSections.state && (
                <div>
                  {/* Mini region tabs */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 mb-2 scrollbar-none">
                    {['All', 'North', 'South', 'East', 'West', 'NE'].map((r) => {
                      const matchReg = r === 'All' ? 'All Regions' : r === 'NE' ? 'North-East' : r;
                      return (
                        <button
                          key={r}
                          onClick={() => setStateRegionFilter(matchReg)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                            stateRegionFilter === matchReg
                              ? 'bg-[#4a0d18] text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {r}
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-1 max-h-48 overflow-y-auto pr-1 scrollbar-thin text-xs">
                    <button
                      onClick={() => setSelectedState('')}
                      className={`block text-left w-full transition-colors cursor-pointer py-1 px-2 rounded ${
                        !selectedState ? 'font-bold text-[#4a0d18] bg-amber-50' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      All 33 States &amp; UTs
                    </button>
                    {visibleStates.map((st: StateCraft) => {
                      const count = products.filter(
                        (p) =>
                          p.state?.toLowerCase() === st.name.toLowerCase() ||
                          st.crafts.some((c: string) => p.craftTechnique?.toLowerCase().includes(c.toLowerCase()))
                      ).length;
                      const isSelected = selectedState.toLowerCase() === st.name.toLowerCase();
                      return (
                        <button
                          key={st.name}
                          onClick={() => setSelectedState(isSelected ? '' : st.name)}
                          className={`flex items-center justify-between text-left w-full transition-colors cursor-pointer py-1 px-2 rounded ${
                            isSelected
                              ? 'font-bold text-[#4a0d18] bg-amber-50'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <span className="truncate">{st.name}</span>
                          <span className="text-[10px] text-slate-400">({count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 6: Price Range & Brackets */}
            <div className="border-b border-slate-100 pb-4">
              <button
                onClick={() => toggleSection('price')}
                className="flex items-center justify-between w-full text-xs uppercase font-extrabold tracking-wider text-slate-900 cursor-pointer mb-2"
              >
                <span>Price (₹)</span>
                {openSections.price ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {openSections.price && (
                <div className="space-y-2 pt-1 text-xs">
                  {/* Preset Brackets */}
                  <div className="space-y-1">
                    {PRICE_BRACKETS.map((br, idx) => {
                      const isSelected = selectedPriceBracket === idx;
                      return (
                        <button
                          key={br.label}
                          onClick={() => setSelectedPriceBracket(isSelected ? null : idx)}
                          className={`flex items-center gap-2 w-full text-left py-1 px-2 rounded cursor-pointer transition-colors ${
                            isSelected ? 'font-bold text-[#4a0d18] bg-amber-50' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                            isSelected ? 'bg-[#4a0d18] border-[#4a0d18]' : 'border-slate-300'
                          }`}>
                            {isSelected && <Check size={10} className="text-white" />}
                          </div>
                          <span>{br.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Manual Slider */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex justify-between items-center mb-1 text-[11px]">
                      <span className="text-slate-500">Up to:</span>
                      <span className="font-bold text-slate-900">
                        ₹{(maxPriceFilter / 100).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1000000"
                      max="10000000"
                      step="500000"
                      value={maxPriceFilter}
                      onChange={(e) => {
                        setSelectedPriceBracket(null);
                        setMaxPriceFilter(Number(e.target.value));
                      }}
                      className="w-full accent-[#4a0d18] cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 7: Color Palette */}
            <div className="border-b border-slate-100 pb-4">
              <button
                onClick={() => toggleSection('color')}
                className="flex items-center justify-between w-full text-xs uppercase font-extrabold tracking-wider text-slate-900 cursor-pointer mb-2"
              >
                <span>Color Palette</span>
                {openSections.color ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {openSections.color && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {COLOR_SWATCHES.map((c) => {
                    const isSelected = selectedColor === c.name;
                    return (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(isSelected ? '' : c.name)}
                        title={c.name}
                        className={`relative w-7 h-7 rounded-full transition-transform cursor-pointer shadow-xs ${
                          isSelected ? 'scale-125 ring-2 ring-[#4a0d18] ring-offset-2' : 'hover:scale-110'
                        }`}
                        style={{
                          backgroundColor: c.hex,
                          border: c.border ? `1px solid ${c.border}` : '1px solid rgba(0,0,0,0.1)'
                        }}
                      >
                        {isSelected && (
                          <Check
                            size={12}
                            className={`absolute inset-0 m-auto ${
                              c.name === 'Sandalwood Ivory' ? 'text-slate-900' : 'text-white'
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Accordion 8: Certifications & Offers */}
            <div>
              <button
                onClick={() => toggleSection('certification')}
                className="flex items-center justify-between w-full text-xs uppercase font-extrabold tracking-wider text-slate-900 cursor-pointer mb-2"
              >
                <span>Certifications &amp; Offers</span>
                {openSections.certification ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {openSections.certification && (
                <div className="space-y-2 pt-1 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={silkMarkOnly}
                      onChange={(e) => setSilkMarkOnly(e.target.checked)}
                      className="rounded text-[#4a0d18] accent-[#4a0d18] cursor-pointer"
                    />
                    <span>Silk Mark Certified Only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={giTaggedOnly}
                      onChange={(e) => setGiTaggedOnly(e.target.checked)}
                      className="rounded text-[#4a0d18] accent-[#4a0d18] cursor-pointer"
                    />
                    <span>GI Tagged Authenticated</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={festiveOffersOnly}
                      onChange={(e) => setFestiveOffersOnly(e.target.checked)}
                      className="rounded text-[#4a0d18] accent-[#4a0d18] cursor-pointer"
                    />
                    <span>Festive Privileges (15% Off)</span>
                  </label>
                </div>
              )}
            </div>
          </aside>

          {/* ============================================================ */}
          {/* PRODUCT CARDS GRID AREA                                      */}
          {/* ============================================================ */}
          <main className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-[#e5d9c5] p-12 text-center rounded-3xl shadow-xs">
                <h3 className="font-heading text-2xl font-bold mb-2 text-slate-900">
                  {activeStateDetail
                    ? `${activeStateDetail.name} Heirlooms Currently on the Loom`
                    : 'No master weaves match your selected filters'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
                  {activeStateDetail
                    ? `Authentic ${activeStateDetail.crafts.join(', ')} from ${activeStateDetail.name} can be bespoke-commissioned via our Patron Concierge.`
                    : 'Try clearing some filters, exploring another Indian state, or adjusting your price bracket.'}
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-[#4a0d18] hover:bg-[#5e1220] text-white text-xs font-bold px-8 py-3.5 uppercase tracking-wider rounded-full shadow-sm cursor-pointer transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  gridCols === 4
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5'
                    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7'
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MOBILE FULL-SCREEN SLIDE-OVER FILTER DRAWER                  */}
      {/* ============================================================ */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm h-full bg-white flex flex-col shadow-2xl z-10">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <span className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-[#4a0d18]" />
                <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
              </span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
              {/* Silhouette */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2">Garment Silhouette</h4>
                <div className="space-y-1">
                  {CLOTHING_TYPES.map((t) => (
                    <button
                      key={t.label}
                      onClick={() => setSelectedClothingType(selectedClothingType === t.value ? '' : t.value)}
                      className={`block w-full text-left py-1.5 px-2 rounded ${
                        selectedClothingType === t.value ? 'bg-[#4a0d18] text-white font-bold' : 'text-slate-700'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* State Filter */}
              <div className="pt-3 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2">State of Origin</h4>
                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                  <button
                    onClick={() => setSelectedState('')}
                    className={`block w-full text-left py-1 px-2 rounded ${
                      !selectedState ? 'font-bold text-[#4a0d18] bg-amber-50' : 'text-slate-700'
                    }`}
                  >
                    All 33 States &amp; UTs
                  </button>
                  {STATE_CRAFTS_DIRECTORY.map((st) => (
                    <button
                      key={st.name}
                      onClick={() => setSelectedState(selectedState === st.name ? '' : st.name)}
                      className={`block w-full text-left py-1 px-2 rounded ${
                        selectedState === st.name ? 'font-bold text-[#4a0d18] bg-amber-50' : 'text-slate-700'
                      }`}
                    >
                      {st.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Brackets */}
              <div className="pt-3 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2">Price Range</h4>
                <div className="space-y-1">
                  {PRICE_BRACKETS.map((br, idx) => (
                    <button
                      key={br.label}
                      onClick={() => setSelectedPriceBracket(selectedPriceBracket === idx ? null : idx)}
                      className={`block w-full text-left py-1 px-2 rounded ${
                        selectedPriceBracket === idx ? 'font-bold text-[#4a0d18] bg-amber-50' : 'text-slate-700'
                      }`}
                    >
                      {br.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={silkMarkOnly}
                    onChange={(e) => setSilkMarkOnly(e.target.checked)}
                    className="accent-[#4a0d18]"
                  />
                  <span>Silk Mark Certified</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={giTaggedOnly}
                    onChange={(e) => setGiTaggedOnly(e.target.checked)}
                    className="accent-[#4a0d18]"
                  />
                  <span>GI Tagged Only</span>
                </label>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-3">
              <button
                onClick={resetFilters}
                className="w-1/3 py-2.5 text-xs font-bold text-slate-700 border border-slate-300 rounded-full hover:bg-white cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-2/3 py-2.5 text-xs font-bold text-white bg-[#4a0d18] rounded-full shadow-sm cursor-pointer"
              >
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-xs text-slate-500 bg-[#faf8f5] min-h-screen">Loading Catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
