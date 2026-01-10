import { Controller, Get, Param } from '@nestjs/common';
import { StatsService } from '../services/stats.service';

@Controller('stats')
export class StatsController {
    constructor(private readonly statsService: StatsService) { }

    @Get('/:username')
    async getUserStats(@Param('username') username: string) {
        return await this.statsService.getUserStats(username);
    }
}
