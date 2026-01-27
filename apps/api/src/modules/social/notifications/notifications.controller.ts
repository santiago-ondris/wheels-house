import { Controller, Get, Put, Delete, Param, UseGuards, Request, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/validators/auth.validator';


@Controller('social/notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    async getUserNotifications(@Request() req: any) {
        return await this.notificationsService.getUserNotifications(req.user.userId);
    }

    @Get('unread-count')
    async getUnreadCount(@Request() req: any) {
        const count = await this.notificationsService.getUnreadCount(req.user.userId);
        return { count };
    }

    @Put(':id/read')
    async markAsRead(
        @Request() req: any,
        @Param('id', ParseIntPipe) id: number
    ) {
        return await this.notificationsService.markAsRead(id, req.user.userId);
    }

    @Put('read-all')
    async markAllAsRead(@Request() req: any) {
        return await this.notificationsService.markAllAsRead(req.user.userId);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(
        @Request() req: any,
        @Param('id', ParseIntPipe) id: number
    ) {
        await this.notificationsService.delete(id, req.user.userId);
    }
}
