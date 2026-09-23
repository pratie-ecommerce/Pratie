import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();

describe('Pratie API Endpoints Suite', () => {
  it('GET /api/health returns valid service status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toContain('Pratie Luxury');
  });

  it('GET /api/products returns curated catalog', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.products.length).toBeGreaterThan(0);
    expect(res.body.data.products[0]).toHaveProperty('basePricePaise');
  });

  it('GET /api/products with search query filters products', async () => {
    const res = await request(app).get('/api/products?search=mithila');
    expect(res.status).toBe(200);
    expect(res.body.data.products.some((p: any) => p.title.includes('Mithila') || p.categoryName?.includes('Mithila'))).toBe(true);
  });

  it('POST /api/auth/login authenticates customer', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'customer@pratie.com', password: 'Customer@123' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user.email).toBe('customer@pratie.com');
  });

  it('GET /api/products with state and clothingType query filters traditional clothes', async () => {
    const resState = await request(app).get('/api/products?state=Bihar');
    expect(resState.status).toBe(200);
    expect(resState.body.data.products.every((p: any) => p.state === 'Bihar')).toBe(true);

    const resType = await request(app).get('/api/products?clothingType=Saree');
    expect(resType.status).toBe(200);
    expect(resType.body.data.products.every((p: any) => p.clothingType === 'Saree')).toBe(true);
  });

  it('POST /api/orders/calculate calculates totals with coupon', async () => {
    const res = await request(app)
      .post('/api/orders/calculate')
      .send({
        items: [
          {
            productId: 'p0000001-0000-0000-0000-000000000002',
            variantId: 'v1',
            quantity: 1
          }
        ],
        couponCode: 'HERITAGE10'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.subtotalPaise).toBe(2499900);
    expect(res.body.data.discountAmountPaise).toBe(249990);
    expect(res.body.data.appliedCoupon.code).toBe('HERITAGE10');
  });
});
