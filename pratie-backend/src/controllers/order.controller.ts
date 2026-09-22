import { Request, Response } from 'express';
import { dbStore } from '../db/store.js';
import { OrderService } from '../services/order.service.js';
import { paymentService } from '../services/payment.service.js';
import { Order, OrderItem } from '../types/index.js';

export const calculateCheckoutTotals = async (req: Request, res: Response): Promise<void> => {
  const { items, couponCode } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ success: false, message: 'Cart items are required' });
    return;
  }

  const coupon = couponCode ? dbStore.coupons.find((c) => c.code === couponCode.toUpperCase() && c.isActive) : null;

  const itemDetails = items.map((it: { productId: string; variantId: string; quantity: number }) => {
    const product = dbStore.products.find((p) => p.id === it.productId);
    const variant = product?.variants.find((v) => v.id === it.variantId);
    const unitPricePaise = (product?.basePricePaise || 0) + (variant?.additionalPricePaise || 0);
    return {
      productId: it.productId,
      variantId: it.variantId,
      unitPricePaise,
      quantity: it.quantity
    };
  });

  const totals = OrderService.calculateCartTotals(itemDetails, coupon);

  res.json({
    success: true,
    data: {
      ...totals,
      appliedCoupon: coupon
        ? {
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue
          }
        : null
    }
  });
};

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const {
    shippingAddress,
    billingAddress = shippingAddress,
    couponCode,
    paymentMethod = 'razorpay',
    guestEmail,
    guestPhone,
    notes,
    items: requestItems
  } = req.body;

  // Pull items either from request body (guest direct) or from user's cart in dbStore
  let orderItemsRaw: { productId: string; variantId: string; quantity: number }[] = [];

  if (requestItems && Array.isArray(requestItems) && requestItems.length > 0) {
    orderItemsRaw = requestItems;
  } else if (userId) {
    const userCart = dbStore.cartItems.filter((it) => it.userId === userId);
    orderItemsRaw = userCart.map((c) => ({
      productId: c.productId,
      variantId: c.variantId,
      quantity: c.quantity
    }));
  }

  if (orderItemsRaw.length === 0) {
    res.status(400).json({ success: false, message: 'No items in cart to create an order' });
    return;
  }

  // Build complete Order Items
  const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const orderNumber = `PRT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

  const orderItems: OrderItem[] = [];
  const pricingItems: { unitPricePaise: number; quantity: number }[] = [];

  for (const item of orderItemsRaw) {
    const product = dbStore.products.find((p) => p.id === item.productId);
    const variant = product?.variants.find((v) => v.id === item.variantId);

    if (!product || !variant) {
      res.status(400).json({ success: false, message: `Product or variant not found: ${item.productId}` });
      return;
    }

    if (variant.stockQuantity < item.quantity) {
      res.status(400).json({
        success: false,
        message: `Insufficient stock for ${product.title} (${variant.size || variant.sku}). Available: ${variant.stockQuantity}`
      });
      return;
    }

    const unitPricePaise = product.basePricePaise + (variant.additionalPricePaise || 0);
    const totalPricePaise = unitPricePaise * item.quantity;

    orderItems.push({
      id: `oi_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      orderId,
      productId: product.id,
      variantId: variant.id,
      productTitle: product.title,
      variantSku: variant.sku,
      size: variant.size,
      colorName: variant.colorName,
      unitPricePaise,
      quantity: item.quantity,
      totalPricePaise,
      imageUrl: product.media[0]?.imageUrl
    });

    pricingItems.push({ unitPricePaise, quantity: item.quantity });
  }

  const coupon = couponCode ? dbStore.coupons.find((c) => c.code === couponCode.toUpperCase() && c.isActive) : null;
  const totals = OrderService.calculateCartTotals(pricingItems, coupon);

  // Initialize Razorpay order
  let razorpayOrderData: { id: string; amount: number; currency: string } | null = null;
  if (paymentMethod === 'razorpay') {
    razorpayOrderData = await paymentService.createRazorpayOrder(totals.totalAmountPaise, orderNumber);
  }

  const newOrder: Order = {
    id: orderId,
    orderNumber,
    userId,
    guestEmail,
    guestPhone,
    status: paymentMethod === 'cod' ? 'confirmed' : 'pending_payment',
    paymentStatus: paymentMethod === 'cod' ? 'authorized' : 'pending',
    paymentMethod,
    razorpayOrderId: razorpayOrderData?.id,
    shippingAddress,
    billingAddress,
    subtotalPaise: totals.subtotalPaise,
    taxAmountPaise: totals.taxAmountPaise,
    shippingAmountPaise: totals.shippingAmountPaise,
    discountAmountPaise: totals.discountAmountPaise,
    totalAmountPaise: totals.totalAmountPaise,
    couponCode: coupon?.code,
    items: orderItems,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  dbStore.orders.push(newOrder);

  // If order is confirmed immediately (e.g. COD), deduct inventory stock
  if (newOrder.status === 'confirmed') {
    OrderService.deductInventoryStock(newOrder);
  }

  // Clear user cart if authenticated
  if (userId) {
    dbStore.cartItems = dbStore.cartItems.filter((it) => it.userId !== userId);
  }

  res.status(201).json({
    success: true,
    message: 'Order initiated successfully',
    data: {
      order: newOrder,
      razorpayOrder: razorpayOrderData
    }
  });
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const order = dbStore.orders.find((o) => o.id === id || o.orderNumber === id);

  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }

  res.json({ success: true, data: order });
};

export const getUserOrders = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const userOrders = dbStore.orders
    .filter((o) => o.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({ success: true, data: userOrders });
};
