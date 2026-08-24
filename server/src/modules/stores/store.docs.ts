import { registry } from '@/docs/registry';
import { createStoreSchema, updateStoreSchema } from './store.validator';
import { z } from 'zod';

const storeResponseSchema = z.object({
  _id: z.string(),
  name: z.string(),
  slug: z.string(),
  ownerId: z.string(),
  plan: z.string(),
  status: z.string(),
  productLimit: z.number(),
  transactionFeePercent: z.number(),
});

registry.registerPath({
  method: 'post',
  path: '/api/stores',
  tags: ['Stores'],
  summary: 'Create a new store (promotes the caller to store_owner)',
  security: [{ bearerAuth: [] }],
  request: {
    body: { content: { 'application/json': { schema: createStoreSchema } } },
  },
  responses: {
    201: { description: 'Store created', content: { 'application/json': { schema: storeResponseSchema } } },
    409: { description: 'User already owns a store, or slug is taken' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/stores/slug/{slug}',
  tags: ['Stores'],
  summary: 'Get public store info by slug (no auth required)',
  request: {
    params: z.object({ slug: z.string().openapi({ example: 'acme-apparel' }) }),
  },
  responses: {
    200: { description: 'Store found' },
    404: { description: 'Store not found' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/stores/{storeId}',
  tags: ['Stores'],
  summary: 'Get a store by ID (owner/staff/admin only)',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ storeId: z.string() }),
  },
  responses: {
    200: { description: 'Store found' },
    403: { description: 'Not your store' },
    404: { description: 'Store not found' },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/api/stores/{storeId}',
  tags: ['Stores'],
  summary: 'Update store details (owner/admin only)',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ storeId: z.string() }),
    body: { content: { 'application/json': { schema: updateStoreSchema } } },
  },
  responses: {
    200: { description: 'Store updated' },
    403: { description: 'Not your store' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/stores',
  tags: ['Stores'],
  summary: 'List all stores (platform_admin only)',
  security: [{ bearerAuth: [] }],
  responses: {
    200: { description: 'All stores' },
    403: { description: 'Platform admin access required' },
  },
});