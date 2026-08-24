import { z } from 'zod';
import '@/docs/registry';

const variantSchema = z.object({
  name: z.string().min(1).openapi({ example: 'Small / Black' }),
  sku: z.string().min(1).openapi({ example: 'TSHIRT-S-BLK' }),
  price: z.number().int().min(0).openapi({ example: 1999 }),
  inventory: z.number().int().min(0).default(0),
  imageUrl: z.string().url().optional(),
});

export const createProductSchema = z
  .object({
    title: z.string().min(2).max(200).openapi({ example: 'Classic Cotton T-Shirt' }),
    description: z.string().min(10).max(5000).openapi({ example: 'A soft, breathable everyday t-shirt.' }),
    category: z.string().min(1).openapi({ example: 'apparel' }),
    images: z.array(z.string().url()).max(10).default([]),
    basePrice: z.number().int().min(0).openapi({ example: 1999 }),
    variants: z.array(variantSchema).min(1, 'At least one variant is required'),
  })
  .openapi('CreateProductInput');

export const updateProductSchema = createProductSchema.partial().openapi('UpdateProductInput');

export const listProductsQuerySchema = z.object({
  category: z.string().optional(),
  isActive: z.enum(['true', 'false']).optional(),
  page: z.string().regex(/^\d+$/).default('1'),
  limit: z.string().regex(/^\d+$/).default('20'),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;