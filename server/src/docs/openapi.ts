import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registry } from './registry';

registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

export const generateOpenApiDocument = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'E-commerce SaaS API',
      version: '1.0.0',
      description: 'Multi-tenant e-commerce SaaS platform API documentation',
    },
    servers: [{ url: 'http://localhost:5000', description: 'Development' }],
  });
};