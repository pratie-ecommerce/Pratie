# Frontend Storefront Architecture (`pratie-frontend`)

Framework: Next.js 15+ (App Router) + React 19 + TypeScript + Vanilla CSS / Tailwind Tokens  
Design Benchmark: **[Taneira (by Tata)](https://www.taneira.com/)**

---

## 1. App Router Page Structure

| Route | File Path | Description |
| :--- | :--- | :--- |
| `/` | `src/app/page.tsx` | Taneira 3-tier header, panoramic sliding campaigns, 10 iconic weave bubbles, tabbed showcase (*Pure Silk Sarees* vs *Royal Suits*), arched occasions, State of the Week spotlight (*Assam Muga Silk*), and regional 33 states matrix |
| `/products` | `src/app/products/page.tsx` | Taneira multi-faceted filter catalog: Garment Silhouette (*Sarees* vs *Suits*), Craft with inline search, Fabric, Occasion, State of origin, Price presets & slider, Color palette swatches, Silk Mark/GI checkboxes, 3 vs 4 column layout toggle |
| `/products/[slug]` | `src/app/products/[slug]/page.tsx`| Luxury Taneira PDP: Multi-angle vertical thumbnails, interactive hover zoom, floating Silk Mark & GI seals, complimentary Fall & Piko pre-stitched toggle, custom blouse tailoring engine, suit size selector, 6-digit Indian PIN code delivery estimator, 4 pitloom accordions, and patron reviews |
| `/cart` | `src/app/cart/page.tsx` | Shopping bag overview, coupon voucher engine (`FESTIVE15`), tax summary, free insured shipping tracker |
| `/checkout` | `src/app/checkout/page.tsx` | Multi-step consignment address capture, payment method selector, and Razorpay modal simulator |
| `/orders/[id]` | `src/app/orders/[id]/page.tsx` | Stamped order receipt and real-time visual fulfillment lifecycle timeline tracker |
| `/account/login` | `src/app/account/login/page.tsx` | Client portal authentication form |
| `/account/register`| `src/app/account/register/page.tsx` | Private salon registration form |
| `/account/orders` | `src/app/account/orders/page.tsx` | Client order history and saved profiles |

---

## 2. React Context Architecture

### 2.1 `AuthContext` (`src/context/AuthContext.tsx`)
- Manages JWT session tokens and user state in `localStorage` (`pratie_token` & `pratie_user`).
- Exposes: `user`, `token`, `login(token, user)`, `logout()`, `isLoading`.

### 2.2 `CartContext` (`src/context/CartContext.tsx`)
- Manages shopping bag items persisted in `localStorage` (`pratie_cart`).
- Exposes: `items`, `isCartOpen`, `setIsCartOpen()`, `addToCart()`, `updateQuantity()`, `removeFromCart()`, `subtotalPaise`, `appliedCoupon`, `applyCoupon()`, `removeCoupon()`.
- Automatically opens the slide-over `CartDrawer` whenever an item is added.

### 2.3 `WishlistContext` (`src/context/WishlistContext.tsx`)
- Manages favorite creations persisted in `localStorage` (`pratie_wishlist`).
- Exposes: `wishlist`, `toggleWishlist()`, `isInWishlist()`.

---

## 3. UI Component Library (`src/components/`)

- **`layout/Navbar.tsx`**: Taneira 3-tier header:
  - Tier 1: Top announcement ticker with `FESTIVE15`, customer phone, store locator, Silk Mark guarantee.
  - Tier 2: Transparent left logo, centered rounded search pill with red submit button, patron login, wishlist, and shopping bag counter.
  - Tier 3: Category navigation with hover mega-menus (*New In*, *Sarees*, *Suits & Kurtas*, *Shop By Craft*, *33 Weaves (By State)*, *Bridal Trousseau*, *Ready to Ship*, *Festive Offers*).
- **`layout/Footer.tsx`**: Luxury Tata-standard multi-column footer with brand heritage story, artisan provenance links, care guides, and newsletter subscription.
- **`cart/CartDrawer.tsx`**: Slide-over mini-bag drawer featuring instant quantity adjusters, subtotal summary, and direct checkout call-to-action.
- **`products/ProductCard.tsx`**: Product card with hover zoom, origin state badge, compare-price discount calculator, and quick add-to-bag button.
- **`products/QuickViewModal.tsx`**: Interactive quick-view modal allowing instant variant selection without leaving the catalog page.

---

## 4. Design Tokens & Styling (`src/styles/globals.css`)

- **Deep Royal Crimson**: `#4A0D18` / `#881337` (Primary brand accent, active tabs, buttons)
- **Burgundy Noir**: `#1F070B` (Cinematic dark panels, hero backdrops)
- **Antique Gold & Zari**: `#C5A059` / `#D4AF37` (Border rings, seals, rating stars)
- **Sandalwood & Ivory**: `#FAF8F5` / `#F5EFE6` (Warm luxury backgrounds)
- **Charcoal Slate**: `#1A1A1A` / `#262626` (High-contrast typography)
- **Soft Border Linen**: `#E8E1D7` / `#E2D9CC` (Card separators and borders)
- **Typography**: Playfair Display / Cormorant Garamond serif headings (`font-editorial`), Montserrat / Inter sans-serif UI typography (`font-sans`).
