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

    async getUserNotifications(userId: number) {
        return await this.notificationsRepository.findByUser(userId);
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
}
