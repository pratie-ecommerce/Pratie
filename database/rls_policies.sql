-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR SUPABASE
-- =====================================================================

-- Enable RLS on all sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policies for Catalog
CREATE POLICY "Public can view published products" ON products
    FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view variants of published products" ON product_variants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM products
            WHERE products.id = product_variants.product_id
            AND products.is_published = true
        )
    );

CREATE POLICY "Public can view categories" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Public can view brands" ON brands
    FOR SELECT USING (true);

CREATE POLICY "Public can view collections" ON collections
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view approved reviews" ON reviews
    FOR SELECT USING (is_approved = true);

-- 2. User Profiles Policy
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- 3. Addresses Policy
CREATE POLICY "Users can manage own addresses" ON addresses
    FOR ALL USING (auth.uid() = user_id);

-- 4. Cart Items Policy
CREATE POLICY "Users can manage own cart" ON cart_items
    FOR ALL USING (auth.uid() = user_id);

-- 5. Orders & Order Items Policy
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
        )
    );

-- 6. Wishlist Policy
CREATE POLICY "Users can manage own wishlist" ON wishlist_items
    FOR ALL USING (auth.uid() = user_id);

-- 7. Reviews Policy
CREATE POLICY "Authenticated users can create reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 8. Admin Full Access Policy (Service Role / Admin Role)
CREATE POLICY "Admins have full access to products" ON products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND users.role IN ('admin', 'superadmin')
        )
    );

CREATE POLICY "Admins have full access to orders" ON orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND users.role IN ('admin', 'superadmin')
        )
    );

CREATE POLICY "Admins have full access to coupons" ON coupons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND users.role IN ('admin', 'superadmin')
        )
    );
