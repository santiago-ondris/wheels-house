import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsRepository } from './notifications.repository';
import { NotificationsTasks } from './notifications.tasks';

@Module({
    controllers: [NotificationsController],
    providers: [NotificationsService, NotificationsRepository, NotificationsTasks],
    exports: [NotificationsService, NotificationsRepository],
})
export class NotificationsModule { }
