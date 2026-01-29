import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UploadService } from '../../services/upload.service';
import { NotificationsRepository } from '../social/notifications/notifications.repository';
import { EmailService } from '../../services/email.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET!,
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UploadService, NotificationsRepository, EmailService],
  exports: [UserService],
})
export class UserModule {}
