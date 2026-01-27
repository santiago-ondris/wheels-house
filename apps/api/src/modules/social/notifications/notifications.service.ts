import { Injectable, Logger } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    constructor(
        private readonly notificationsRepository: NotificationsRepository,
    ) { }

    async create(data: CreateNotificationDto) {
        try {
            const [notification] = await this.notificationsRepository.create(data);
            return notification;
        } catch (error) {
            this.logger.error(`Error creating notification: ${error.message}`, error.stack);
            throw error;
        }
    }

    async getUserNotifications(userId: number, page = 0, limit = 20) {
        const offset = page * limit;
        const items = await this.notificationsRepository.findByUser(userId, limit + 1, offset);

        const hasMore = items.length > limit;
        const finalItems = hasMore ? items.slice(0, limit) : items;

        return {
            items: finalItems,
            hasMore
        };
    }

    async getUnreadCount(userId: number) {
        return await this.notificationsRepository.getUnreadCount(userId);
    }

    async markAsRead(notificationId: number, userId: number) {
        return await this.notificationsRepository.markAsRead(notificationId, userId);
    }

    async markAllAsRead(userId: number) {
        return await this.notificationsRepository.markAllAsRead(userId);
    }

    async delete(notificationId: number, userId: number) {
        return await this.notificationsRepository.delete(notificationId, userId);
    }

    async cleanupOldNotifications() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        try {
            const deleted = await this.notificationsRepository.deleteOldNotifications(thirtyDaysAgo);
            this.logger.log(`Cleanup: Deleted ${deleted.length} notifications older than 30 days.`);
            return deleted;
        } catch (error) {
            this.logger.error(`Error in notification cleanup: ${error.message}`, error.stack);
            throw error;
        }
    }
}
