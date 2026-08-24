import { z } from 'zod';
import '@/docs/registry';

export const createStoreSchema = z
  .object({
    name: z.string().min(2, 'Store name must be at least 2 characters').openapi({ example: 'Acme Apparel' }),
    slug: z
      .string()
      .min(3, 'Slug must be at least 3 characters')
      .max(30, 'Slug must be under 30 characters')
      .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
      .openapi({ example: 'acme-apparel' }),
  })
  .openapi('CreateStoreInput');

export const updateStoreSchema = z
  .object({
    name: z.string().min(2).optional(),
  })
  .openapi('UpdateStoreInput');

export type CreateStoreInput = z.infer<typeof createStoreSchema>;
export type UpdateStoreInput = z.infer<typeof updateStoreSchema>;