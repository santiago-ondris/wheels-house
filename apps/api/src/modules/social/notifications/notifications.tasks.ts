import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationsService } from './notifications.service';

@Injectable()
export class NotificationsTasks {
    private readonly logger = new Logger(NotificationsTasks.name);

    constructor(private readonly notificationsService: NotificationsService) { }

    @Cron(CronExpression.EVERY_WEEKEND)
    async handleCleanup() {
        this.logger.log('Starting weekly notification cleanup task...');
        try {
            await this.notificationsService.cleanupOldNotifications();
            this.logger.log('Weekly notification cleanup completed successfully.');
        } catch (error) {
            this.logger.error('Failed to complete weekly notification cleanup.', error.stack);
        }
    }
}
