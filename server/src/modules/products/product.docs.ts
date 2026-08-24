import { registry } from '@/docs/registry';
import { createProductSchema, updateProductSchema } from './product.validator';
import { z } from 'zod';

registry.registerPath({
  method: 'post',
  path: '/api/stores/{storeId}/products',
  tags: ['Products'],
  summary: 'Create a product (respects store plan product limit)',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ storeId: z.string() }),
    body: { content: { 'application/json': { schema: createProductSchema } } },
  },
  responses: {
    201: { description: 'Product created' },
    403: { description: 'Product limit reached, or store not active, or not your store' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/stores/{storeId}/products',
  tags: ['Products'],
  summary: 'List a store\'s products (public, paginated)',
  request: {
    params: z.object({ storeId: z.string() }),
  },
  responses: { 200: { description: 'Paginated product list' } },
});

registry.registerPath({
  method: 'get',
  path: '/api/stores/{storeId}/products/{productId}',
  tags: ['Products'],
  summary: 'Get a single product (public)',
  request: {
    params: z.object({ storeId: z.string(), productId: z.string() }),
  },
  responses: { 200: { description: 'Product found' }, 404: { description: 'Not found' } },
});

registry.registerPath({
  method: 'patch',
  path: '/api/stores/{storeId}/products/{productId}',
  tags: ['Products'],
  summary: 'Update a product (owner/staff/admin only)',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ storeId: z.string(), productId: z.string() }),
    body: { content: { 'application/json': { schema: updateProductSchema } } },
  },
  responses: { 200: { description: 'Product updated' } },
});

registry.registerPath({
  method: 'delete',
  path: '/api/stores/{storeId}/products/{productId}',
  tags: ['Products'],
  summary: 'Delete a product (owner/admin only, not staff)',
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ storeId: z.string(), productId: z.string() }),
  },
  responses: { 200: { description: 'Product deleted' }, 403: { description: 'Staff cannot delete products' } },
});