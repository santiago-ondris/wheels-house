import { Module } from '@nestjs/common';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { UploadService } from '../../services/upload.service';
import { EventsService } from '../social/events/events.service';
import { NotificationsRepository } from '../social/notifications/notifications.repository';

@Module({
  controllers: [CarController],
  providers: [CarService, UploadService, EventsService, NotificationsRepository],
  exports: [CarService], // Export if other modules need it
})
export class CarModule {}
