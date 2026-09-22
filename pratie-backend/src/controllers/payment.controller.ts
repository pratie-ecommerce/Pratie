import { Request, Response } from 'express';
import { dbStore } from '../db/store.js';
import { paymentService } from '../services/payment.service.js';
import { OrderService } from '../services/order.service.js';

export const verifyRazorpayPayment = async (req: Request, res: Response): Promise<void> => {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  const order = dbStore.orders.find((o) => o.id === orderId || o.razorpayOrderId === razorpayOrderId);
  if (!order) {
    res.status(404).json({ success: false, message: 'Associated order not found' });
    return;
  }

  const isValid = paymentService.verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
  if (!isValid) {
    order.paymentStatus = 'failed';
    res.status(400).json({ success: false, message: 'Invalid payment signature verification failed' });
    return;
  }

  // Update order status
  order.paymentStatus = 'captured';
  order.status = 'confirmed';
  order.razorpayPaymentId = razorpayPaymentId;
  order.razorpaySignature = razorpaySignature;
  order.updatedAt = new Date().toISOString();

  // Deduct inventory
  OrderService.deductInventoryStock(order);

  res.json({
    success: true,
    message: 'Payment verified and order confirmed',
    data: {
      order
    }
  });
};

export const handleRazorpayWebhook = async (req: Request, res: Response): Promise<void> => {
  const event = req.body.event;
  const payload = req.body.payload;

  console.log(`Received Razorpay webhook event: ${event}`);

  if (event === 'payment.captured') {
    const payment = payload.payment.entity;
    const order = dbStore.orders.find((o) => o.razorpayOrderId === payment.order_id);
    if (order) {
      order.paymentStatus = 'captured';
      order.status = 'confirmed';
      order.razorpayPaymentId = payment.id;
      OrderService.deductInventoryStock(order);
    }
  }

  res.json({ status: 'ok' });
};
