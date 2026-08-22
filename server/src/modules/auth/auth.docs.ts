import { registry } from '@/docs/registry';
import { registerSchema, loginSchema } from './auth.validator';
import { z } from 'zod';

const userResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
});

const authResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    user: userResponseSchema,
    token: z.string(),
  }),
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/register',
  tags: ['Auth'],
  summary: 'Register a new buyer account',
  request: {
    body: {
      content: { 'application/json': { schema: registerSchema } },
    },
  },
  responses: {
    201: {
      description: 'Account created successfully',
      content: { 'application/json': { schema: authResponseSchema } },
    },
    409: { description: 'Email already in use' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/login',
  tags: ['Auth'],
  summary: 'Log in with email and password',
  request: {
    body: {
      content: { 'application/json': { schema: loginSchema } },
    },
  },
  responses: {
    200: {
      description: 'Logged in successfully',
      content: { 'application/json': { schema: authResponseSchema } },
    },
    401: { description: 'Invalid credentials' },
    429: { description: 'Too many failed attempts — account locked' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/auth/me',
  tags: ['Auth'],
  summary: 'Get the currently authenticated user',
  security: [{ bearerAuth: [] }],
  responses: {
    200: { description: 'Current user data' },
    401: { description: 'Not authorized' },
  },
});