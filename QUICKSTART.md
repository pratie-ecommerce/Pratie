# Pratie — Colleague Handover & Quickstart Guide

Welcome to the **Pratie Luxury Contemporary E-Commerce Platform** codebase.

This project is organized as a modular monorepo containing the REST API backend, the customer storefront, the executive administrative dashboard, and comprehensive technical documentation.

---

## 📁 Repository Structure

```text
Pratie/
├── database/            # PostgreSQL schemas, RLS policies, and catalog seed SQL
├── doc/                 # Detailed architectural & operational documentation (8 guides)
│   ├── 00_PROJECT_OVERVIEW.md
│   ├── 01_DATABASE_AND_MODELS.md
│   ├── 02_BACKEND_API_REFERENCE.md
│   ├── 03_PAYMENTS_AND_CHECKOUT.md
│   ├── 04_FRONTEND_STOREFRONT.md
│   ├── 05_ADMIN_DASHBOARD.md
│   ├── 06_AI_HANDOVER_AND_DEVELOPMENT_GUIDE.md
│   └── 07_TANEIRA_DESIGN_TRANSFORMATION_LOG.md
├── pratie-backend/      # Express + TypeScript REST API Engine (Port 5000)
├── pratie-frontend/     # Next.js 15 App Router Customer Storefront (Port 3000)
├── pratie-dashboard/    # Next.js 15 App Router Admin Dashboard (Port 3001)
├── package.json         # Monorepo runner scripts
└── README.md            # Comprehensive project details
```

---

## ⚡ 1-Minute Quickstart

### Prerequisites
- Node.js 18+ (Node.js 20 recommended)
- npm 9+

### 1. Install All Dependencies
From the root directory, run:
```bash
npm run install:all
```
*(Or navigate to each folder: `cd pratie-backend && npm i`, `cd ../pratie-frontend && npm i`, `cd ../pratie-dashboard && npm i`)*

### 2. Run the Development Servers
Open 3 terminals (or run the scripts from the root):

- **Backend REST API (Port 5000)**:
  ```bash
  npm run dev:backend
  # or: cd pratie-backend && npm run dev
  ```
  Health check: [http://localhost:5000/api/health](http://localhost:5000/api/health)

- **Customer Storefront (Port 3000)**:
  ```bash
  npm run dev:frontend
  # or: cd pratie-frontend && npm run dev
  ```
  Storefront: [http://localhost:3000](http://localhost:3000)

- **Admin Dashboard (Port 3001)**:
  ```bash
  npm run dev:dashboard
  # or: cd pratie-dashboard && npm run dev
  ```
  Dashboard: [http://localhost:3001](http://localhost:3001)

---

## 🔑 Demo Access & Test Credentials

- **Admin User**: `admin@pratie.com` / `Admin@123`
- **Customer User**: `customer@pratie.com` / `Customer@123`
- **Promo Voucher Codes**:
  - `WELCOME10` — 10% discount
  - `PRATIEVIP` — 20% discount
  - `LUXE2000` — ₹2,000 flat discount

---

## 📖 Deep-Dive Documentation
For full architectural designs, database schemas, and API references, check the `doc/` folder:
- [00_PROJECT_OVERVIEW.md](file:///doc/00_PROJECT_OVERVIEW.md) — High-level architecture & design philosophy
- [02_BACKEND_API_REFERENCE.md](file:///doc/02_BACKEND_API_REFERENCE.md) — Endpoints, payloads, and auth rules
- [03_PAYMENTS_AND_CHECKOUT.md](file:///doc/03_PAYMENTS_AND_CHECKOUT.md) — Razorpay HMAC verification & Paise currency engine
- [06_AI_HANDOVER_AND_DEVELOPMENT_GUIDE.md](file:///doc/06_AI_HANDOVER_AND_DEVELOPMENT_GUIDE.md) — Extension points & engineering guidelines
- [08_VERCEL_DEPLOYMENT_GUIDE.md](file:///doc/08_VERCEL_DEPLOYMENT_GUIDE.md) — Step-by-step Vercel deployment instructions for all 3 apps
