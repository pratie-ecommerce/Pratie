# Pratie — Vercel Production Deployment Handbook

This guide provides step-by-step instructions to deploy the entire **Pratie Luxury Contemporary E-Commerce Platform** on [Vercel](https://vercel.com).

---

## 🏛 Architecture Overview on Vercel

Pratie is organized as a modular monorepo. Because Vercel manages deployments on a per-project basis with dedicated root directories, you create **3 distinct Vercel Projects** linked to the same Git repository:

```text
┌─────────────────────────────────────────────────────────────┐
│                    GitHub / Git Monorepo                    │
└──────────────┬──────────────────┬──────────────────┬────────┘
               │                  │                  │
               ▼                  ▼                  ▼
      ┌─────────────────┐┌─────────────────┐┌─────────────────┐
      │ Pratie Backend  ││ Pratie Store    ││ Pratie Admin    │
      │   REST API      ││   Storefront    ││   Dashboard     │
      │ (Serverless Fn) ││ (Next.js 15 App)││ (Next.js 15 App)│
      │ pratie-backend/ ││pratie-frontend/ ││pratie-dashboard/│
      └────────┬────────┘└────────┬────────┘└────────┬────────┘
               │                  │                  │
               ▼                  ▼                  ▼
      https://api.        https://store.     https://admin.
      pratie.com          pratie.com         pratie.com
```

---

## 🚀 Step 1: Deploy Backend REST API (`pratie-backend`)

The backend is an Express + TypeScript engine pre-configured to execute as a high-speed Vercel Serverless Function via `pratie-backend/api/index.js` and `pratie-backend/vercel.json`.

### 1.1 In Vercel Web Dashboard
1. Go to [vercel.com/new](https://vercel.com/new) and select your Git repository.
2. Under **Project Name**, enter `pratie-backend` (or your preferred name).
3. Under **Root Directory**, click **Edit** and select **`pratie-backend`**.
4. **Framework Preset**: Select **Other**.
5. **Build & Development Settings**:
   - **Build Command**: `npm run build`
   - **Output Directory**: (leave default empty)
   - **Install Command**: `npm install`
6. **Environment Variables**: Add the following:

| Variable Name | Recommended Value | Purpose |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Production optimizations |
| `PORT` | `5000` | Fallback internal port |
| `JWT_SECRET` | *(Random 32+ char secret string)* | Signs customer and admin auth tokens |
| `JWT_EXPIRES_IN` | `7d` | Token expiry duration |
| `FRONTEND_URL` | `https://<your-storefront>.vercel.app` | Storefront origin |
| `DASHBOARD_URL` | `https://<your-dashboard>.vercel.app` | Admin dashboard origin |
| `RAZORPAY_KEY_ID` | `rzp_test_luxury_pratie_mock` | Razorpay simulator key |
| `RAZORPAY_KEY_SECRET` | `rzp_secret_luxury_pratie_mock` | Razorpay simulator secret |
| `SUPABASE_URL` | *(Optional)* | Supabase connection URL (defaults to in-memory store if unset) |
| `SUPABASE_SERVICE_ROLE_KEY` | *(Optional)* | Supabase service key |

7. Click **Deploy**.
8. Note down your production URL (e.g. `https://pratie-backend-xyz.vercel.app`).

### Verify Health Check:
```bash
curl https://<your-backend>.vercel.app/api/health
```
Expected output:
```json
{"status":"ok","service":"Pratie Luxury E-Commerce Engine","currency":"INR (Paise Convention: 1 INR = 100 Paise)"}
```

---

## 🛍 Step 2: Deploy Customer Storefront (`pratie-frontend`)

The customer storefront is a Next.js 15 App Router application optimized for responsive luxury browsing.

### 2.1 In Vercel Web Dashboard
1. Go to [vercel.com/new](https://vercel.com/new) and import the same repository again.
2. Under **Project Name**, enter `pratie-storefront` (or `pratie-frontend`).
3. Under **Root Directory**, click **Edit** and select **`pratie-frontend`**.
4. **Framework Preset**: Vercel will automatically detect **Next.js**.
5. **Environment Variables**: Add:

| Variable Name | Value | Purpose |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://<your-backend>.vercel.app/api` | Connects storefront directly to the deployed REST backend |

6. Click **Deploy**.
7. Once finished, visit your live storefront URL (e.g. `https://pratie-storefront.vercel.app`).

---

## 📊 Step 3: Deploy Executive Admin Dashboard (`pratie-dashboard`)

The admin dashboard is a Next.js 15 App Router administrative suite with real-time analytics, order lifecycle tracking, and CSV catalog imports.

### 3.1 In Vercel Web Dashboard
1. Go to [vercel.com/new](https://vercel.com/new) and import the same repository.
2. Under **Project Name**, enter `pratie-dashboard`.
3. Under **Root Directory**, click **Edit** and select **`pratie-dashboard`**.
4. **Framework Preset**: Vercel will automatically detect **Next.js**.
5. **Environment Variables**: Add:

| Variable Name | Value | Purpose |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://<your-backend>.vercel.app/api` | Connects admin dashboard to the deployed REST backend |

6. Click **Deploy**.
7. Access your live dashboard at `https://pratie-dashboard.vercel.app`.

---

## ⚡ Alternative: One-Command Deployment via Vercel CLI

If you have the [Vercel CLI](https://vercel.com/docs/cli) installed (`npm i -g vercel`), you can deploy directly from your terminal using the monorepo helper scripts:

```bash
# 1. Login to Vercel (first time only)
vercel login

# 2. Deploy Backend API
npm run deploy:backend -- --prod

# 3. Deploy Customer Storefront
npm run deploy:frontend -- --prod

# 4. Deploy Admin Dashboard
npm run deploy:dashboard -- --prod
```

---

## 🔒 Security & CORS Configuration

Pratie's backend is pre-configured with dynamic CORS reflection in [pratie-backend/src/app.ts](file:///Users/ayushjha/tl/Pratie/pratie-backend/src/app.ts):
- Any Vercel preview deployment (`*.vercel.app`) or custom domain is permitted.
- `credentials: true` is fully supported for authorization headers and cookies.
- Helmet security headers protect API endpoints against MIME-sniffing, clickjacking, and XSS.

---

## 🧪 Local Testing vs Production Deployment

| Environment | Backend Port | Storefront Port | Dashboard Port | Data Source |
| :--- | :--- | :--- | :--- | :--- |
| **Local Dev** | `http://localhost:5001` | `http://localhost:3000` | `http://localhost:3001` | In-memory store or local Supabase |
| **Vercel Prod** | `https://<backend>.vercel.app` | `https://<storefront>.vercel.app` | `https://<dashboard>.vercel.app` | In-memory with instant cold-start seed or production Supabase |

---

## 🔑 Demo Access Credentials on Live Site

- **Superadmin Portal**: `admin@pratie.com` / `Admin@123`
- **Customer VIP Account**: `customer@pratie.com` / `Customer@123`
- **Active Promotional Vouchers**:
  - `WELCOME10` (10% off)
  - `PRATIEVIP` (20% off)
  - `LUXE2000` (₹2,000 flat discount)
