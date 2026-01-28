import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { UploadService } from '../../services/upload.service';
import { EventsService } from '../social/events/events.service';
import { NotificationsRepository } from '../social/notifications/notifications.repository';

@Module({
  controllers: [GroupController],
  providers: [GroupService, UploadService, EventsService, NotificationsRepository],
  exports: [GroupService],
})
export class GroupModule {}
