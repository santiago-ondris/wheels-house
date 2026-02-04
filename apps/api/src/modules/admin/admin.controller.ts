import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../validators/auth.validator';
import { AdminGuard } from '../../shared/guards/admin.guard';
import { AdminService } from './admin.service';
import { TokenData } from '../../dto/user.dto';
import { UpdateContactStatusDto } from '../contact/contact.dto';

class HideContentDto {
    reason: string;
}

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Patch('cars/:id/hide')
    async hideCar(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: HideContentDto,
        @Request() req,
    ) {
        const user = req.user as TokenData;
        return this.adminService.hideCar(id, body.reason, user);
    }


    @Patch('groups/:id/hide')
    async hideGroup(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: HideContentDto,
        @Request() req,
    ) {
        const user = req.user as TokenData;
        return this.adminService.hideGroup(id, body.reason, user);
    }

    @Patch('contact/:id')
    async updateContactStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateContactStatusDto,
    ) {
        return this.adminService.updateContactMessageStatus(id, body.status, body.adminNotes);
    }

    @Get('contact')
    async getContactMessages(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('status') status?: string,
        @Query('archived') archived?: string,
    ) {
        return this.adminService.getContactMessages({
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 20,
            status,
            archived: archived !== undefined ? archived === 'true' : undefined
        });
    }

    @Patch('contact/:id/archive')
    async archiveContactMessage(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { archived: boolean },
    ) {
        return this.adminService.archiveContactMessage(id, body.archived);
    }

    @Post('migrate-founders')
    async migrateFounders() {
        return this.adminService.migrateFounders();
    }

    @Get('featured-car')
    async getFeaturedCar() {
        return this.adminService.getFeaturedCarSetting();
    }

    @Patch('featured-car')
    async setFeaturedCar(
        @Body() body: { carId: number },
        @Request() req,
    ) {
        const user = req.user as TokenData;
        return this.adminService.setFeaturedCarSetting(body.carId, user.userId);
    }

    @Get('cars/search')
    async searchCars(@Query('q') query: string) {
        if (!query || query.length < 2) {
            return [];
        }
        return this.adminService.searchCarsAdmin(query);
    }
}
