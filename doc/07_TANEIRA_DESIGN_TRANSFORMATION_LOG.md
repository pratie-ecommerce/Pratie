# 07. Taneira Design & Architecture Transformation Log

This document records the architectural, aesthetic, and functional transformation of the **Pratiè** e-commerce platform to match the luxury design, navigation taxonomy, and customer experience of **[Taneira (by Titan / Tata Group)](https://www.taneira.com/)**.

---

## 1. Design System & Tokens (Taneira Signature)

| Token Name | Hex Code | Purpose / Application |
|---|---|---|
| **Deep Royal Crimson** | `#4A0D18` | Primary brand accent, active tabs, buttons, luxury ribbons |
| **Burgundy Noir** | `#1F070B` | Cinematic dark mode sections, hero slider backdrops |
| **Antique Gold / Zari** | `#C5A059` / `#D4AF37` | Gold foil borders, certificate seals, rating stars, accents |
| **Sandalwood & Ivory** | `#FAF8F5` / `#F5EFE6` | Light background panels, card surfaces, spotlight banners |
| **Charcoal Slate** | `#1A1A1A` | High-contrast readable typography |
| **Soft Border Linen** | `#E2D9CC` | Subtle luxury separator lines and card borders |

### Typography
- **Headings / Serif**: Playfair Display / Cormorant Garamond style serif (`font-heading`).
- **Body / Sans**: Inter / Montserrat geometric sans (`font-sans`).

---

## 2. Core Platform Invariants & Data Integrity

- **Strict Product Scope**: Pratiè specializes **strictly and exclusively in Handcrafted Sarees and Royal Suits**.
  - All non-saree/non-suit items (handbags, clutches, stoles, shawls, wraps) have been removed or updated to their state-authentic traditional Saree or Royal Suit equivalent.
  - All non-attire images (sneakers, handbag clutches, folded shirts) have been purged and replaced exclusively with genuine Indian Saree and Royal Suit photography.
- **33 States & UTs Representation**: All 28 States and 8 Union Territories of India are actively cataloged with traditional Sarees and Royal Suits in [`pratie-frontend/src/lib/stateCraftsData.ts`](../pratie-frontend/src/lib/stateCraftsData.ts).
- **46 Certified Traditional Attires**: Full inventory of genuine state garments strictly categorized as `Saree` (28 products) or `Suit` (18 products) with prices, artisan lineages, and GI tags defined in [`pratie-frontend/src/lib/api.ts`](../pratie-frontend/src/lib/api.ts) and [`pratie-backend/src/db/store.ts`](../pratie-backend/src/db/store.ts).
- **Certifications**: Every product incorporates authentic **Silk Mark India** and **Geographical Indication (GI)** tags.

---

## 3. Transformation Roadmap & Progress Tracker

| Step # | Module / Page | Status | Description & Highlights |
|---|---|---|---|
| **Step 1** | Taneira 3-Tier Header | **COMPLETED** | Top ticker with `FESTIVE15`, left transparent logo, center rounded search pill, mega-menus (`Navbar.tsx`). |
| **Step 2** | Panoramic Hero & Trust Ribbon | **COMPLETED** | 4 full-width sliding campaigns, dual pill CTAs, 5-pillar trust ribbon (`Silk Mark`, `33 States`, `Free Delivery`, `Fall & Piko`, `Concierge`). |
| **Step 3** | Shop By Iconic Weaves | **COMPLETED** | 10 circular arched craft portraits with gold border rings (*Banarasi, Kanjeevaram, Muga, Chikankari, etc.*). |
| **Step 4** | Trending Looms Tabbed Showcase | **COMPLETED** | Product card grid with tabs strictly for *All Masterpieces*, *Pure Silk Sarees*, and *Royal Suits & Sets*. |
| **Step 5** | Occasions & 33 States Matrix | **COMPLETED** | Arched occasion cards (*Bridal, Sangeet, Pooja, Cocktail*), State of the Week spotlight banner (*Assam Muga Silk*), and regional matrix filters. |
| **Step 6** | Taneira Catalog & Filter Page | **COMPLETED** | Multi-faceted sticky filter sidebar (*Craft with search, Fabric, Occasion, State of origin, Price presets & slider, Color palette swatches, Silk Mark/GI tag checkboxes*), active filter chips with `Clear All`, Taneira sort dropdown, 3 vs 4 column layout toggle (`/products`). |
| **Step 6.5**| Strict Saree & Suit Purge | **COMPLETED** | Removed all non-saree/non-suit items, eliminated "Heirloom Accents" category, purged all sneaker/clutch/shirt images, and mapped all 33 states exclusively to traditional Sarees and Royal Suits. |
| **Step 7** | Luxury Product Detail Page | **COMPLETED** | Multi-angle vertical gallery + hover magnifier, Fall & Piko guarantee, custom blouse tailoring engine, Pincode delivery estimator, 4 trust pillars, artisan story accordions, patron reviews (`/products/[slug]`). |
| **Step 8** | Slide-Over Cart & Card Hover Flip | **PENDING** | Slide-out cart drawer with free shipping bar, promo coupon applicator, and secondary drape image flip on hover. |
| **Step 9** | Homepage Lookbook & Tata Footer | **PENDING** | "Draped in Pratiè" customer UGC lookbook, connoisseur press quotes, and luxury Tata-standard multi-column footer. |

---

## 4. Developer & Model Guide for Catalog Page (`/products`)

### URL Query Parameters Supported
- `?clothingType=Saree` or `?clothingType=Suit`
- `?state=Uttar+Pradesh`
- `?search=Banarasi`
- `?category=Silk`
- `?craft=Chikankari`
- `?occasion=Bridal`

### Component Architecture & State Structure
- **File**: [`pratie-frontend/src/app/products/page.tsx`](../pratie-frontend/src/app/products/page.tsx)
- **Faceted Filter State**:
  - `selectedClothingType`: Saree, Suit, Heirloom Accent.
  - `selectedCraft`: Searchable list of Indian weave techniques with count badges.
  - `selectedFabric`: Pure Katan Silk, Muga, Tussar, Cotton-Silk, Chanderi Tissue, etc.
  - `selectedOccasion`: The Royal Bridal Trousseau, Sangeet Soirée, Puja, Cocktail, etc.
  - `selectedState`: All 33 States & UTs with regional group filters.
  - `selectedPriceBracket`: Under ₹15k, ₹15k–₹25k, ₹25k–₹40k, ₹40k+ or custom range slider.
  - `selectedColor`: Circular color swatches (Crimson, Rani Pink, Mustard, Peacock Blue, Emerald, Ivory, Coral, Black).
  - `silkMarkOnly` & `giTaggedOnly`: Boolean certification filters.
- **View Controls**:
  - `gridCols`: `3` (Spacious 3-column view) or `4` (Compact 4-column view).
  - `sortBy`: `featured`, `price_asc`, `price_desc`, `newest`, `rating`, `discount`.
- **Mobile Responsive Drawer**:
  - Full-height slide-over drawer with active filter badges, reset, and live result count button.
- Always verify changes with `npx tsc --noEmit` in `pratie-frontend`.

---

## 5. Strict Business Invariant: Exclusively "Sarees & Suits"

### Business Rule
Pratiè specializes **strictly and exclusively in handcrafted Indian Sarees and Royal Suits / Kurta Sets**. All non-saree / non-suit categories (e.g. clutches, shoes, accessories, western wear, folded shirts, sneakers) are permanently purged and prohibited across:
1. Backend Database Store ([`pratie-backend/src/db/store.ts`](../pratie-backend/src/db/store.ts))
2. Frontend Fallback Catalog ([`pratie-frontend/src/lib/api.ts`](../pratie-frontend/src/lib/api.ts))
3. State Crafts Matrix ([`pratie-frontend/src/lib/stateCraftsData.ts`](../pratie-frontend/src/lib/stateCraftsData.ts))
4. Navigation Menus & Search Keywords

### Permitted Product Photography Standards
Only high-definition, verified authentic Indian traditional ethnic attire photography is permitted:
- Saree Models: `photo-1610030469983-98e550d6193c`, `photo-1617627143750-d86bc21e42bb`
- Royal Suit / Kurta / Anarkali Models: `photo-1583391733956-3750e0ff4e8b`
- **Prohibited Images (Purged)**:
  - `photo-1544441893-675973e31985` (Sneakers)
  - `photo-1548036328-c9fa89d128fa` (Handbag clutch)
  - `photo-1602810318383-e386cc2a3ccf` (Men's folded shirts)
  - `photo-1596755094514-f87e34085b2c` (Western button-down shirt)

---

## 6. Developer & Model Guide for Product Detail Page (`/products/[slug]`)

### Component Architecture & Features
- **File**: [`pratie-frontend/src/app/products/[slug]/page.tsx`](../pratie-frontend/src/app/products/[slug]/page.tsx)
- **Taneira Luxury PDP Layout**:
  - **Left Column**: Multi-angle vertical thumbnail strip + interactive high-definition hover magnifier viewport.
  - **Floating Seals**: "Silk Mark Certified" badge + Geographical Indication / State Heritage pill.
  - **Header & Provenance**: State tag with MapPin, SKU prefix, Craft Technique tag (`Artisan Technique: Mithila / Kanjeevaram / Kashmiri Tilla`), Star rating with verified patron count, and Handloom Mark badge.
  - **Pricing Banner**: Large formatted INR price, strikethrough comparison price, savings badge (`Save ₹X,000`), and tax/shipping assurance.
  - **Saree-Specific Customization Engine**:
    - Complimentary Fall & Piko Pre-Stitched guarantee toggle (free cotton fall pre-stitched for ready-to-wear drape).
    - Blouse Tailoring Option: Unstitched Fabric (included) vs Custom Tailored Designer Blouse (+₹1,499) with bust size selector (34-44) and royal neckline selector (Sweetheart, Deep Round, Boat Neck, Mandarin Keyhole).
  - **Suit-Specific Sizing Engine**:
    - Silhouette sizing (XS, S, M, L, XL, XXL) with 3-piece suit specification note (Kurta, Pants, 2.5m Dupatta).
  - **Pincode Delivery Estimator**:
    - 6-digit Indian PIN code input validating serviceability with express transit ETA.
  - **4 Trust Pillars**: Pure Silk Certification, Authentic Pitloom Weave, 14-Day Boutique Exchange, Bespoke Archival Gift Box Packaging.
  - **4 Heritage Accordions**:
    1. Artisan Provenance & Weave Tale (weaving duration in days, pitloom origins, weaver empowerment).
    2. Fabric, Zari & Silhouette Specifications (garment type, fabric purity, electroplated gold/silver zari, dimensions, weight).
    3. Pure Silk Care & Archival Preservation (dry clean instructions, unbleached mulmul cloth storage, airing).
    4. Insured Shipping & White-Glove Returns.
  - **Patron Reviews & Drapery Reflections**:
    - Rating breakdown, verified patron badges, and interactive review submission form.
  - **Curated "More From [State]" Carousel**:
    - Recommends matching Sarees and Suits from the same region or craft technique.
