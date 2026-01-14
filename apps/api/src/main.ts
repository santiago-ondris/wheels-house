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
    transform: true, // <--- IMPORTANTE: Esto habilita class-transformer para que funcione
  }));
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();

