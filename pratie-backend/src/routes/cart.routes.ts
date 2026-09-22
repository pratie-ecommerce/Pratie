import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem, syncCart } from '../controllers/cart.controller.js';
import { optionalAuth, authenticateJwt } from '../middlewares/auth.js';
import { validateBody } from '../middlewares/validator.js';
import { AddToCartSchema, UpdateCartItemSchema } from '../types/index.js';

const router = Router();

router.get('/', optionalAuth, getCart);
router.post('/add', optionalAuth, validateBody(AddToCartSchema), addToCart);
router.put('/items/:id', validateBody(UpdateCartItemSchema), updateCartItem);
router.delete('/items/:id', removeCartItem);
router.post('/sync', authenticateJwt, syncCart);

export default router;
