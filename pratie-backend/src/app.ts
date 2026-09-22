import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const createApp = (): Express => {
  const app = express();

  // Global Security & Parsers
  app.use(helmet());
  app.use(
    cors({
      origin: (_origin, callback) => {
        // Echo incoming origin to allow credentialed requests from localhost, Vercel previews, and custom domains
        callback(null, true);
      },
      credentials: true
    })
  );
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Pratie Luxury E-Commerce Engine',
      timestamp: new Date().toISOString(),
      currency: 'INR (Paise Convention: 1 INR = 100 Paise)'
    });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/admin', adminRoutes);

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
