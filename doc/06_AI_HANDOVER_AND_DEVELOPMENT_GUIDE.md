# AI Handover & Developer Maintenance Guide

Welcome to the **Pratiè** codebase. If you are an incoming AI model or software engineer tasked with maintaining, extending, or refactoring this platform, this document outlines the fundamental principles, architectural conventions, and workflows you must adhere to.

---

## 1. Non-Negotiable Core Conventions

### 1.0 Strict Business Domain: Exclusively "Sarees & Suits"
- **Absolute Rule**: Pratiè specializes **strictly and exclusively in authentic Indian Handcrafted Sarees and Royal Suits / Kurta Sets**.
- **Prohibited Product Categories**: NEVER add clutches, handbags, footwear, jewelry, accessories, shawls, stoles, wraps, or western wear. Any non-saree/non-suit items will be rejected by the product owners.
- **Prohibited Imagery**: All photography MUST depict authentic Indian traditional sarees and royal suit models. NEVER use photos of western shirts, sneakers, folded apparel, or handbag clutches.
- **33 States & UTs Representation**: All garments originate from certified master weaver clusters across the 28 States and 8 Union Territories of India, tagged with **Silk Mark India** and **Geographical Indication (GI)** credentials.

### 1.1 Taneira Design Standard & Aesthetics Benchmark
- All UI layouts, navigations, filters, typography, and color schemes MUST adhere to the luxury design standards of **[Taneira (by Tata)](https://www.taneira.com/)**.
- Refer to [`07_TANEIRA_DESIGN_TRANSFORMATION_LOG.md`](07_TANEIRA_DESIGN_TRANSFORMATION_LOG.md) for the active progress roadmap and component guides.
- Always preserve the signature color palette: Deep Royal Crimson (`#4A0D18`), Antique Gold (`#C5A059`), and Warm Sandalwood/Ivory (`#FAF8F5`).

### 1.2 Integer Currency Convention (Paise)
- **Rule**: NEVER store or calculate money in floating-point Rupees (`float` or `double`).
- **Convention**: Always calculate and store monetary figures in integer **Paise** (`1 INR = 100 Paise`).
- **Formatting**: Use the helper `formatPaise(paise)` located in `src/lib/utils.ts` (storefront) and `src/lib/api.ts` (dashboard) for UI formatting.

### 1.3 Dual-Mode Architecture (Mock / Local + Live Supabase / Razorpay)
- The codebase is designed with zero friction out-of-the-box:
  - When environment variables (`SUPABASE_URL`, `RAZORPAY_KEY_SECRET`) are absent or mock tokens are detected, the backend and frontends automatically execute with the rich seeded in-memory store.
  - When live credentials are supplied in `.env`, the system seamlessly connects to the live database and production Razorpay gateway.
- Do not remove the fallback mock datasets as they ensure uninterrupted automated testing and standalone local execution.

### 1.4 Strict Zod Validation on API Payloads
- All incoming HTTP request bodies in `pratie-backend` MUST be validated through Zod schemas in `src/types/index.ts` using the `validateBody(Schema)` middleware.

---

## 2. Common Engineering Tasks & Workflows

### 2.1 Adding a New API Endpoint
1. Define the TypeScript interfaces and Zod schema in `pratie-backend/src/types/index.ts`.
2. Implement controller logic in `pratie-backend/src/controllers/`.
3. Register the endpoint in `pratie-backend/src/routes/`.
4. Attach test cases in `pratie-backend/tests/api.test.ts` and run `npm test`.

### 2.2 Adding a New Catalog Department or Product
- **Via Admin UI**: Navigate to `http://localhost:3001/products` and click `Add Creation` or upload a CSV file.
- **Via Database Seed**: Add records to `database/seed.sql` ensuring prices are specified in integer Paise.

### 2.3 Extending the Order State Machine
- To add new states (e.g., `'exchange_requested'`), update:
  1. `OrderStatus` type in `pratie-backend/src/types/index.ts`.
  2. `OrderService.validTransitions` in `pratie-backend/src/services/order.service.ts`.
  3. PostgreSQL `order_status` ENUM in `database/schema.sql`.

---

## 3. Running & Verifying the Project

```bash
# 1. Run all backend tests
npm --prefix pratie-backend test

# 2. Verify TypeScript build of backend
npm --prefix pratie-backend run build

# 3. Verify Next.js frontend build
npm --prefix pratie-frontend run build

# 4. Verify Next.js admin dashboard build
npm --prefix pratie-dashboard run build
```

---

## 4. Default System Credentials & Tokens

- **Admin User**: `admin@pratie.com` / `Admin@123`
- **Customer User**: `customer@pratie.com` / `Customer@123`
- **Promo Codes**:
  - `WELCOME10`: 10% discount on orders $\ge$ ₹5,000 (capped at ₹2,500)
  - `PRATIEVIP`: 20% discount on orders $\ge$ ₹15,000 (capped at ₹5,000)
  - `LUXE2000`: Flat ₹2,000 off on orders $\ge$ ₹10,000
