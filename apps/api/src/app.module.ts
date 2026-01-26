import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UserController } from './controllers/user.controller';
import { CarController } from './controllers/car.controller';
import { UploadController } from './controllers/upload.controller';
import { UserService } from './services/user.service';
import { CarService } from './services/car.service';
import { UploadService } from './services/upload.service';
import { JwtStrategy, JwtRefreshStrategy } from './validators/auth.validator';
import { GroupController } from './controllers/group.controller';
import { GroupService } from './services/group.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { StatsController } from './controllers/stats.controller';
import { StatsService } from './services/stats.service';
import { SearchHistoryController } from './controllers/searchHistory.controller';
import { SearchHistoryService } from './services/searchHistory.service';
import { ImportController } from './controllers/import.controller';
import { ImportService } from './services/import.service';
import { HealthController } from './controllers/health.controller';
import { EmailService } from './services/email.service';
import { WheelwordController } from './controllers/wheelword.controller';
import { WheelwordService } from './services/wheelword.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SocialModule } from './modules/social/social.module';


@Module({
  imports: [
    SentryModule.forRoot(),
    ThrottlerModule.forRoot([{
      ttl: 60000, // Time to live in milliseconds (1 minute)
      limit: 30,  // Max 30 requests per minute
    }]),
    PassportModule,
    ConfigModule.forRoot({
      isGlobal: true, // This makes the config available everywhere without re-importing
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET!,
      // Expiration set per token type in UserService
    }),
    EventEmitterModule.forRoot(),
    SocialModule,
  ],
  controllers: [UserController, CarController, UploadController, GroupController, StatsController, SearchHistoryController, ImportController, HealthController, WheelwordController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
    JwtStrategy, JwtRefreshStrategy, UserService, CarService, UploadService, GroupService, StatsService, SearchHistoryService, ImportService, EmailService, WheelwordService],
})
export class AppModule { }
