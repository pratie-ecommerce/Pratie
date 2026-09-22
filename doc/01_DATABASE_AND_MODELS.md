# Database Architecture, Models & Security

## 1. Integer Currency Convention (Paise)
To ensure 100% financial precision without IEEE-754 floating-point rounding errors, **all monetary figures across the entire platform are strictly stored as integer minor units (Paise)**:
- `1 INR = 100 Paise`
- Example: `₹24,999` is stored in the database and API payloads as `2499900`
- Example: `₹1,499` is stored as `149900`
- All database columns handling money are named with the suffix `_paise` (e.g., `base_price_paise`, `total_amount_paise`, `discount_amount_paise`).

---

## 2. Table Schemas & Relational Entity Model

### 2.1 `users`
Stores customer and administrator credentials, roles, and profile information.
- `id` (UUID, Primary Key)
- `email` (VARCHAR(255), Unique, Indexed)
- `password_hash` (VARCHAR(255), bcrypt hash)
- `full_name` (VARCHAR(150))
- `phone` (VARCHAR(20))
- `role` (ENUM: `'guest'`, `'customer'`, `'admin'`, `'superadmin'`)
- `avatar_url` (TEXT)
- `is_active` (BOOLEAN, default `true`)
- `email_verified` (BOOLEAN, default `false`)
- `created_at` / `updated_at` (TIMESTAMPTZ)

### 2.2 `addresses`
Saved shipping and billing destinations for registered users.
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key -> `users.id` ON DELETE CASCADE)
- `address_type` (VARCHAR(20), `'shipping'` or `'billing'`)
- `full_name` (VARCHAR(150))
- `phone` (VARCHAR(20))
- `street_line1` (TEXT)
- `street_line2` (TEXT)
- `landmark` (VARCHAR(150))
- `city` (VARCHAR(100))
- `state` (VARCHAR(100))
- `postal_code` (VARCHAR(20))
- `country` (VARCHAR(100), default `'India'`)
- `is_default` (BOOLEAN)

### 2.3 `categories`, `brands`, `collections`
Taxonomy trees and curated groupings for items.
- `categories`: `id`, `name`, `slug` (Unique), `description`, `parent_id`, `image_url`, `is_featured`, `display_order`
- `brands`: `id`, `name`, `slug` (Unique), `logo_url`, `description`, `website`
- `collections`: `id`, `name`, `slug` (Unique), `tagline`, `description`, `banner_url`, `is_active`

### 2.4 `products` & `product_media`
The primary catalog entity and attached photography.
- `products`:
  - `id` (UUID, Primary Key)
  - `title` (VARCHAR(255))
  - `slug` (VARCHAR(280), Unique, Indexed)
  - `sku_prefix` (VARCHAR(50), Unique)
  - `short_description` / `description` (TEXT)
  - `state` (VARCHAR(100), e.g. `'Uttar Pradesh'`, `'Tamil Nadu'`, `'Bihar'`, `'Kashmir'`)
  - `clothing_type` (ENUM/VARCHAR(50), strictly `'Saree'` or `'Suit'`) — **Mandatory Business Constraint**
  - `craft_technique` (VARCHAR(150), e.g. `'Banarasi Kadwa'`, `'Kanjeevaram'`, `'Mithila Handpainted'`)
  - `fabric` (VARCHAR(150), e.g. `'100% Pure Mulberry Silk'`, `'Bhagalpuri Tussar'`)
  - `category_id` (UUID, FK -> `categories.id`)
  - `brand_id` (UUID, FK -> `brands.id`)
  - `collection_id` (UUID, FK -> `collections.id`)
  - `base_price_paise` (BIGINT, Indexed)
  - `compare_at_price_paise` (BIGINT)
  - `tax_rate_percentage` (NUMERIC(5,2), default `18.00` for GST)
  - `is_featured`, `is_published`, `is_new_arrival` (BOOLEAN)
  - `rating_average` (NUMERIC(3,2)), `rating_count` (INT)
  - `tags` (TEXT[])
  - `material`, `care_instructions` (TEXT)
