import { Router } from 'express';
import {
  calculateCheckoutTotals,
  createOrder,
  getOrderById,
  getUserOrders
} from '../controllers/order.controller.js';
import { optionalAuth, authenticateJwt } from '../middlewares/auth.js';
import { validateBody } from '../middlewares/validator.js';
import { CreateOrderSchema } from '../types/index.js';

const router = Router();

router.post('/calculate', optionalAuth, calculateCheckoutTotals);
router.post('/create', optionalAuth, validateBody(CreateOrderSchema), createOrder);
router.get('/my-orders', authenticateJwt, getUserOrders);
router.get('/:id', optionalAuth, getOrderById);

export default router;
