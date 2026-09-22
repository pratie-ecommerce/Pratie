import { Router } from 'express';
import { verifyRazorpayPayment, handleRazorpayWebhook } from '../controllers/payment.controller.js';
import { validateBody } from '../middlewares/validator.js';
import { RazorpayVerifySchema } from '../types/index.js';

const router = Router();

router.post('/razorpay/verify', validateBody(RazorpayVerifySchema), verifyRazorpayPayment);
router.post('/razorpay/webhook', handleRazorpayWebhook);

export default router;