- `product_media`:
  - `id`, `product_id` (FK -> `products.id`), `image_url`, `alt_text`, `display_order`, `is_primary`
  - **Strict Asset Standard**: Only verified authentic Indian traditional Saree and Royal Suit photography. All western wear, shirts, sneakers, and handbags are strictly prohibited.

### 2.5 `product_variants`
Size, color, individual SKU, and localized inventory tracking.
- `id` (UUID, Primary Key)
- `product_id` (UUID, FK -> `products.id` ON DELETE CASCADE)
- `sku` (VARCHAR(100), Unique, Indexed)
- `size` (VARCHAR(50), e.g. `'38R'`, `'EU 42'`, `'41mm'`)
- `color_name` (VARCHAR(50), e.g. `'Midnight Black'`, `'Cognac Patina'`)
- `color_hex` (VARCHAR(20), e.g. `'#0d0d0d'`)
- `additional_price_paise` (BIGINT, default `0`)
- `stock_quantity` (INT, default `0`)
- `low_stock_threshold` (INT, default `5`)
- `is_available` (BOOLEAN)

### 2.6 `cart_items`
Persistent user and guest shopping bag records.
- `id` (UUID, Primary Key)
- `user_id` (UUID, FK -> `users.id`)
- `session_id` (VARCHAR(100), for unauthenticated guest carts)
- `product_id` (UUID, FK -> `products.id`)
- `variant_id` (UUID, FK -> `product_variants.id`)
- `quantity` (INT, CHECK `quantity > 0`)

### 2.7 `orders` & `order_items`
Financial and fulfillment transaction ledger.
- `orders`:
  - `id` (UUID, Primary Key)
  - `order_number` (VARCHAR(50), Unique, Indexed, e.g. `PRT-2026-94812`)
  - `user_id` (UUID, FK -> `users.id`)
  - `guest_email`, `guest_phone` (VARCHAR)
  - `status` (ENUM: `'pending_payment'`, `'confirmed'`, `'processing'`, `'shipped'`, `'out_for_delivery'`, `'delivered'`, `'completed'`, `'cancelled'`, `'refunded'`, `'returned'`)
  - `payment_status` (ENUM: `'pending'`, `'authorized'`, `'captured'`, `'failed'`, `'refunded'`)
  - `payment_method` (ENUM: `'razorpay'`, `'cod'`, `'upi'`, `'card'`, `'netbanking'`)
  - `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature` (TEXT)
  - `shipping_address`, `billing_address` (JSONB)
  - `subtotal_paise`, `tax_amount_paise`, `shipping_amount_paise`, `discount_amount_paise`, `total_amount_paise` (BIGINT)
  - `coupon_id` (UUID, FK -> `coupons.id`)
  - `tracking_number`, `carrier_name`, `estimated_delivery` (VARCHAR)
- `order_items`:
  - `id`, `order_id` (FK -> `orders.id`), `product_id`, `variant_id`, `product_title`, `variant_sku`, `size`, `color_name`, `unit_price_paise`, `quantity`, `total_price_paise`, `image_url`

### 2.8 `coupons`
Promotional discount rules and limits.
- `id`, `code` (VARCHAR(50), Unique), `discount_type` (`'percentage'` | `'fixed_amount'`), `discount_value` (INT/BIGINT), `min_order_amount_paise`, `max_discount_amount_paise`, `usage_limit`, `used_count`, `is_active`

### 2.9 `reviews`
Verified client product ratings and qualitative commentary.
- `id`, `product_id` (FK -> `products.id`), `user_id`, `author_name`, `rating` (INT 1-5), `title`, `comment`, `is_verified_purchase`, `is_approved`

---

## 3. Supabase Row Level Security (RLS) Policies
- **Public Read Access**: Published products, variants, categories, brands, active collections, and approved reviews can be read by anyone.
- **User Privacy Isolation**: Users can only select, insert, and update their own addresses, cart items, wishlist items, and past orders (`auth.uid() = user_id`).
- **Admin Full Access**: Only authenticated users with `role IN ('admin', 'superadmin')` can mutate the catalog, view all customer orders, or update fulfillment statuses.
