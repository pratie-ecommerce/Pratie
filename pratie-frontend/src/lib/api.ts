import { Product, Order, User } from '../types/index';
import productsData from '../data/products.json';

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Authentic Pratiè Indian Luxury Heritage Catalog
export const FALLBACK_PRODUCTS: Product[] = productsData as unknown as Product[];

export async function fetchProducts(params: Record<string, string> = {}): Promise<{ products: Product[]; total: number }> {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/products?${query}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Network response not ok');
    const json = await res.json();
    return {
      products: json.data.products,
      total: json.data.meta.total
    };
  } catch {
    let filtered = [...FALLBACK_PRODUCTS];
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q)) ||
          (p.state && p.state.toLowerCase().includes(q)) ||
          (p.craftTechnique && p.craftTechnique.toLowerCase().includes(q))
      );
    }
    if (params.state && params.state !== 'all') {
      filtered = filtered.filter((p) => p.state?.toLowerCase() === params.state.toLowerCase());
    }
    if (params.clothingType && params.clothingType !== 'all') {
      const ctTarget = params.clothingType.toLowerCase();
      filtered = filtered.filter((p) => {
        if (!p.clothingType) return false;
        const ct = p.clothingType.toLowerCase();
        if (ctTarget === 'saree' || ctTarget === 'sarees') return ct.includes('saree');
        if (ctTarget === 'suit' || ctTarget === 'suits') return ct.includes('suit') || ct.includes('kurta');
        return ct === ctTarget;
      });
    }
    if (params.category && params.category !== 'all') {
      filtered = filtered.filter((p) => p.categoryName?.toLowerCase() === params.category.toLowerCase());
    }
    return { products: filtered, total: filtered.length };
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE}/products/${slug}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Not found');
    const json = await res.json();
    return json.data;
  } catch {
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug || p.id === slug) || null;
  }
}
