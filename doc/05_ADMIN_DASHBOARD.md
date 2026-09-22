# Admin Management Portal Architecture (`pratie-dashboard`)

Framework: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4

---

## 1. Page Routes & Functionality

| Route | File Path | Core Capabilities |
| :--- | :--- | :--- |
| `/` | `src/app/page.tsx` | Executive analytics (Total Revenue ₹ in Paise, Active Orders, Low Stock Alerts, Customers) + recent transactions table |
| `/products` | `src/app/products/page.tsx` | Full catalog CRUD + **PapaParse CSV bulk importer** + **CSV catalog exporter** + inventory stock editor |
| `/orders` | `src/app/orders/page.tsx` | Consignment fulfillment pipeline, status transitions (`processing` ➔ `shipped` ➔ `delivered`), tracking number assignment |
| `/customers`| `src/app/customers/page.tsx` | VIP patron registry, contact directory, and cumulative lifetime spend analytics |

---

## 2. PapaParse CSV Bulk Import & Export Specification

### 2.1 CSV Import Format
The CSV file can be uploaded directly from the dashboard header (`CSV Import` button):

```csv
title,sku_prefix,category,brand,base_price_paise,stock,image_url,description,tags
"Vicuna Cashmere Overcoat","PRT-OVC-01","Ready-to-Wear","Atelier Pratie",4500000,10,"https://images.unsplash.com/photo-1594938298603-c8148c4dae35","Hand-stitched in Biella with raw horn buttons","cashmere,outerwear"
"Gilded Chronograph 42mm","PRT-WAT-04","Horology & Watches","Aura Chrono",5200000,5,"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9","24k rose gold plated bezel with automatic calibre","watches,swiss"
```

### 2.2 CSV Export Format
Clicking `Export CSV` automatically builds a clean CSV snapshot with current inventory levels and timestamps.

---

## 3. Order Status Modification Workflow

Admins can manage fulfillment status directly from the `/orders` table:
1. View client consignment details & delivery address.
2. Click **Update Fulfillment**.
3. Enter or update the **Carrier Tracking Number** (e.g. `PRT-FEDEX-98214`).
4. Click **Mark Shipped** or **Mark Delivered** to trigger the transition.
5. The change is instantly synced to the database and visible on the client's order tracking page.
