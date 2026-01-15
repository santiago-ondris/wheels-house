import { Module } from '@nestjs/common';
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
import { MailerModule } from '@nestjs-modules/mailer';
import { StatsController } from './controllers/stats.controller';
import { StatsService } from './services/stats.service';
import { SearchHistoryController } from './controllers/searchHistory.controller';
import { SearchHistoryService } from './services/searchHistory.service';
import { ImportController } from './controllers/import.controller';
import { ImportService } from './services/import.service';
import { HealthController } from './controllers/health.controller';


@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_PROVIDER!, // Replace with your provider's SMTP host
        port: 587,
        auth: {
          user: process.env.EMAIL_ADDRESS!,
          pass: process.env.EMAIL_PASSWORD!,
        },
      },
      defaults: {
        from: '"Wheels House - No Reply" <noreply@wheelshouse.com>',
      },
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, // Time to live in milliseconds (1 minute)
      limit: 3,   // Max 3 requests per minute
    }]),
    PassportModule,
    ConfigModule.forRoot({
      isGlobal: true, // This makes the config available everywhere without re-importing
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET!,
      // Expiration set per token type in UserService
    }),
  ],
  controllers: [UserController, CarController, UploadController, GroupController, StatsController, SearchHistoryController, ImportController, HealthController],
  providers: [JwtStrategy, JwtRefreshStrategy, UserService, CarService, UploadService, GroupService, StatsService, SearchHistoryService, ImportService],
})
export class AppModule { }
