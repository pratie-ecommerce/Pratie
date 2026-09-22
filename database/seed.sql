-- =====================================================================
-- PRATIÈ SEED DATA (Indian Regional Heritage & Contemporary Luxury)
-- Tagline: "Some stories are meant to be worn. Heritage Redefined."
-- =====================================================================

-- 1. Insert Brands / Maisons
INSERT INTO brands (id, name, slug, description, website) VALUES
('b0000001-0000-0000-0000-000000000001', 'Pratiè Atelier', 'pratie-atelier', 'Couture storytelling integrating Mithila, Banarasi, Chanderi and Indian artisanal legacies into contemporary luxury silhouettes', 'https://pratie.com'),
('b0000001-0000-0000-0000-000000000002', 'Mithila Legacy House', 'mithila-legacy-house', 'Authentic hand-painted Madhubani fine art garments by generational women artisans of Bihar', 'https://pratie.com/mithila'),
('b0000001-0000-0000-0000-000000000003', 'Kashi Kadwa Looms', 'kashi-kadwa-looms', 'Sacred pit-loom woven pure Katan silks and antique real gold zari weaves from Varanasi', 'https://pratie.com/kashi')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Categories
INSERT INTO categories (id, name, slug, description, is_featured, display_order) VALUES
('c0000001-0000-0000-0000-000000000001', 'Mithila Couture', 'mithila-couture', 'Handpainted Bhagalpuri Tussar silks, Madhubani storytelling motifs, and Angrakha sets', true, 1),
('c0000001-0000-0000-0000-000000000002', 'Banarasi Brocades', 'banarasi-brocades', 'Pure Katan silk Kadwa weave bandhgalas, lehengas, and royal heirloom jackets', true, 2),
('c0000001-0000-0000-0000-000000000003', 'Chanderi Weaves', 'chanderi-weaves', 'Gossamer silk-cotton anarkalis, hand-interlocked zari bootis, and sheer organza dupattas', true, 3),
('c0000001-0000-0000-0000-000000000004', 'Heirloom Accents', 'heirloom-accents', '925 sterling silver Tarakasi filigree minaudières, temple jewelry, and artisanal stoles', true, 4),
('c0000001-0000-0000-0000-000000000005', 'Artisanal Outerwear', 'artisanal-outerwear', 'Kutch natural indigo Ajrakh trenches, Kantha jackets, and Pashmina cloaks', false, 5)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Collections
INSERT INTO collections (id, name, slug, tagline, description, is_active) VALUES
('d0000001-0000-0000-0000-000000000001', 'Mithila Reverie SS26', 'mithila-reverie-ss26', 'Some stories are meant to be worn', 'From the intricate storytelling of Mithila to the crafts of India, bringing local artistry into modern luxury.', true),
('d0000001-0000-0000-0000-000000000002', 'The Royal Looms of Kashi', 'the-royal-looms-of-kashi', 'Uncut Zari & Kadwa Artistry', 'Heirloom eveningwear handwoven on ancestral Varanasi pit looms.', true),
('d0000001-0000-0000-0000-000000000003', 'Sacred Flora & Indigo', 'sacred-flora-indigo', 'Natural Resist Dyeing of Kutch & Srikalahasti', '16-stage natural indigo Ajrakh prints and tamarind pen Kalamkari.', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Products (Prices in Paise: e.g. 2499900 = ₹24,999.00)
INSERT INTO products (
    id, title, slug, sku_prefix, short_description, description,
    category_id, brand_id, collection_id, base_price_paise, compare_at_price_paise,
    tax_rate_percentage, is_featured, is_published, is_new_arrival, rating_average, rating_count,
    tags, material, care_instructions
) VALUES
(
    'p0000001-0000-0000-0000-000000000001',
    'Mithila Handpainted Tussar Silk Kurta Set',
    'mithila-handpainted-tussar-silk-kurta-set',
    'PRT-MTH-01',
    'Pure handspun Bhagalpuri Tussar silk kurta adorned with intricate Madhubani storytelling motifs handpainted by master Mithila artisans.',
    'Some stories are meant to be worn. Each piece is a living canvas featuring intricate Madhubani motifs—lotuses symbolizing purity, birds of joy, and celestial folklore. Handpainted using fine bamboo nibs and organic vegetable pigments on pure, unbleached handspun Tussar silk. Finished with refined zardozi edge detailing.',
    'c0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001',
    2499900, 2999900, 18.00, true, true, true, 4.98, 36,
    ARRAY['mithila', 'madhubani', 'handpainted', 'tussar-silk', 'heritage-couture'],
    '100% Handspun Bhagalpuri Tussar Silk; Natural Dyes & Gold Zari Thread',
    'Dry clean only by certified luxury heritage garment specialists'
),
(
    'p0000001-0000-0000-0000-000000000002',
    'Kashi Heritage Kadwa Brocade Bandhgala Jacket',
    'kashi-heritage-kadwa-brocade-bandhgala-jacket',
    'PRT-KSH-02',
    'Pure Katan silk handwoven on traditional Banarasi pit looms with authentic gold zari Kadwa floral jaal.',
    'A tribute to the sacred looms of Varanasi. The Kadwa technique requires hours of hand-guided shuttling for each individual motif, leaving no loose threads behind. Structured with an architectural Nehru collar and antiqued brass buttons.',
    'c0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000002',
    4899900, 5499900, 18.00, true, true, true, 5.00, 22,
    ARRAY['banarasi', 'kadwa', 'brocade', 'bandhgala', 'royal-zari'],
    '100% Pure Katan Silk with Tested Gold Zari',
    'Store wrapped in mulmul cloth; delicate dry clean only'
),
(
    'p0000001-0000-0000-0000-000000000003',
    'Chanderi Silk Lotus Blossom Angrakha Anarkali',
    'chanderi-silk-lotus-blossom-angrakha-anarkali',
    'PRT-CHD-03',
    'Gossamer Chanderi silk-cotton blend with hand-woven gold ashrafi booti and sheer organza dupatta.',
    'Woven in the historic heart of Madhya Pradesh. Featherlight gossamer drape featuring traditional hand-interlocked zari bootis and overlapping Angrakha side ties.',
    'c0000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001',
    3299900, 3699900, 18.00, true, true, false, 4.95, 29,
    ARRAY['chanderi', 'angrakha', 'anarkali', 'lotus', 'handloom'],
    'Chanderi Silk-Cotton Blend with Pure Silk Organza Dupatta',
    'Dry clean only. Iron on reverse low heat setting'
),
(
    'p0000001-0000-0000-0000-000000000004',
    'Kutch Hand-Block Indigo Ajrakh Overlay Trench',
    'kutch-hand-block-indigo-ajrakh-overlay-trench',
    'PRT-AJK-04',
    '16-stage natural indigo & madder root block-printed Mulberry silk trench coat crafted in Dhamadka, Kutch.',
    'Ancient geometric harmony rooted in the Indus Valley civilization. Each textile undergoes a laborious 16-stage resist dyeing process using river water, natural indigo cakes, and pomegranate rinds.',
    'c0000001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000003',
    1849900, 2199900, 18.00, true, true, true, 4.92, 18,
    ARRAY['ajrakh', 'kutch', 'natural-indigo', 'trench', 'handblock'],
    '100% Mulberry Silk, Natural Indigo & Vegetable Dye Infusion',
    'Store away from direct sunlight; delicate dry clean'
)
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Coupons
INSERT INTO coupons (code, discount_type, discount_value, min_order_amount_paise, max_discount_amount_paise, is_active) VALUES
('HERITAGE10', 'percentage', 10, 500000, 250000, true),
('PRATIEVIP', 'percentage', 20, 1500000, 500000, true),
('MITHILA2000', 'fixed_amount', 200000, 1000000, NULL, true)
ON CONFLICT (code) DO NOTHING;
