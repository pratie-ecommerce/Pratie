import { AnalyticsMetrics, Product, Order, Customer } from '../types/index';

export const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api').replace(/\/admin$/, '') + '/admin';

export function formatPaise(paise: number = 0): string {
  const rupees = Math.round(paise / 100);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(rupees);
}

// Simulated data for zero-latency dashboard fallback
export const MOCK_METRICS: AnalyticsMetrics = {
  totalRevenuePaise: 84998000,
  activeOrders: 14,
  lowStockProducts: 3,
  totalCustomers: 284,
  totalProductsCount: 6
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p0000001-0000-0000-0000-000000000001',
    title: 'Mithila Handpainted Tussar Silk Kurta Set',
    slug: 'mithila-handpainted-tussar-silk-kurta-set',
    skuPrefix: 'PRT-MTH-01',
    shortDescription: 'Pure handspun Bhagalpuri Tussar silk kurta with Madhubani motifs.',
    description: 'Each piece is a living canvas featuring Madhubani lotuses and birds of joy.',
    categoryName: 'Mithila Couture',
    brandName: 'Pratiè Atelier',
    basePricePaise: 2499900,
    compareAtPricePaise: 2999900,
    isFeatured: true,
    isPublished: true,
    isNewArrival: true,
    ratingAverage: 4.98,
    ratingCount: 36,
    tags: ['mithila', 'madhubani', 'tussar-silk'],
    media: [{ imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80' }],
    variants: [
      { id: 'v1', productId: 'p1', sku: 'PRT-MTH-01-S', size: 'S', colorName: 'Raw Silk Ivory', additionalPricePaise: 0, stockQuantity: 8, isAvailable: true },
      { id: 'v2', productId: 'p1', sku: 'PRT-MTH-01-M', size: 'M', colorName: 'Raw Silk Ivory', additionalPricePaise: 0, stockQuantity: 14, isAvailable: true }
    ],
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'p0000001-0000-0000-0000-000000000002',
    title: 'Kashi Heritage Kadwa Brocade Bandhgala Jacket',
    slug: 'kashi-heritage-kadwa-brocade-bandhgala-jacket',
    skuPrefix: 'PRT-KSH-02',
    shortDescription: 'Pure Katan silk handwoven with authentic gold zari Kadwa floral jaal.',
    description: 'A tribute to the sacred looms of Varanasi with real gold zari.',
    categoryName: 'Banarasi Brocades',
    brandName: 'Pratiè Atelier',
    basePricePaise: 4899900,
    isFeatured: true,
    isPublished: true,
    isNewArrival: true,
    ratingAverage: 5.0,
    ratingCount: 22,
    tags: ['banarasi', 'kadwa', 'brocade'],
    media: [{ imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80' }],
    variants: [
      { id: 'v4', productId: 'p2', sku: 'PRT-KSH-02-NVY-38', size: '38R', colorName: 'Royal Navy Gold', additionalPricePaise: 0, stockQuantity: 6, isAvailable: true }
    ],
    createdAt: '2026-01-12T10:00:00Z'
  },
  {
    id: 'p0000001-0000-0000-0000-000000000003',
    title: 'Chanderi Silk Lotus Blossom Angrakha Anarkali',
    slug: 'chanderi-silk-lotus-blossom-angrakha-anarkali',
    skuPrefix: 'PRT-CHD-03',
    shortDescription: 'Gossamer Chanderi silk-cotton blend with pure organza dupatta.',
    description: 'Featherlight gossamer drape featuring traditional hand-interlocked zari bootis.',
    categoryName: 'Chanderi Weaves',
    brandName: 'Pratiè Atelier',
    basePricePaise: 3299900,
    isFeatured: true,
    isPublished: true,
    isNewArrival: false,
    ratingAverage: 4.95,
    ratingCount: 29,
    tags: ['chanderi', 'angrakha', 'anarkali'],
    media: [{ imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80' }],
    variants: [
      { id: 'v6', productId: 'p3', sku: 'PRT-CHD-03-PCH-M', size: 'M', colorName: 'Gulab Quartz', additionalPricePaise: 0, stockQuantity: 11, isAvailable: true }
    ],
    createdAt: '2026-01-14T10:00:00Z'
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'PRT-2026-94812',
    status: 'processing',
    paymentStatus: 'captured',
    paymentMethod: 'razorpay',
    shippingAddress: {
      fullName: 'Meera Kapoor',
      phone: '+91 9123456780',
      streetLine1: 'Penthouse 14B, Altamount Towers',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400026'
    },
    subtotalPaise: 2499900,
    taxAmountPaise: 449982,
    shippingAmountPaise: 0,
    discountAmountPaise: 249990,
    totalAmountPaise: 2699892,
    couponCode: 'HERITAGE10',
    trackingNumber: 'PRT-BLUE-98214',
    carrierName: 'Blue Dart Heritage Priority',
    items: [
      {
        id: 'oi-1',
        productTitle: 'Mithila Handpainted Tussar Silk Kurta Set',
        variantSku: 'PRT-MTH-01-S',
        size: 'S',
        colorName: 'Raw Silk Ivory',
        unitPricePaise: 2499900,
        quantity: 1,
        totalPricePaise: 2499900
      }
    ],
    createdAt: '2026-02-01T14:20:00Z'
  }
];

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    email: 'meera.kapoor@luxury.in',
    fullName: 'Meera Kapoor',
    phone: '+91 9123456780',
    ordersCount: 4,
    totalSpentPaise: 12499600,
    createdAt: '2025-11-10T08:00:00Z'
  },
  {
    id: 'c2',
    email: 'kabir.oberoi@delhi.com',
    fullName: 'Kabir Oberoi',
    phone: '+91 9811223344',
    ordersCount: 2,
    totalSpentPaise: 8999800,
    createdAt: '2025-12-05T09:30:00Z'
  }
];
