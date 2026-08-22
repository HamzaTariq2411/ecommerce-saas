import { createServer } from 'http';
import app from '@/app';
import { env } from '@/config/env';
import { connectDB } from '@/config/db';

const start = async () => {
  await connectDB();

  const httpServer = createServer(app);

  httpServer.listen(env.PORT, () => {
    console.log(`✅ Server running on http://localhost:${env.PORT}`);
    console.log(`🌱 Environment: ${env.NODE_ENV}`);
  });
};

start();