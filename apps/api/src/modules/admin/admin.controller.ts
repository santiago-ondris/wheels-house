import { Body, Controller, Param, Patch, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../../validators/auth.validator';
import { AdminGuard } from '../../shared/guards/admin.guard';
import { AdminService } from './admin.service';
import { TokenData } from '../../dto/user.dto';

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
}
