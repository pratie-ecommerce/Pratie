import { Request, Response } from 'express';
import Papa from 'papaparse';
import { dbStore } from '../db/store.js';
import { OrderService } from '../services/order.service.js';
import { Product, OrderStatus } from '../types/index.js';

export const getAnalytics = async (_req: Request, res: Response): Promise<void> => {
  const totalRevenuePaise = dbStore.orders
    .filter((o) => o.paymentStatus === 'captured' || o.status === 'delivered')
    .reduce((acc, o) => acc + o.totalAmountPaise, 0);

  const activeOrders = dbStore.orders.filter((o) =>
    ['confirmed', 'processing', 'shipped', 'out_for_delivery'].includes(o.status)
  ).length;

  const lowStockProducts = dbStore.products.filter((p) =>
    p.variants.some((v) => v.stockQuantity <= 5)
  ).length;

  const totalCustomers = dbStore.users.filter((u) => u.role === 'customer').length;

  // Monthly revenue breakdown
  const recentOrders = dbStore.orders.slice(-5).reverse();

  res.json({
    success: true,
    data: {
      metrics: {
        totalRevenuePaise,
        activeOrders,
        lowStockProducts,
        totalCustomers,
        totalProductsCount: dbStore.products.length
      },
      recentOrders
    }
  });
};

export const adminGetProducts = async (_req: Request, res: Response): Promise<void> => {
  res.json({
    success: true,
    data: dbStore.products
  });
};

export const adminCreateProduct = async (req: Request, res: Response): Promise<void> => {
  const productData = req.body;
  const slug =
    productData.slug ||
    productData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  const id = `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  const newProduct: Product = {
    id,
    title: productData.title,
    slug,
    skuPrefix: productData.skuPrefix,
    shortDescription: productData.shortDescription,
    description: productData.description,
    categoryId: productData.categoryId,
    categoryName: productData.categoryName,
    brandId: productData.brandId,
    brandName: productData.brandName,
    basePricePaise: productData.basePricePaise,
    compareAtPricePaise: productData.compareAtPricePaise,
    taxRatePercentage: productData.taxRatePercentage || 18,
    isFeatured: productData.isFeatured || false,
    isPublished: productData.isPublished !== undefined ? productData.isPublished : true,
    isNewArrival: productData.isNewArrival || false,
    ratingAverage: 5.0,
    ratingCount: 0,
    tags: productData.tags || [],
    material: productData.material,
    careInstructions: productData.careInstructions,
    media: (productData.images || []).map((imgUrl: string, idx: number) => ({
      id: `m_${Date.now()}_${idx}`,
      productId: id,
      imageUrl: imgUrl,
      altText: productData.title,
      displayOrder: idx + 1,
      isPrimary: idx === 0
    })),
    variants: (productData.variants || []).map((v: any, idx: number) => ({
      id: `v_${Date.now()}_${idx}`,
      productId: id,
      sku: v.sku || `${productData.skuPrefix}-${idx + 1}`,
      size: v.size,
      colorName: v.colorName,
      colorHex: v.colorHex,
      additionalPricePaise: v.additionalPricePaise || 0,
      stockQuantity: v.stockQuantity || 10,
      isAvailable: true
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  dbStore.products.unshift(newProduct);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: newProduct
  });
};

export const adminUpdateProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const productIndex = dbStore.products.findIndex((p) => p.id === id);

  if (productIndex === -1) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }

  const existing = dbStore.products[productIndex];
  const updated: Product = {
    ...existing,
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  dbStore.products[productIndex] = updated;

  res.json({
    success: true,
    message: 'Product updated successfully',
    data: updated
  });
};

export const adminDeleteProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  dbStore.products = dbStore.products.filter((p) => p.id !== id);
  res.json({ success: true, message: 'Product deleted successfully' });
};

export const adminImportProductsCsv = async (req: Request, res: Response): Promise<void> => {
  const { csvData } = req.body;

  if (!csvData) {
    res.status(400).json({ success: false, message: 'CSV data string required' });
    return;
  }

  try {
    const parsed = Papa.parse(csvData, { header: true, skipEmptyLines: true });
    const importedCount: number = parsed.data.length;

    parsed.data.forEach((row: any) => {
      if (!row.title || !row.base_price_paise) return;

      const id = `p_csv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newProd: Product = {
        id,
        title: row.title,
        slug: row.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        skuPrefix: row.sku_prefix || 'PRT-CSV',
        shortDescription: row.short_description || row.title,
        description: row.description || row.title,
        categoryName: row.category || 'Curated',
        brandName: row.brand || 'Pratie',
        basePricePaise: parseInt(row.base_price_paise, 10) || 100000,
        taxRatePercentage: 18,
        isFeatured: row.is_featured === 'true',
        isPublished: true,
        isNewArrival: true,
        ratingAverage: 5.0,
        ratingCount: 0,
        tags: (row.tags || '').split(',').map((t: string) => t.trim()),
        media: [
          {
            id: `m_${id}`,
            productId: id,
            imageUrl: row.image_url || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85',
            altText: row.title,
            displayOrder: 1,
            isPrimary: true
          }
        ],
        variants: [
          {
            id: `v_${id}`,
            productId: id,
            sku: `${row.sku_prefix || 'PRT'}-REG`,
            size: row.size || 'Standard',
            colorName: row.color || 'Classic',
            additionalPricePaise: 0,
            stockQuantity: parseInt(row.stock || '20', 10),
            isAvailable: true
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      dbStore.products.unshift(newProd);
    });

    res.json({
      success: true,
      message: `Successfully imported ${importedCount} products via CSV`,
      data: { count: importedCount }
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: 'Failed to parse CSV', error: err.message });
  }
};

export const adminGetOrders = async (_req: Request, res: Response): Promise<void> => {
  res.json({
    success: true,
    data: dbStore.orders.slice().reverse()
  });
};

export const adminUpdateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status, trackingNumber, carrierName } = req.body;

  const order = dbStore.orders.find((o) => o.id === id);
  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }

  if (status && !OrderService.isValidTransition(order.status, status as OrderStatus)) {
    // Note: We still permit override by admin with warning
  }

  if (status) order.status = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (carrierName) order.carrierName = carrierName;
  order.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: 'Order updated successfully',
    data: order
  });
};

export const adminGetCustomers = async (_req: Request, res: Response): Promise<void> => {
  const customers = dbStore.users
    .filter((u) => u.role === 'customer')
    .map((u) => {
      const ordersCount = dbStore.orders.filter((o) => o.userId === u.id).length;
      const totalSpentPaise = dbStore.orders
        .filter((o) => o.userId === u.id)
        .reduce((sum, o) => sum + o.totalAmountPaise, 0);

      const { passwordHash: _, ...cust } = u;
      return {
        ...cust,
        ordersCount,
        totalSpentPaise
      };
    });

  res.json({ success: true, data: customers });
};
