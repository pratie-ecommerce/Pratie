'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Star,
  MapPin,
  Check,
  ChevronDown,
  ChevronUp,
  Share2,
  Scissors,
  Award,
  Info,
  Calendar,
  ArrowRight,
  Clock,
  Package,
  Layers
} from 'lucide-react';
import { Product, ProductVariant, Review } from '../../../types/index';
import { fetchProductBySlug, FALLBACK_PRODUCTS } from '../../../lib/api';
import { formatPaise } from '../../../lib/utils';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { ProductCard } from '../../../components/products/ProductCard';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const routeParams = useParams();
  const slug = (routeParams?.slug as string) || '';

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<'story' | 'specs' | 'care' | 'shipping'>('story');

  // Custom Saree / Suit Customization options
  const [includeFallPiko, setIncludeFallPiko] = useState(true);
  const [blouseOption, setBlouseOption] = useState<'unstitched' | 'stitched'>('unstitched');
  const [blouseSize, setBlouseSize] = useState('38 (M)');
  const [blouseNeckline, setBlouseNeckline] = useState('Classic Sweetheart');

  // Pincode Delivery Estimator
  const [pincode, setPincode] = useState('');
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null);
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);

  // Zoom position for hero image
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  // Review Form State
  const [authorName, setAuthorName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewsList, setReviewsList] = useState<Review[]>([]);

  useEffect(() => {
    fetchProductBySlug(slug).then((data) => {
      if (data) {
        setProduct(data);
        setSelectedVariant(data.variants[0] || null);
        if (data.reviews) {
          setReviewsList(data.reviews);
        }
      }
    });
  }, [slug]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-28 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-6" />
        <div className="font-editorial text-2xl font-bold mb-2 text-slate-900">Unveiling Masterpiece Provenance...</div>
        <p className="text-xs text-slate-500 max-w-md font-medium">Retrieving master weaver records, Geographical Indication credentials, and pitloom details.</p>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const isSaree = product.clothingType?.toLowerCase().includes('saree') || product.title.toLowerCase().includes('saree');
  
  // Custom stitching price adder if selected
  const stitchingAddonPaise = (!isSaree || blouseOption === 'unstitched') ? 0 : 149900;
  const currentPricePaise =
    product.basePricePaise + (selectedVariant?.additionalPricePaise || 0) + stitchingAddonPaise;

  // Build multi-angle image gallery from authentic product photography
  const baseImg = product.media?.[0]?.imageUrl || '/images/products/mithila-handpainted-tussar-silk-saree.jpeg';
  const galleryImages = product.media && product.media.length > 1
    ? product.media.map((m) => m.imageUrl)
    : [
        baseImg,
        isSaree 
          ? '/images/products/mithila-haldi-yellow-tussar-saree.jpeg'
          : 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85',
        isSaree
          ? '/images/products/mithila-indigo-tussar-silk-saree.jpeg'
          : 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85'
      ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode.trim())) {
      toast.error('Please enter a valid 6-digit Indian PIN code');
      return;
    }
    setIsCheckingPincode(true);
    setTimeout(() => {
      setIsCheckingPincode(false);
      setDeliveryEstimate(`Express Delivery to ${pincode} within 3-4 Business Days (Insured White-Glove Dispatch)`);
      toast.success(`PIN ${pincode} is serviceable for Express Delivery`);
    }, 600);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewComment.trim()) {
      toast.error('Please enter your name and reflection review');
      return;
    }

    const newRev: Review = {
      id: `rev_${Date.now()}`,
      productId: product.id,
      authorName,
      rating: reviewRating,
      comment: reviewComment,
      isVerifiedPurchase: true,
      isApproved: true,
      createdAt: new Date().toISOString()
    };

    setReviewsList([newRev, ...reviewsList]);
    setAuthorName('');
    setReviewComment('');
    toast.success('Thank you for honoring the master weaver with your review');
  };

  const toggleAccordion = (key: 'story' | 'specs' | 'care' | 'shipping') => {
    setOpenAccordion(openAccordion === key ? '' as any : key);
  };

  // Related products filtered from the same state or craft
  const relatedProducts = FALLBACK_PRODUCTS.filter(
    (p) => p.id !== product.id && (p.state === product.state || p.clothingType === product.clothingType)
  ).slice(0, 4);

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-slate-900 pb-20">
      {/* Taneira-Style Breadcrumb Navigation */}
      <div className="border-b border-[#E8E1D7] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-2 text-[11px] uppercase tracking-wider text-stone-500 overflow-x-auto">
          <Link href="/" className="hover:text-[#881337] transition-colors shrink-0">
            Home
          </Link>
          <span className="text-stone-300">/</span>
          <Link href="/products" className="hover:text-[#881337] transition-colors shrink-0">
            {isSaree ? 'Handcrafted Sarees' : 'Royal Suits & Kurtas'}
          </Link>
          <span className="text-stone-300">/</span>
          <Link href={`/products?state=${encodeURIComponent(product.state || '')}`} className="hover:text-[#881337] transition-colors shrink-0 font-medium text-stone-700">
            {product.state || 'India'}
          </Link>
          <span className="text-stone-300">/</span>
          <span className="text-[#881337] font-bold truncate max-w-xs">{product.title}</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          {/* LEFT: Multi-Angle Thumbnail Strip + Main Zoom Viewer (Cols 1-7) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4 items-start sticky top-24">
            {/* Vertical Thumbnails */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 w-full md:w-20 shrink-0">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`relative w-16 h-20 md:w-20 md:h-24 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                    selectedImageIdx === idx
                      ? 'border-[#881337] shadow-md ring-2 ring-[#881337]/20 scale-102'
                      : 'border-[#E8E1D7] hover:border-amber-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`${product.title} angle ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>

            {/* Main Interactive Magnifier Viewport */}
            <div className="relative flex-1 w-full aspect-[3/4] bg-[#F5EFE6] border border-[#E8E1D7] rounded-xl overflow-hidden shadow-sm group">
              <div
                className="w-full h-full relative cursor-crosshair overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onMouseMove={handleMouseMove}
              >
                <Image
                  src={galleryImages[selectedImageIdx] || baseImg}
                  alt={product.title}
                  fill
                  priority
                  className={`object-cover transition-transform duration-200 ${
                    isHovered ? 'scale-150' : 'scale-100'
                  }`}
                  style={
                    isHovered
                      ? {
                          transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                        }
                      : undefined
                  }
                />
              </div>

              {/* Verified Authenticity Floating Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 bg-[#881337] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  <Award size={12} className="text-amber-300" />
                  Silk Mark Certified
                </span>
                {product.state && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-950/80 backdrop-blur-sm text-amber-200 text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
                    <MapPin size={10} />
                    {product.state} Heritage
                  </span>
                )}
              </div>

              {/* Floating Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-white rounded-full border border-stone-200 shadow-md transition-all hover:scale-110 cursor-pointer z-10"
                aria-label="Wishlist"
              >
                <Heart
                  size={18}
                  className={isWishlisted ? 'fill-[#881337] text-[#881337]' : 'text-stone-600'}
                />
              </button>

              {/* Hover Zoom Hint */}
              <div className="absolute bottom-3 right-3 bg-stone-900/60 backdrop-blur-xs text-white text-[10px] font-medium px-2.5 py-1 rounded-md pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                Hover to Zoom Fabric
              </div>
            </div>
          </div>

          {/* RIGHT: Taneira Luxury Product Configuration & Buying Engine (Cols 8-12) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Header / Brand / State */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#881337]">
                  <span className="w-2 h-2 rounded-full bg-[#881337]" />
                  {product.brandName || 'Pratiè Atelier'} • {product.state || 'Traditional Bharat'}
                </span>
                <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                  {product.skuPrefix || 'PRT-WEAVE'}
                </span>
              </div>

              <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 leading-tight mb-2">
                {product.title}
              </h1>

              {/* Craft Technique Tag */}
              {product.craftTechnique && (
                <p className="text-xs text-[#881337] font-semibold mb-3 flex items-center gap-1.5">
                  <Layers size={13} />
                  <span>Artisan Technique: <strong>{product.craftTechnique}</strong></span>
                </p>
              )}

              {/* Ratings & Authenticity Seal */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md text-amber-900 font-bold text-xs">
                  <Star size={13} className="fill-amber-500 text-amber-500" />
                  <span>{product.ratingAverage?.toFixed(1) || '4.9'}</span>
                  <span className="text-stone-400 font-normal">|</span>
                  <span className="text-stone-600 font-medium">({reviewsList.length + (product.ratingCount || 12)} Patron Reviews)</span>
                </div>
                <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-md flex items-center gap-1">
                  <Check size={12} className="text-emerald-600" /> Handloom Mark Verified
                </span>
              </div>

              {/* Price & Offers */}
              <div className="p-4 bg-stone-50/80 border border-[#E8E1D7] rounded-xl mb-4">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                    {formatPaise(currentPricePaise)}
                  </span>
                  {product.compareAtPricePaise && product.compareAtPricePaise > product.basePricePaise && (
                    <>
                      <span className="text-sm text-stone-400 line-through">
                        {formatPaise(product.compareAtPricePaise)}
                      </span>
                      <span className="text-xs font-bold text-[#881337] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        Save {formatPaise(product.compareAtPricePaise - product.basePricePaise)}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[11px] text-stone-500 font-normal">
                  Inclusive of all taxes • Free Insured Delivery across India
                </p>
              </div>
            </div>

            {/* Saree / Suit Customization Accordion Box */}
            <div className="p-5 bg-white border border-[#E8E1D7] rounded-xl shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                  <Scissors size={14} className="text-[#881337]" />
                  {isSaree ? 'Drape & Tailoring Services' : 'Silhouette Sizing'}
                </span>
                <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <Sparkles size={12} /> Master Weaver Finished
                </span>
              </div>

              {/* Saree-Specific Customization */}
              {isSaree ? (
                <div className="space-y-4">
                  {/* Complimentary Fall & Piko */}
                  <label className="flex items-start gap-3 p-3 bg-amber-50/50 border border-amber-200/80 rounded-lg cursor-pointer transition-colors hover:bg-amber-50">
                    <input
                      type="checkbox"
                      checked={includeFallPiko}
                      onChange={(e) => setIncludeFallPiko(e.target.checked)}
                      className="mt-0.5 accent-[#881337] h-4 w-4 rounded cursor-pointer"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-stone-900 flex items-center gap-1.5">
                        <span>Complimentary Fall & Piko Pre-Stitched</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">FREE</span>
                      </div>
                      <p className="text-stone-500 font-normal mt-0.5">
                        High-quality cotton fall hand-stitched along the lower drape for impeccable pleating and ready-to-wear finish.
                      </p>
                    </div>
                  </label>

                  {/* Blouse Stitching Selector */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-stone-800 block">Blouse Tailoring:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setBlouseOption('unstitched')}
                        className={`p-3 text-left border rounded-lg text-xs transition-all cursor-pointer ${
                          blouseOption === 'unstitched'
                            ? 'border-[#881337] bg-rose-50/60 ring-1 ring-[#881337]'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <div className="font-bold text-stone-900">Unstitched Fabric</div>
                        <div className="text-[10px] text-stone-500 mt-0.5">0.8m running piece included</div>
                        <div className="text-[11px] font-bold text-emerald-700 mt-1">Included</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBlouseOption('stitched')}
                        className={`p-3 text-left border rounded-lg text-xs transition-all cursor-pointer ${
                          blouseOption === 'stitched'
                            ? 'border-[#881337] bg-rose-50/60 ring-1 ring-[#881337]'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <div className="font-bold text-stone-900">Custom Tailored Blouse</div>
                        <div className="text-[10px] text-stone-500 mt-0.5">Lined with pure cotton mulmul</div>
                        <div className="text-[11px] font-bold text-[#881337] mt-1">+₹1,499</div>
                      </button>
                    </div>

                    {/* Stitched Options Drawer */}
                    {blouseOption === 'stitched' && (
                      <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-3 mt-2 animate-fadeIn">
                        <div>
                          <label className="block text-[11px] font-bold text-stone-700 mb-1">Select Bust Size:</label>
                          <div className="flex flex-wrap gap-1.5">
                            {['34 (XS)', '36 (S)', '38 (M)', '40 (L)', '42 (XL)', '44 (XXL)'].map((size) => (
                              <button
                                key={size}
                                type="button"
                                onClick={() => setBlouseSize(size)}
                                className={`px-2.5 py-1 text-xs rounded border transition-all cursor-pointer ${
                                  blouseSize === size
                                    ? 'bg-[#881337] text-white border-[#881337] font-bold'
                                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-stone-700 mb-1">Front & Back Neckline:</label>
                          <select
                            value={blouseNeckline}
                            onChange={(e) => setBlouseNeckline(e.target.value)}
                            className="w-full bg-white text-xs border border-stone-300 rounded p-2 text-stone-800 font-medium focus:outline-none focus:border-[#881337]"
                          >
                            <option value="Classic Sweetheart">Classic Sweetheart Neck (Padded)</option>
                            <option value="Deep Round Neck">Deep Round Neck (Traditional Tassels)</option>
                            <option value="Boat Neck Elegance">Royal Boat Neck (Elbow-Length Sleeves)</option>
                            <option value="Collar Keyhole">High Mandarian Collar with Keyhole Back</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Suit / Kurta Set Sizing */
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-stone-800">Select Garment Size:</span>
                    <span className="text-[11px] text-[#881337] font-semibold underline cursor-pointer">
                      Size Chart (Inches & CM)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['XS (34)', 'S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedVariant({ id: s, size: s, stockQuantity: 5, sku: s, additionalPricePaise: 0 } as any)}
                        className={`px-3 py-2 text-xs rounded-lg border font-semibold transition-all cursor-pointer ${
                          selectedVariant?.size === s || (!selectedVariant && s === 'M (38)')
                            ? 'bg-[#881337] text-white border-[#881337] shadow-sm'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-stone-500 font-normal mt-1">
                    Set includes: Handloom Embroidered Kurta, Tailored Trousers, and 2.5m Matching Dupatta.
                  </p>
                </div>
              )}
            </div>

            {/* Quantity Selector & CTAs */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-stone-300 bg-white rounded-xl overflow-hidden h-12">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 h-full text-stone-600 hover:bg-stone-100 transition-colors font-bold text-base cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-stone-900 w-8 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 h-full text-stone-600 hover:bg-stone-100 transition-colors font-bold text-base cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Primary Add to Shopping Bag */}
                <button
                  type="button"
                  onClick={() => {
                    const variantToUse = selectedVariant || {
                      id: 'default',
                      size: isSaree ? (blouseOption === 'stitched' ? `Stitched Blouse ${blouseSize}` : 'Unstitched') : 'Standard',
                      stockQuantity: 5,
                      sku: product.skuPrefix,
                      additionalPricePaise: stitchingAddonPaise
                    };
                    addToCart(product, variantToUse as any, quantity);
                    toast.success(`Added ${product.title} to Bag`, {
                      description: `${isSaree ? (includeFallPiko ? 'Complimentary Fall & Piko Included' : '') : 'Complete 3-Piece Suit Set'}`
                    });
                  }}
                  className="flex-1 h-12 bg-[#881337] hover:bg-[#6b0f2b] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <ShoppingBag size={16} />
                  <span>Add To Shopping Bag</span>
                </button>
              </div>

              {/* Direct Buy Now / Reserve */}
              <button
                type="button"
                onClick={() => {
                  const variantToUse = selectedVariant || {
                    id: 'default',
                    size: 'Standard',
                    stockQuantity: 5,
                    sku: product.skuPrefix,
                    additionalPricePaise: stitchingAddonPaise
                  };
                  addToCart(product, variantToUse as any, quantity);
                  window.location.href = '/checkout';
                }}
                className="w-full h-11 bg-white hover:bg-stone-50 text-[#881337] border-2 border-[#881337] text-xs font-bold uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Express Checkout • Direct Reserve</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Pincode Delivery Estimator */}
            <div className="p-4 bg-white border border-[#E8E1D7] rounded-xl shadow-xs">
              <span className="text-xs font-bold text-stone-900 block mb-2 flex items-center gap-1.5">
                <Truck size={14} className="text-[#881337]" />
                Estimate Delivery & Cash on Delivery
              </span>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit Indian PIN Code"
                  className="flex-1 bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 font-mono focus:outline-none focus:border-[#881337]"
                />
                <button
                  type="submit"
                  disabled={isCheckingPincode}
                  className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-4 py-2 rounded-lg tracking-wider uppercase transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isCheckingPincode ? 'Checking...' : 'Check'}
                </button>
              </form>
              {deliveryEstimate && (
                <div className="mt-2 text-[11px] text-emerald-800 font-semibold bg-emerald-50 p-2 rounded border border-emerald-200 flex items-center gap-1.5">
                  <Check size={13} className="text-emerald-600 shrink-0" />
                  <span>{deliveryEstimate}</span>
                </div>
              )}
            </div>

            {/* 4 Trust Pillars */}
            <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#E8E1D7] text-[11px] text-stone-700">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#881337] shrink-0" />
                <span>100% Pure Certified Silk</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-amber-600 shrink-0" />
                <span>Authentic Pitloom Weave</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw size={16} className="text-blue-600 shrink-0" />
                <span>14-Day Easy Exchange</span>
              </div>
              <div className="flex items-center gap-2">
                <Package size={16} className="text-emerald-600 shrink-0" />
                <span>Archival Gift Box Packaging</span>
              </div>
            </div>

            {/* Taneira Heritage Accordions */}
            <div className="space-y-2 border-t border-[#E8E1D7] pt-2">
              {/* Accordion 1: Pitloom Story */}
              <div className="border border-[#E8E1D7] rounded-xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggleAccordion('story')}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-xs text-stone-900 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Award size={14} className="text-[#881337]" />
                    Artisan Provenance & Weave Tale
                  </span>
                  {openAccordion === 'story' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === 'story' && (
                  <div className="p-4 pt-0 text-xs text-stone-600 leading-relaxed font-normal border-t border-stone-100 space-y-2">
                    <p>{product.description}</p>
                    <p className="text-stone-500 italic">
                      Woven over {isSaree ? '18 to 28 days' : '10 to 14 days'} on wooden pitlooms by certified master weaver clusters in {product.state || 'India'}. Supports fair artisan wages.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 2: Specifications */}
              <div className="border border-[#E8E1D7] rounded-xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggleAccordion('specs')}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-xs text-stone-900 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Layers size={14} className="text-[#881337]" />
                    Fabric, Zari & Silhouette Specifications
                  </span>
                  {openAccordion === 'specs' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === 'specs' && (
                  <div className="p-4 pt-0 text-xs text-stone-700 leading-relaxed font-normal border-t border-stone-100">
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                      <div>
                        <dt className="text-stone-400 font-bold uppercase text-[10px]">Garment Type</dt>
                        <dd className="font-semibold text-stone-900">{product.clothingType || (isSaree ? 'Saree' : 'Suit')}</dd>
                      </div>
                      <div>
                        <dt className="text-stone-400 font-bold uppercase text-[10px]">Fabric Purity</dt>
                        <dd className="font-semibold text-stone-900">{product.fabric || '100% Handspun Silk'}</dd>
                      </div>
                      <div>
                        <dt className="text-stone-400 font-bold uppercase text-[10px]">Craft & Weave</dt>
                        <dd className="font-semibold text-stone-900">{product.craftTechnique || 'Extra Weft Brocade'}</dd>
                      </div>
                      <div>
                        <dt className="text-stone-400 font-bold uppercase text-[10px]">Zari Specification</dt>
                        <dd className="font-semibold text-stone-900">Tested Gold & Silver Electroplated Zari</dd>
                      </div>
                      <div>
                        <dt className="text-stone-400 font-bold uppercase text-[10px]">Dimensions</dt>
                        <dd className="font-semibold text-stone-900">{isSaree ? '5.5m Saree + 0.8m Blouse Piece' : '44" Kurta, 38" Pant, 2.5m Dupatta'}</dd>
                      </div>
                      <div>
                        <dt className="text-stone-400 font-bold uppercase text-[10px]">Weight</dt>
                        <dd className="font-semibold text-stone-900">Approx. 650 grams</dd>
                      </div>
                    </dl>
                  </div>
                )}
              </div>

              {/* Accordion 3: Care Instructions */}
              <div className="border border-[#E8E1D7] rounded-xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggleAccordion('care')}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-xs text-stone-900 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-[#881337]" />
                    Pure Silk Care & Archival Preservation
                  </span>
                  {openAccordion === 'care' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === 'care' && (
                  <div className="p-4 pt-0 text-xs text-stone-600 leading-relaxed font-normal border-t border-stone-100 space-y-2">
                    <p>• <strong>Strict Dry Clean Only:</strong> By authorized luxury garment dry cleaners to protect natural dyes and real metallic zari.</p>
                    <p>• <strong>Storage:</strong> Wrap in clean, unbleached mulmul cotton cloth. Avoid plastic covers.</p>
                    <p>• <strong>Airing:</strong> Unfold and air in shaded breeze every 5-6 months to prevent creasing.</p>
                    <p>• <strong>Ironing:</strong> Low to medium silk setting on reverse with a protective cotton pressing cloth.</p>
                  </div>
                )}
              </div>

              {/* Accordion 4: White-Glove Shipping */}
              <div className="border border-[#E8E1D7] rounded-xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-xs text-stone-900 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Truck size={14} className="text-[#881337]" />
                    Insured Shipping & White-Glove Returns
                  </span>
                  {openAccordion === 'shipping' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === 'shipping' && (
                  <div className="p-4 pt-0 text-xs text-stone-600 leading-relaxed font-normal border-t border-stone-100 space-y-2">
                    <p>• <strong>Insured Dispatch:</strong> All Pratiè consignments are fully insured against transit hazards.</p>
                    <p>• <strong>Luxury Presentation:</strong> Arrives nestled in an archival mulberry gift box with hand-signed artisan certificate.</p>
                    <p>• <strong>Hassle-Free Exchange:</strong> 14-day exchange window across all Pratiè salon boutiques in India.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Patron Reviews Section */}
        <section className="border-t border-[#E8E1D7] pt-12 mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-[#881337]">
                Patron Reflections
              </span>
              <h2 className="font-editorial text-2xl md:text-3xl font-bold text-stone-900 mt-1">
                Cherished Experiences & Drapes
              </h2>
            </div>
            <div className="mt-2 md:mt-0 text-xs text-stone-500 font-medium">
              Verified Patrons of Pratiè Atelier Handlooms
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Reviews Listing (Cols 1-7) */}
            <div className="lg:col-span-7 space-y-4">
              {reviewsList.length === 0 ? (
                <div className="p-8 bg-white border border-[#E8E1D7] rounded-xl text-center">
                  <p className="text-xs text-stone-500 font-normal">
                    Be the inaugural patron to share your reflection on this masterwork weave.
                  </p>
                </div>
              ) : (
                reviewsList.map((rev) => (
                  <div key={rev.id} className="p-5 bg-white border border-[#E8E1D7] rounded-xl shadow-xs">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900">{rev.authorName}</span>
                        {rev.isVerifiedPurchase && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                            Verified Patron
                          </span>
                        )}
                      </div>
                      <div className="flex text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} size={12} className="fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    {rev.title && <h4 className="text-xs font-semibold text-stone-800 mb-1">{rev.title}</h4>}
                    <p className="text-xs text-stone-600 font-normal leading-relaxed">{rev.comment}</p>
                    <div className="mt-2 text-[10px] text-stone-400">
                      Reviewed on {new Date(rev.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Review Form (Cols 8-12) */}
            <div className="lg:col-span-5 bg-white border border-[#E8E1D7] p-6 rounded-xl shadow-xs">
              <h3 className="font-editorial text-lg font-bold text-stone-900 mb-3">
                Share Your Drapery Experience
              </h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block uppercase tracking-wider font-bold text-stone-700 mb-1 text-[10px]">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Radhika Singhania"
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:border-[#881337]"
                    required
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-bold text-stone-700 mb-1 text-[10px]">
                    Overall Rating
                  </label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 font-medium focus:outline-none focus:border-[#881337]"
                  >
                    <option value={5}>★★★★★ (5 Stars - Sublime Masterpiece)</option>
                    <option value={4}>★★★★☆ (4 Stars - Exceptional Weave)</option>
                    <option value={3}>★★★☆☆ (3 Stars - Satisfactory)</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider font-bold text-stone-700 mb-1 text-[10px]">
                    Reflection on Weave, Drape & Feel
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={4}
                    placeholder="Describe the fabric fluidity, pitloom hand-feel, and occasion presence..."
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:border-[#881337]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#881337] hover:bg-[#6b0f2b] text-white font-bold py-3 uppercase tracking-[0.2em] rounded-lg transition-colors cursor-pointer text-[11px]"
                >
                  Submit Patron Reflection
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Curated Recommendations ("More From State / Complete the Look") */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-[#E8E1D7] pt-12">
            <div className="text-center mb-8">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-[#881337]">
                Curated Recommendations
              </span>
              <h2 className="font-editorial text-2xl md:text-3xl font-bold text-stone-900 mt-1">
                More Handcrafted Creations from {product.state || 'the Atelier'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
