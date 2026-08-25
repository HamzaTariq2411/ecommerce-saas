import { Router } from 'express';
import { startOnboarding, getStatus } from './connect.controller';
import { protect, requireRole, requireOwnStore } from '@/middlewares/auth.middleware';

const router = Router({ mergeParams: true });

router.use(protect);
router.use(requireRole('platform_admin', 'store_owner'));
router.use(requireOwnStore);

router.post('/connect/onboard', startOnboarding);
router.get('/connect/status', getStatus);

export default router;