import { Controller, Get, Post, Body, Param, UseGuards, Request, Put, Delete } from '@nestjs/common';
import { GroupService } from 'src/services/group.service';
import { JwtAuthGuard, OptionalJwtAuthGuard } from 'src/validators/auth.validator';
import { CreateGroupDTO, UpdateGroupDTO } from 'src/dto/group.dto';
import { createGroupValidator, deleteGroupValidator, getGroupValidator, listGroupsValidator, updateGroupValidator } from 'src/validators/group.validator';

@Controller('group')
export class GroupController {
    constructor(private readonly groupService: GroupService) { }

    @UseGuards(JwtAuthGuard)
    @Post('/create')
    async createGroup(@Request() req, @Body() groupData: CreateGroupDTO) {
        await createGroupValidator(groupData, req.user);

        return await this.groupService.createGroupService(groupData, req.user);
    }

    @UseGuards(OptionalJwtAuthGuard)
    @Get('info/:groupId')
    async getGroup(@Request() req, @Param('groupId') groupId: number) {
        await getGroupValidator(groupId);

        return await this.groupService.getGroupService(groupId, req.user?.userId);
    }

    @UseGuards(OptionalJwtAuthGuard)
    @Get('by-name/:username/:groupName')
    async getGroupByName(@Request() req, @Param('username') username: string, @Param('groupName') groupName: string) {
        // Decode URL-encoded group name
        const decodedName = decodeURIComponent(groupName);
        return await this.groupService.getGroupByNameService(username, decodedName, req.user?.userId);
    }

    @UseGuards(OptionalJwtAuthGuard)
    @Get('list/:username')
    async listGroups(@Request() req, @Param('username') username: string) {
        await listGroupsValidator(username);

        return await this.groupService.listGroupsService(username, req.user?.userId);
    }

    @UseGuards(OptionalJwtAuthGuard)
    @Get('featured/:username')
    async listFeaturedGroups(@Request() req, @Param('username') username: string) {
        await listGroupsValidator(username);

        return await this.groupService.listFeaturedGroupsService(username, req.user?.userId);
    }


    @UseGuards(JwtAuthGuard)
    @Put('update/:groupId')
    async updateGroup(@Request() req, @Param('groupId') groupId, @Body() groupChanges: UpdateGroupDTO) {
        await updateGroupValidator(req.user, groupId, groupChanges);

        return await this.groupService.updateGroupService(groupId, groupChanges);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':groupId')
    async deleteGroup(@Request() req, @Param('groupId') groupId) {
        await deleteGroupValidator(req.user, groupId);

        return await this.groupService.deleteGroupService(groupId);
    }
}
