import { Router } from 'express';
import { create, list, getOne, update, remove } from './product.controller';
import { protect, requireRole, requireOwnStore } from '@/middlewares/auth.middleware';
import { validate } from '@/middlewares/validate.middleware';
import { createProductSchema, updateProductSchema } from './product.validator';

// mergeParams lets this router access :storeId from the parent router it's mounted under
const router = Router({ mergeParams: true });

// Public — anyone can browse a store's active products (storefront)
router.get('/', list);
router.get('/:productId', getOne);

// Seller-only routes below
router.use(protect);
router.use(requireRole('platform_admin', 'store_owner', 'store_staff'));
router.use(requireOwnStore);

router.post('/', validate(createProductSchema), create);
router.patch('/:productId', validate(updateProductSchema), update);
router.delete('/:productId', requireRole('platform_admin', 'store_owner'), remove); // staff can't delete, only owner/admin

export default router;