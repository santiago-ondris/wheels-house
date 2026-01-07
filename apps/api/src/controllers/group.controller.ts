import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { GroupService } from 'src/services/group.service';
import { JwtAuthGuard } from 'src/validators/auth.validator';
import { CreateGroupDTO } from 'src/dto/group.dto';
import { createGroupValidator, getGroupValidator } from 'src/validators/group.validator';

@Controller('group')
export class GroupComtroller {
    constructor(private readonly groupService: GroupService) { }

    @UseGuards(JwtAuthGuard)
    @Post('/create')
    async createGroup(@Request() req, @Body() groupData: CreateGroupDTO) {
        await createGroupValidator(groupData, req.user);

        return this.groupService.createGroupService(groupData, req.user);
    }

    @Get('info/:groupId')
    async getGroup(@Param('groupId') groupId: number) {
        await getGroupValidator(groupId);

        return this.groupService.getGroupService(groupId);
    }
}
