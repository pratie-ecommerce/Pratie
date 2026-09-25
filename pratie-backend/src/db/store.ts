import fs from 'fs';
import path from 'path';
import { Product, Coupon, Order, CartItem, User, Review } from '../types/index.js';

const loadProducts = (): Product[] => {
  try {
    const candidates = [
      path.resolve(__dirname, '../data/products.json'),
      path.resolve(process.cwd(), 'src/data/products.json'),
      path.resolve(process.cwd(), 'pratie-backend/src/data/products.json')
    ];
    for (const file of candidates) {
      if (fs.existsSync(file)) {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
      }
    }
    return [];
  } catch (err) {
    console.error('Failed to load products.json in DataStore:', err);
    return [];
  }
};

class DataStore {
  public users: User[] = [
    {
      id: 'u0000001-0000-0000-0000-000000000001',
      email: 'admin@pratie.com',
      passwordHash: '$2a$10$95j6P.JvH77/7W233p0R9eM0y5w0nN2K5gRk7V9XyM6O3kU1Q/8WW',
      fullName: 'Aarav Singhania',
      role: 'admin',
      phone: '+91 9876543210',
      isActive: true,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'u0000001-0000-0000-0000-000000000002',
      email: 'customer@pratie.com',
      passwordHash: '$2a$10$95j6P.JvH77/7W233p0R9eM0y5w0nN2K5gRk7V9XyM6O3kU1Q/8WW',
      fullName: 'Meera Kapoor',
      role: 'customer',
      phone: '+91 9123456780',
      isActive: true,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  public products: Product[] = loadProducts();

  public coupons: Coupon[] = [
    {
      id: 'cp1',
      code: 'HERITAGE10',
      discountType: 'percentage',
      discountValue: 10,
      minOrderAmountPaise: 500000,
      maxDiscountAmountPaise: 250000,
      usedCount: 24,
      isActive: true
    },
    {
      id: 'cp2',
      code: 'PRATIEVIP',
      discountType: 'percentage',
      discountValue: 20,
      minOrderAmountPaise: 1500000,
      maxDiscountAmountPaise: 500000,
      usedCount: 16,
      isActive: true
    },
    {
      id: 'cp3',
      code: 'MITHILA2000',
      discountType: 'fixed_amount',
      discountValue: 200000,
      minOrderAmountPaise: 1000000,
      usedCount: 42,
      isActive: true
    }
  ];

  public cartItems: CartItem[] = [];

  public orders: Order[] = [
    {
      id: 'ord-1001',
      orderNumber: 'PRT-2026-94812',
      userId: 'u0000001-0000-0000-0000-000000000002',
      status: 'delivered',
      paymentStatus: 'captured',
      paymentMethod: 'razorpay',
      razorpayOrderId: 'order_mock_001',
      razorpayPaymentId: 'pay_mock_001',
      shippingAddress: {
        id: 'a1',
        fullName: 'Meera Kapoor',
        phone: '+91 9123456780',
        streetLine1: 'Penthouse 14B, Altamount Towers',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400026',
        country: 'India'
      },
      billingAddress: {
        id: 'a1',
        fullName: 'Meera Kapoor',
        phone: '+91 9123456780',
        streetLine1: 'Penthouse 14B, Altamount Towers',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400026',
        country: 'India'
      },
      subtotalPaise: 2499900,
      taxAmountPaise: 449982,
      shippingAmountPaise: 0,
      discountAmountPaise: 249990,
      totalAmountPaise: 2699892,
      couponCode: 'HERITAGE10',
      trackingNumber: 'PRT-BLUE-98214',
      carrierName: 'Blue Dart Heritage Priority',
      estimatedDelivery: '2026-02-05',
      items: [
        {
          id: 'oi-1',
          orderId: 'ord-1001',
          productId: 'p0000001-0000-0000-0000-000000000001',
          variantId: 'v1',
          productTitle: 'Mithila Handpainted Tussar Silk Kurta Set',
          variantSku: 'PRT-MTH-01-S',
          size: 'S (Chest 38")',
          colorName: 'Raw Silk Ivory / Lotus Madder',
          unitPricePaise: 2499900,
          quantity: 1,
          totalPricePaise: 2499900,
          imageUrl: '/images/products/mithila-handpainted-tussar-silk-saree.jpeg'
        }
      ],
      createdAt: '2026-02-01T14:20:00Z',
      updatedAt: '2026-02-05T18:00:00Z'
    }
  ];

  public reviews: Review[] = [
    {
      id: 'rev-1',
      productId: 'p0000001-0000-0000-0000-000000000001',
      userId: 'u0000001-0000-0000-0000-000000000002',
      authorName: 'Ananya Sharma',
      rating: 5,
      title: 'Living art in handspun Tussar',
      comment: 'The Madhubani brushwork is breathtaking. You can feel the human touch in every single petal and bird motif. Truly heritage redefined.',
      isVerifiedPurchase: true,
      isApproved: true,
      createdAt: '2026-02-06T10:00:00Z'
    }
  ];
}

export const dbStore = new DataStore();
