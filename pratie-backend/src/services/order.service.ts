import { dbStore } from '../db/store.js';
import { Order, OrderStatus, Coupon } from '../types/index.js';

export class OrderService {
  private static validTransitions: Record<OrderStatus, OrderStatus[]> = {
    pending_payment: ['confirmed', 'cancelled'],
    confirmed: ['processing', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['out_for_delivery', 'delivered', 'returned'],
    out_for_delivery: ['delivered', 'returned'],
    delivered: ['completed', 'returned'],
    completed: ['returned'],
    cancelled: [],
    refunded: [],
    returned: ['refunded']
  };

  static isValidTransition(currentStatus: OrderStatus, nextStatus: OrderStatus): boolean {
    const allowed = this.validTransitions[currentStatus] || [];
    return allowed.includes(nextStatus);
  }

  static calculateCartTotals(
    items: { unitPricePaise: number; quantity: number }[],
    coupon?: Coupon | null
  ) {
    const subtotalPaise = items.reduce((acc, it) => acc + it.unitPricePaise * it.quantity, 0);

    let discountAmountPaise = 0;
    if (coupon && coupon.isActive) {
      if (coupon.discountType === 'percentage') {
        const rawDiscount = Math.round((subtotalPaise * coupon.discountValue) / 100);
        discountAmountPaise = coupon.maxDiscountAmountPaise
          ? Math.min(rawDiscount, coupon.maxDiscountAmountPaise)
          : rawDiscount;
      } else if (coupon.discountType === 'fixed_amount') {
        discountAmountPaise = Math.min(coupon.discountValue, subtotalPaise);
      }
    }

    const discountedSubtotal = Math.max(0, subtotalPaise - discountAmountPaise);
    // 18% GST calculation on discounted subtotal
    const taxAmountPaise = Math.round(discountedSubtotal * 0.18);
    // Free complimentary luxury shipping on all orders over ₹5,000 (500000 Paise)
    const shippingAmountPaise = discountedSubtotal >= 500000 || discountedSubtotal === 0 ? 0 : 49900;
    const totalAmountPaise = discountedSubtotal + taxAmountPaise + shippingAmountPaise;

    return {
      subtotalPaise,
      discountAmountPaise,
      taxAmountPaise,
      shippingAmountPaise,
      totalAmountPaise
    };
  }

  static deductInventoryStock(order: Order): void {
    for (const item of order.items) {
      if (!item.variantId) continue;
      for (const product of dbStore.products) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (variant) {
          variant.stockQuantity = Math.max(0, variant.stockQuantity - item.quantity);
          if (variant.stockQuantity === 0) {
            variant.isAvailable = false;
          }
        }
      }
    }
  }
}
