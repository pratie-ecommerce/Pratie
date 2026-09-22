import { Router } from 'express';
import { getProducts, getProductBySlug, getTaxonomies } from '../controllers/product.controller.js';

const router = Router();

router.get('/', getProducts);
router.get('/taxonomies', getTaxonomies);
router.get('/:slug', getProductBySlug);

export default router;
