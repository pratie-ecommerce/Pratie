import { Request, Response } from 'express';
import { dbStore } from '../db/store.js';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  const {
    category,
    brand,
    state,
    clothingType,
    craftTechnique,
    fabric,
    minPrice,
    maxPrice,
    search,
    sort,
    featured,
    newArrival,
    tag,
    page = '1',
    limit = '12'
  } = req.query;

  let results = dbStore.products.filter((p) => p.isPublished);

  // Search filter (keyword in title, description, tags, state, craft, clothingType)
  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        (p.state && p.state.toLowerCase().includes(q)) ||
        (p.clothingType && p.clothingType.toLowerCase().includes(q)) ||
        (p.craftTechnique && p.craftTechnique.toLowerCase().includes(q)) ||
        (p.fabric && p.fabric.toLowerCase().includes(q)) ||
        (p.brandName && p.brandName.toLowerCase().includes(q)) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(q))
    );
  }

  // State filter (e.g. Bihar, Uttar Pradesh, Rajasthan, Gujarat, Madhya Pradesh, Jammu & Kashmir)
  if (state && typeof state === 'string' && state !== 'all') {
    results = results.filter(
      (p) => p.state && p.state.toLowerCase() === state.toLowerCase()
    );
  }

  // Clothing Type filter (e.g. Saree, Suit, Kurta Set)
  if (clothingType && typeof clothingType === 'string' && clothingType !== 'all') {
    results = results.filter((p) => {
      if (!p.clothingType) return false;
      const ct = p.clothingType.toLowerCase();
      const target = clothingType.toLowerCase();
      if (target === 'suit' || target === 'suits') {
        return ct.includes('suit') || ct.includes('kurta');
      }
      if (target === 'saree' || target === 'sarees') {
        return ct.includes('saree');
      }
      return ct === target;
    });
  }

  // Craft Technique filter
  if (craftTechnique && typeof craftTechnique === 'string' && craftTechnique !== 'all') {
    results = results.filter(
      (p) => p.craftTechnique && p.craftTechnique.toLowerCase().includes(craftTechnique.toLowerCase())
    );
  }

  // Fabric filter
  if (fabric && typeof fabric === 'string' && fabric !== 'all') {
    results = results.filter(
      (p) => p.fabric && p.fabric.toLowerCase().includes(fabric.toLowerCase())
    );
  }

  // Category filter
  if (category && typeof category === 'string' && category !== 'all') {
    results = results.filter(
      (p) =>
        p.categoryId === category ||
        (p.categoryName && p.categoryName.toLowerCase() === category.toLowerCase())
    );
  }

  // Brand filter
  if (brand && typeof brand === 'string' && brand !== 'all') {
    results = results.filter(
      (p) =>
        p.brandId === brand ||
        (p.brandName && p.brandName.toLowerCase() === brand.toLowerCase())
    );
  }

  // Tag filter
  if (tag && typeof tag === 'string') {
    results = results.filter((p) => p.tags.includes(tag));
  }

  // Price Range Filter (Values in Paise or INR)
  if (minPrice) {
    const min = Number(minPrice);
    const minPaise = min > 10000 ? min : min * 100;
    results = results.filter((p) => p.basePricePaise >= minPaise);
  }

  if (maxPrice) {
    const max = Number(maxPrice);
    const maxPaise = max > 10000 ? max : max * 100;
    results = results.filter((p) => p.basePricePaise <= maxPaise);
  }

  if (featured === 'true') {
    results = results.filter((p) => p.isFeatured);
  }

  if (newArrival === 'true') {
    results = results.filter((p) => p.isNewArrival);
  }

  // Sorting
  if (sort === 'price_asc') {
    results.sort((a, b) => a.basePricePaise - b.basePricePaise);
  } else if (sort === 'price_desc') {
    results.sort((a, b) => b.basePricePaise - a.basePricePaise);
  } else if (sort === 'rating') {
    results.sort((a, b) => b.ratingAverage - a.ratingAverage);
  } else {
    // default: newest
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Pagination
  const pageNum = Math.max(1, parseInt(page as string, 10));
  const limitNum = Math.max(1, parseInt(limit as string, 10));
  const total = results.length;
  const paginatedResults = results.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  res.json({
    success: true,
    data: {
      products: paginatedResults,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    }
  });
};

