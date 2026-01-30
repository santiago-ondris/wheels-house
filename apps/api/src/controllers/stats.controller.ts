import { Controller, Get, Param } from '@nestjs/common';
import { StatsService } from '../services/stats.service';

@Controller('stats')
export class StatsController {
    constructor(private readonly statsService: StatsService) { }

    @Get('/global')
    async getGlobalStats() {
        return await this.statsService.getGlobalStats();
    }

    @Get('/hall-of-fame/featured')
    async getFeaturedHoFMembers() {
        return await this.statsService.getFeaturedHoFMembers();
    }

    @Get('/hall-of-fame/:category')
    async getHoFMembersByCategory(@Param('category') category: string) {
        return await this.statsService.getHoFMembersByCategory(category);
    }

    @Get('/:username')
    async getUserStats(@Param('username') username: string) {
        return await this.statsService.getUserStats(username);
    }
}
