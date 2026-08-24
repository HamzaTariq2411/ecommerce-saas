import express from 'express';
import cors from 'cors';
import { env } from '@/config/env';
import { errorHandler, notFoundHandler } from '@/middlewares/error.middleware';
import authRoutes from '@/modules/auth/auth.routes';
import swaggerUi from 'swagger-ui-express';
import '@/modules/auth/auth.docs'; 
import { generateOpenApiDocument } from '@/docs/openapi';
import storeRoutes from '@/modules/stores/store.routes';
import '@/modules/stores/store.docs';
import '@/modules/products/product.docs';

const app = express();

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Server is healthy 🚀' });
});

// Swagger docs — served at /api/docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(generateOpenApiDocument()));


app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
