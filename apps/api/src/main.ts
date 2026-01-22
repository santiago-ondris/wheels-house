import "./instrument";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aumentar el límite del cuerpo JSON para la importación masiva (5MB)
  app.use(express.json({ limit: '5mb' }));

  // Agregar este pipe global
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));

  // CORS configurado para deployment
  const allowedOrigins = process.env.FRONTEND_URL?.split(',') || [
    'http://localhost:5173',
    'http://localhost:4173',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc)
      // or if origin is in the allowed list
      // In development (no FRONTEND_URL), allow any origin
      if (!origin || allowedOrigins.includes(origin) || !process.env.FRONTEND_URL) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'sentry-trace', 'baggage'],
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Backend running on port ${port}`);
  console.log(`🌍 Allowed origins: ${process.env.FRONTEND_URL || 'localhost:5173'}`);
}
bootstrap();