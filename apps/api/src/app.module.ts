import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';


import { UploadController } from './controllers/upload.controller';
import { UserService } from './modules/user/user.service';

import { UploadService } from './services/upload.service';
import { JwtStrategy, JwtRefreshStrategy } from './validators/auth.validator';


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
import { ScheduleModule } from '@nestjs/schedule';
import { SocialModule } from './modules/social/social.module';
import { GroupModule } from './modules/group/group.module';
import { CarModule } from './modules/car/car.module';
import { UserModule } from './modules/user/user.module';


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
    ScheduleModule.forRoot(),
    SocialModule,
    CarModule,
    UserModule,
    GroupModule,
  ],
  controllers: [UploadController, StatsController, SearchHistoryController, ImportController, HealthController, WheelwordController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
    JwtStrategy, JwtRefreshStrategy, UploadService, StatsService, SearchHistoryService, ImportService, EmailService, WheelwordService],
})
export class AppModule { }
