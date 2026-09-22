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

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  size?: string;
  colorName?: string;
  additionalPricePaise: number;
  stockQuantity: number;
  isAvailable: boolean;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  skuPrefix: string;
  shortDescription: string;
  description: string;
  categoryName?: string;
  brandName?: string;
  state?: string;
  clothingType?: 'Saree' | 'Suit' | 'Kurta Set' | 'Lehenga' | 'Heirloom Accent' | string;
  craftTechnique?: string;
  fabric?: string;
  basePricePaise: number;
  compareAtPricePaise?: number;
  isFeatured: boolean;
  isPublished: boolean;
  isNewArrival: boolean;
  ratingAverage: number;
  ratingCount: number;
  tags: string[];
  media: { imageUrl: string }[];
  variants: ProductVariant[];
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productTitle: string;
  variantSku: string;
  size?: string;
  colorName?: string;
  unitPricePaise: number;
  quantity: number;
  totalPricePaise: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    streetLine1: string;
    city: string;
    state: string;
    postalCode: string;
  };
  subtotalPaise: number;
  taxAmountPaise: number;
  shippingAmountPaise: number;
  discountAmountPaise: number;
  totalAmountPaise: number;
  couponCode?: string;
  trackingNumber?: string;
  carrierName?: string;
  items: OrderItem[];
  createdAt: string;
}

export interface Customer {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  ordersCount: number;
  totalSpentPaise: number;
  createdAt: string;
}

export interface AnalyticsMetrics {
  totalRevenuePaise: number;
  activeOrders: number;
  lowStockProducts: number;
  totalCustomers: number;
  totalProductsCount: number;
}
