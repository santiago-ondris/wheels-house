import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // Add this global pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // <--- IMPORTANT: This enables class-transformer to work
    whitelist: true, // Removes properties not in the DTO
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
