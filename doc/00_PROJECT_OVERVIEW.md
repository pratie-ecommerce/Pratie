# PRATIÈ — Sacred Looms of Bharat (Project Master Overview)

## 1. Brand & Product Identity
- **Brand Name**: **Pratiè** (Sacred Looms of Bharat)
- **Design & Experience Benchmark**: **[Taneira (by Tata / Titan Company)](https://www.taneira.com/)**
- **Tagline**: Handcrafted Sarees & Royal Suits • 33 States & UTs of India
- **Core Domain & Strict Business Boundary**: Pratiè specializes **strictly and exclusively in authentic Indian Handcrafted Sarees and Royal Suits / Kurta Sets**.
  - All non-saree / non-suit products (clutches, bags, shawls, stoles, shoes, accessories) are strictly purged and excluded from the platform.
  - Every garment represents a certified regional master craft from the 28 States and 8 Union Territories of India (e.g., Banarasi, Kanjeevaram, Muga Silk, Paithani, Patan Patola, Kashmiri Tilla, Chikankari).
  - Every piece is authenticated with **Silk Mark India** certification and **Geographical Indication (GI)** provenance.
- **Monetary Convention**: Integer Paise currency system (1 INR = 100 Paise, e.g. ₹28,999 is stored and handled as `2899900` integer) eliminating floating-point rounding errors.

---

## 2. Multi-App Architecture

```
Pratie/
├── database/                   # PostgreSQL DDL, Supabase RLS, Seed scripts
│   ├── schema.sql              # 14 normalized tables, foreign keys, triggers, indexes
│   ├── rls_policies.sql        # Row Level Security access rules
│   └── seed.sql                # Curated catalog seed data
│
├── pratie-backend/             # Node.js 20+ / Express / TypeScript REST API (Port 5000)
│   ├── src/
│   │   ├── config/             # Zod-validated environment config
│   │   ├── controllers/        # Auth, Products, Cart, Orders, Payments, Admin, Analytics
│   │   ├── middlewares/        # JWT Authentication, RBAC, Zod Validator, Error Handler
│   │   ├── services/           # Razorpay Signature HMAC Verifier, Order State Machine
│   │   ├── db/                 # In-memory store with live Supabase client fallback
│   │   ├── routes/             # Express API route endpoints
│   │   └── server.ts           # App bootstrap
│   └── tests/                  # Vitest + Supertest integration tests
│
├── pratie-frontend/            # Next.js 16 (App Router) Storefront (Port 3000)
│   ├── src/
│   │   ├── app/                # Home, Products, Product Detail, Cart, Checkout, Orders, Auth
│   │   ├── components/         # Glassmorphic Navbar, ProductCard, QuickView, CartDrawer, Footer
│   │   ├── context/            # AuthContext, CartContext, WishlistContext
│   │   ├── lib/                # API client, INR/Paise currency utilities
│   │   └── styles/             # Tailwind CSS v4 luxury obsidian & gold design tokens
│   └── public/                 # Static brand assets
│
├── pratie-dashboard/           # Next.js 16 Executive Admin Portal (Port 3001)
│   ├── src/
│   │   ├── app/                # Overview KPI Metrics, Products CRUD, Orders Pipeline, Customers
│   │   ├── components/         # Sidebar, Header, PapaParse CSV Importer & Exporter
│   │   ├── lib/                # Admin API Client, Mock dataset
│   │   └── styles/             # Dark analytical UI tokens
│
├── doc/                        # Master documentation (gitignored)
└── package.json                # Root monorepo orchestration scripts
```

---

## 3. Technology Stack Matrix

| Component | Framework / Library | Key Responsibilities |
| :--- | :--- | :--- |
| **Backend REST API** | Express.js 4, TypeScript, Node.js 20+ | REST API, Business logic, Auth, Razorpay integration, Order lifecycle |
| **API Validation** | Zod 3 | Strong schema validation for environment variables & all HTTP payloads |
| **Backend Testing** | Vitest 3, Supertest 7 | Automated unit & endpoint integration testing |
| **Database ORM/Client**| Supabase JS 2 / PostgreSQL Pool | Production PostgreSQL with RLS + local in-memory fallback store |
| **Storefront App** | Next.js 16 (App Router), React 19, TypeScript | High-performance customer facing storefront, SEO, SSR & CSR |
| **Storefront Styling** | Tailwind CSS v4, Vanilla CSS tokens | Luxury glassmorphism, gold accents, dark & light themes |
| **Storefront State** | React Context + LocalStorage | Persistent Bag (`CartContext`), `WishlistContext`, `AuthContext` |
| **Admin Dashboard** | Next.js 16, React 19, Tailwind CSS v4 | Executive metrics, Product catalog management, Order fulfillment |
| **CSV Import / Export**| PapaParse 5 | Bulk CSV product catalog ingestion and inventory export |
| **Payment Gateway** | Razorpay SDK 2 | Order creation, HMAC-SHA256 signature verification, webhook events |
| **Notifications** | Sonner 2 | Smooth toast notifications across storefront and dashboard |

---

## 4. Port Allocations & Services

- **Storefront App**: `http://localhost:3000`
- **Admin Dashboard**: `http://localhost:3001`
- **Backend REST API**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/api/health`

---

## 5. Quick Run Commands
```bash
# Backend (Port 5000)
npm run dev:backend

# Storefront (Port 3000)
npm run dev:frontend

# Admin Dashboard (Port 3001)
npm run dev:dashboard

# Run Vitest Tests
npm run test:backend

# Build All Apps
npm run build:all
```
