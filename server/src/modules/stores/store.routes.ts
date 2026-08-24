import { Router } from 'express';
import { create, getBySlug, getById, update, listAll } from './store.controller';
import { protect, requireRole, requireOwnStore } from '@/middlewares/auth.middleware';
import { validate } from '@/middlewares/validate.middleware';
import { createStoreSchema, updateStoreSchema } from './store.validator';
import productRoutes from '@/modules/products/product.routes';

const router = Router();

// Public — anyone can view an active store's public info (storefront page)
router.get('/slug/:slug', getBySlug);

// Authenticated routes below
router.use(protect);

// Any logged-in buyer can create a store (becomes store_owner)
router.post('/', validate(createStoreSchema), create);

// Platform admin only — full visibility across all tenants
router.get('/', requireRole('platform_admin'), listAll);

// Store-scoped routes — owner/staff can only touch THEIR OWN store, admin can touch any
router.get('/:storeId', requireRole('platform_admin', 'store_owner', 'store_staff'), requireOwnStore, getById);
router.patch(
  '/:storeId',
  requireRole('platform_admin', 'store_owner'),
  requireOwnStore,
  validate(updateStoreSchema),
  update
);

router.use('/:storeId/products', productRoutes);

export default router;