export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;
  const product = dbStore.products.find(
    (p) =>
      p.slug === slug ||
      p.id === slug ||
      (p.id === 'p0000001-0000-0000-0000-000000000013' &&
        (slug === 'tarakasi-silver-filigree-minaudiere-evening-clutch' || slug === 'odisha-berhampuri-double-pata-silk-saree')) ||
      (p.id === 'p0000001-0000-0000-0000-000000000021' &&
        slug === 'srikalahasti-freehand-kalamkari-pure-silk-saree') ||
      (p.id === 'p0000001-0000-0000-0000-000000000023' &&
        (slug === 'apatani-tribal-geometric-handloom-wrap-shawl' || slug === 'arunachal-mechuka-valley-handwoven-organic-eri-silk-saree')) ||
      (p.id === 'p0000001-0000-0000-0000-000000000022' &&
        slug === 'machilipatnam-kalamkari-handblock-chanderi-silk-suit-set')
  );

  if (!product) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }

  const reviews = dbStore.reviews.filter((r) => r.productId === product.id && r.isApproved);

  // Related products (same state, craft, or clothing type)
  const relatedProducts = dbStore.products
    .filter((p) => p.id !== product.id && (p.state === product.state || p.clothingType === product.clothingType || p.categoryId === product.categoryId))
    .slice(0, 4);

  res.json({
    success: true,
    data: {
      ...product,
      reviews,
      relatedProducts
    }
  });
};

export const getTaxonomies = async (_req: Request, res: Response): Promise<void> => {
  const states = [
    { name: 'Bihar', craft: 'Mithila & Madhubani Art, Bhagalpuri Tussar Silk' },
    { name: 'Uttar Pradesh', craft: 'Banarasi Kadwa Brocades, Lucknowi Chikankari' },
    { name: 'Madhya Pradesh', craft: 'Chanderi Gold Zari & Maheshwari Weaves' },
    { name: 'Rajasthan', craft: 'Gotapatti, Bandhani & Leheriya Doria' },
    { name: 'Jammu & Kashmir', craft: 'Kashmiri Tilla Embroidery & Pashmina Silks' },
    { name: 'Gujarat', craft: 'Kutch Ajrakh Hand-Block, Patola & Bandhani' },
    { name: 'Tamil Nadu', craft: 'Kanjeevaram Pure Gold Zari Silks' },
    { name: 'Punjab', craft: 'Traditional Phulkari Silk Needlecraft' },
    { name: 'West Bengal', craft: 'Jamdani & Kantha Stitch Heritage Silks' },
    { name: 'Odisha', craft: 'Sambalpuri Ikat & Tarakasi Accents' }
  ];

  const clothingTypes = [
    { id: 'saree', name: 'Sarees', count: dbStore.products.filter(p => p.clothingType === 'Saree').length },
    { id: 'suit', name: 'Suits & Kurta Sets', count: dbStore.products.filter(p => p.clothingType === 'Suit').length }
  ];

  const crafts = [
    'Mithila / Madhubani Handpainted',
    'Banarasi Kadwa Brocade',
    'Lucknowi Chikankari',
    'Chanderi Handloom',
    'Kashmiri Tilla Embroidery',
    'Rajasthani Gotapatti & Leheriya',
    'Kutch Ajrakh & Bandhani',
    'Kanjeevaram Temple Zari',
    'Phulkari Needlecraft',
    'Berhampuri Pata Weaving'
  ];

  const categories = [
    { id: 'c0000001-0000-0000-0000-000000000001', name: 'Mithila Couture', slug: 'mithila-couture' },
    { id: 'c0000001-0000-0000-0000-000000000002', name: 'Banarasi Brocades', slug: 'banarasi-brocades' },
    { id: 'c0000001-0000-0000-0000-000000000003', name: 'Chanderi Weaves', slug: 'chanderi-weaves' },
    { id: 'c0000001-0000-0000-0000-000000000004', name: 'Royal Heritage Suits', slug: 'royal-heritage-suits' }
  ];

  res.json({
    success: true,
    data: {
      states,
      clothingTypes,
      crafts,
      categories
    }
  });
};
