import { Router } from 'express';
import {
  getAnalytics,
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminImportProductsCsv,
  adminGetOrders,
  adminUpdateOrderStatus,
  adminGetCustomers
} from '../controllers/admin.controller.js';
import { authenticateJwt, requireRole } from '../middlewares/auth.js';
import { validateBody } from '../middlewares/validator.js';
import { ProductCreateUpdateSchema } from '../types/index.js';

const router = Router();

// Secure admin routes
router.use(authenticateJwt);
router.use(requireRole(['admin', 'superadmin']));

router.get('/analytics', getAnalytics);

// Product Catalog
router.get('/products', adminGetProducts);
router.post('/products', validateBody(ProductCreateUpdateSchema), adminCreateProduct);
router.put('/products/:id', adminUpdateProduct);
router.delete('/products/:id', adminDeleteProduct);
router.post('/products/import-csv', adminImportProductsCsv);

// Orders & Fulfillment
router.get('/orders', adminGetOrders);
router.put('/orders/:id/status', adminUpdateOrderStatus);

// Customers
router.get('/customers', adminGetCustomers);

export default router;
