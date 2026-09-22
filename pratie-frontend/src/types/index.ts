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

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
}

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  streetLine1: string;
  streetLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
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

export interface Review {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  title?: string;
  comment: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: string;
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
  reviews?: Review[];
  relatedProducts?: Product[];
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
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}
