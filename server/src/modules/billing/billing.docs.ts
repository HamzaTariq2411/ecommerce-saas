import { registry } from '@/docs/registry';
import { z } from 'zod';

registry.registerPath({
  method: 'post',
  path: '/api/stores/{storeId}/billing/connect/onboard',
  tags: ['Billing'],
  summary: 'Start (or resume) Stripe Connect onboarding for a store',
  security: [{ bearerAuth: [] }],
  request: { params: z.object({ storeId: z.string() }) },
  responses: { 200: { description: 'Returns a Stripe-hosted onboarding URL to redirect the seller to' } },
});

registry.registerPath({
  method: 'get',
  path: '/api/stores/{storeId}/billing/connect/status',
  tags: ['Billing'],
  summary: "Check a store's Stripe Connect onboarding status",
  security: [{ bearerAuth: [] }],
  request: { params: z.object({ storeId: z.string() }) },
  responses: { 200: { description: 'Onboarding/charges/payouts status' } },
});