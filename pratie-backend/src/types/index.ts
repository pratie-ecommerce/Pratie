import { z } from 'zod';

export type UserRole = 'guest' | 'customer' | 'admin' | 'superadmin';

export type OrderStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'returned';

export type PaymentStatus = 'pending' | 'authorized' | 'captured' | 'failed' | 'refunded';
export type PaymentMethod = 'razorpay' | 'cod' | 'upi' | 'card' | 'netbanking';
export type DiscountType = 'percentage' | 'fixed_amount' | 'free_shipping';

export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  userId?: string;
  fullName: string;
  phone: string;
  streetLine1: string;
  streetLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  size?: string;
  colorName?: string;
  colorHex?: string;
  additionalPricePaise: number;
  stockQuantity: number;
  isAvailable: boolean;
}

export interface ProductMedia {
  id: string;
  productId: string;
  imageUrl: string;
  altText: string;
  displayOrder: number;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  skuPrefix: string;
  shortDescription: string;
  description: string;
  categoryId?: string;
  categoryName?: string;
  brandId?: string;
  brandName?: string;
  collectionId?: string;
  state?: string;
  clothingType?: 'Saree' | 'Suit';
  craftTechnique?: string;
  fabric?: string;
  basePricePaise: number;
  compareAtPricePaise?: number;
  taxRatePercentage: number;
  isFeatured: boolean;
  isPublished: boolean;
  isNewArrival: boolean;
  ratingAverage: number;
  ratingCount: number;
  tags: string[];
  material?: string;
  careInstructions?: string;
  media: ProductMedia[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  userId?: string;
  sessionId?: string;
  productId: string;
  variantId: string;
  quantity: number;
  product?: Product;
  variant?: ProductVariant;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmountPaise: number;
  maxDiscountAmountPaise?: number;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  variantId?: string;
  productTitle: string;
  variantSku: string;
  size?: string;
  colorName?: string;
  unitPricePaise: number;
  quantity: number;
  totalPricePaise: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  guestEmail?: string;
  guestPhone?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  shippingAddress: Address;
  billingAddress: Address;
  subtotalPaise: number;
  taxAmountPaise: number;
  shippingAmountPaise: number;
  discountAmountPaise: number;
  totalAmountPaise: number;
  couponCode?: string;
  trackingNumber?: string;
  carrierName?: string;
  estimatedDelivery?: string;
  notes?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId?: string;
  authorName: string;
  rating: number;
  title?: string;
  comment: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: string;
}

// Zod Schemas
export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().optional()
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const AddToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variantId: z.string().min(1, 'Variant ID is required'),
  quantity: z.number().int().positive().default(1),
  sessionId: z.string().optional()
});

export const UpdateCartItemSchema = z.object({
  quantity: z.number().int().min(0)
});

export const ApplyCouponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required'),
  subtotalPaise: z.number().int().positive()
});

export const CreateOrderSchema = z.object({
  shippingAddress: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(6),
    streetLine1: z.string().min(3),
    streetLine2: z.string().optional(),
    landmark: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    postalCode: z.string().min(3),
    country: z.string().default('India')
  }),
  billingAddress: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(6),
    streetLine1: z.string().min(3),
    streetLine2: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    postalCode: z.string().min(3),
    country: z.string().default('India')
  }).optional(),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(['razorpay', 'cod', 'upi', 'card', 'netbanking']).default('razorpay'),
  guestEmail: z.string().email().optional(),
  guestPhone: z.string().optional(),
  notes: z.string().optional()
});

export const RazorpayVerifySchema = z.object({
  orderId: z.string().min(1),
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1)
});

export const ProductCreateUpdateSchema = z.object({
  title: z.string().min(2),
  slug: z.string().optional(),
  skuPrefix: z.string().min(2),
  shortDescription: z.string().min(5),
  description: z.string().min(10),
  categoryId: z.string().optional(),
  categoryName: z.string().optional(),
  brandId: z.string().optional(),
  brandName: z.string().optional(),
  state: z.string().optional(),
  clothingType: z.string().optional(),
  craftTechnique: z.string().optional(),
  fabric: z.string().optional(),
  basePricePaise: z.number().int().positive(),
  compareAtPricePaise: z.number().int().positive().optional(),
  taxRatePercentage: z.number().default(18),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  isNewArrival: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  material: z.string().optional(),
  careInstructions: z.string().optional(),
  images: z.array(z.string()).default([]),
  variants: z.array(
    z.object({
      sku: z.string(),
      size: z.string().optional(),
      colorName: z.string().optional(),
      colorHex: z.string().optional(),
      additionalPricePaise: z.number().default(0),
      stockQuantity: z.number().int().min(0).default(10),
      isAvailable: z.boolean().default(true)
    })
  ).default([])
});
