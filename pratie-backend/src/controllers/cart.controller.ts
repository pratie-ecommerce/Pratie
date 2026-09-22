import { Request, Response } from 'express';
import { dbStore } from '../db/store.js';
import { CartItem } from '../types/index.js';

export const getCart = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const sessionId = req.query.sessionId as string;

  const items = dbStore.cartItems
    .filter((item) => (userId && item.userId === userId) || (!userId && sessionId && item.sessionId === sessionId))
    .map((item) => {
      const product = dbStore.products.find((p) => p.id === item.productId);
      const variant = product?.variants.find((v) => v.id === item.variantId);
      return {
        ...item,
        product,
        variant
      };
    });

  const cartCalculations = items.map((it) => ({
    unitPricePaise: (it.product?.basePricePaise || 0) + (it.variant?.additionalPricePaise || 0),
    quantity: it.quantity
  }));

  const subtotalPaise = cartCalculations.reduce((acc, it) => acc + it.unitPricePaise * it.quantity, 0);

  res.json({
    success: true,
    data: {
      items,
      subtotalPaise,
      itemCount: items.reduce((acc, it) => acc + it.quantity, 0)
    }
  });
};

export const addToCart = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { productId, variantId, quantity, sessionId } = req.body;

  const product = dbStore.products.find((p) => p.id === productId);
  if (!product) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }

  const variant = product.variants.find((v) => v.id === variantId);
  if (!variant) {
    res.status(404).json({ success: false, message: 'Variant not found' });
    return;
  }

  if (variant.stockQuantity < quantity) {
    res.status(400).json({ success: false, message: 'Requested quantity exceeds available stock' });
    return;
  }

  const existingItemIndex = dbStore.cartItems.findIndex(
    (item) =>
      ((userId && item.userId === userId) || (!userId && sessionId && item.sessionId === sessionId)) &&
      item.variantId === variantId
  );

  if (existingItemIndex > -1) {
    dbStore.cartItems[existingItemIndex].quantity += quantity;
  } else {
    const newItem: CartItem = {
      id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      sessionId: !userId ? sessionId : undefined,
      productId,
      variantId,
      quantity,
      createdAt: new Date().toISOString()
    };
    dbStore.cartItems.push(newItem);
  }

  res.json({
    success: true,
    message: 'Item added to luxury bag'
  });
};

export const updateCartItem = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { quantity } = req.body;

  const itemIndex = dbStore.cartItems.findIndex((item) => item.id === id);
  if (itemIndex === -1) {
    res.status(404).json({ success: false, message: 'Item not found in cart' });
    return;
  }

  if (quantity <= 0) {
    dbStore.cartItems.splice(itemIndex, 1);
  } else {
    dbStore.cartItems[itemIndex].quantity = quantity;
  }

  res.json({ success: true, message: 'Cart updated successfully' });
};

export const removeCartItem = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  dbStore.cartItems = dbStore.cartItems.filter((it) => it.id !== id);
  res.json({ success: true, message: 'Item removed from cart' });
};

export const syncCart = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { sessionId } = req.body;

  if (!userId || !sessionId) {
    res.status(400).json({ success: false, message: 'User ID and Session ID required' });
    return;
  }

  const guestItems = dbStore.cartItems.filter((it) => it.sessionId === sessionId);
  for (const item of guestItems) {
    const existingUserItem = dbStore.cartItems.find((it) => it.userId === userId && it.variantId === item.variantId);
    if (existingUserItem) {
      existingUserItem.quantity += item.quantity;
    } else {
      item.userId = userId;
      item.sessionId = undefined;
    }
  }

  // Remove leftover session-tagged items
  dbStore.cartItems = dbStore.cartItems.filter((it) => it.sessionId !== sessionId);

  res.json({ success: true, message: 'Cart synchronized successfully' });
};
