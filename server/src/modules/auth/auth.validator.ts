import { z } from 'zod';
import '@/docs/registry'; 

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').openapi({ example: 'jhon Doe' }),
    email: z.string().email('Invalid email address').openapi({ example: 'test@example.com' }),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/[a-z]/, 'Password must contain a lowercase letter')
      .regex(/[0-9]/, 'Password must contain a number')
      .openapi({ example: 'SecurePass123' }),
  })
  .openapi('RegisterInput');

export const loginSchema = z
  .object({
    email: z.string().email('Invalid email address').openapi({ example: 'test@example.com' }),
    password: z.string().min(1, 'Password is required').openapi({ example: 'SecurePass123' }),
  })
  .openapi('LoginInput');

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;