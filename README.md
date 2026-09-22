# PRATIE — Contemporary Luxury E-Commerce Platform

Pratie is an enterprise-grade, full-stack contemporary luxury e-commerce platform built from scratch with architectural elegance and financial integrity.

---

## 🏛️ System Architecture

```
Pratie/
├── database/
│   ├── schema.sql           # Complete PostgreSQL schema (UUID, RLS, triggers, indexes)
│   ├── rls_policies.sql     # Supabase Row Level Security policies
│   └── seed.sql             # Curated luxury catalog seed dataset
│
├── pratie-backend/          # Node.js 20+ / Express / TypeScript REST API (Port 5000)
│   ├── src/
│   │   ├── config/          # Zod-validated environment config
│   │   ├── controllers/     # Auth, Products, Cart, Orders, Payments, Admin, Analytics
│   │   ├── middlewares/     # JWT Auth, RBAC ('customer' | 'admin'), Zod validator, Error handler
│   │   ├── services/        # Razorpay signature HMAC verifier, Order state machine
│   │   ├── db/              # In-memory data store + Supabase client fallback
│   │   └── app.ts / server.ts
│   └── tests/               # Vitest + Supertest integration tests
│
├── pratie-frontend/         # Next.js 16 (App Router) / React 19 / Tailwind v4 (Port 3000)
│   ├── src/
│   │   ├── app/             # Editorial Homepage, Catalog, Product Detail, Cart, Checkout, Orders
│   │   ├── components/      # Glassmorphic Navbar, ProductCard, QuickViewModal, CartDrawer, Footer
│   │   ├── context/         # AuthContext, CartContext, WishlistContext
│   │   └── lib/             # API client, Paise to INR currency formatters
│
├── pratie-dashboard/        # Next.js 16 / React 19 / Tailwind v4 / SWR (Port 3001)
│   ├── src/
│   │   ├── app/             # Executive Overview, Products CRUD + CSV Bulk Import, Order Pipeline, Customers
│   │   └── components/      # Sidebar, Header, KPI metrics cards
│
└── package.json             # Root monorepo runner scripts
```

---

## 💎 Key Features & Implementation Highlights

1. **Strict Integer Currency (Paise Convention)**:
   - All monetary amounts stored as integer Paise (e.g. ₹24,999 is stored as `2499900` Paise).
   - Zero floating-point rounding errors across checkout subtotals, 18% GST tax engine, voucher discounts, and Razorpay transactions.

2. **Razorpay Secure Payment Gateway**:
   - Order creation API (`/api/payments/razorpay/create-order`).
   - Cryptographic HMAC-SHA256 signature verification (`/api/payments/razorpay/verify`).
   - Webhook event consumer for asynchronous payment authorizations (`payment.captured`).

3. **Order Lifecycle State Machine**:
   - States: `pending_payment` ➔ `confirmed` ➔ `processing` ➔ `shipped` ➔ `out_for_delivery` ➔ `delivered` ➔ `completed`.
   - Automated inventory stock reduction upon order confirmation.

4. **Multi-Step Checkout Pipeline**:
   - Step 1: Address selection & validation.
   - Step 2: Voucher promo code engine (`WELCOME10` for 10% off, `PRATIEVIP` for 20% off).
   - Step 3: Razorpay Sandbox simulator / COD selection.
   - Step 4: Stamped order receipt and timeline tracking.

5. **Executive Admin Dashboard**:
   - Real-time revenue metrics, active orders, and low-stock alerts.
   - Single-item product creator + **PapaParse CSV bulk importer & exporter**.
   - Fulfillment status manager with tracking number assignment.
   - Private client spending directory.

---

## 🚀 Getting Started

### 1. Run the Backend REST API
```bash
cd pratie-backend
npm run dev
# Running on http://localhost:5000 (Health Check: http://localhost:5000/api/health)
```

### 2. Run the Frontend Storefront
```bash
cd pratie-frontend
npm run dev
# Running on http://localhost:3000
```

### 3. Run the Admin Dashboard
```bash
cd pratie-dashboard
npm run dev
# Running on http://localhost:3001
```

### 4. Run Automated Backend Tests
```bash
cd pratie-backend
npm test
```

---

## 🔑 Default Demo Credentials
- **Admin**: `admin@pratie.com` / `Admin@123`
- **Customer**: `customer@pratie.com` / `Customer@123`
- **Promotional Codes**: `WELCOME10` (10% off), `PRATIEVIP` (20% off), `LUXE2000` (₹2,000 off)
