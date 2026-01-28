import { Controller, Post, Delete, Get, Param, Query, UseGuards, Request, ParseIntPipe, ForbiddenException } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { JwtAuthGuard } from 'src/validators/auth.validator';
import { FollowsPaginationOptions } from './follows.repository';

@Controller('users')
export class FollowsController {
    constructor(private readonly followsService: FollowsService) { }

    @UseGuards(JwtAuthGuard)
    @Post(':id/follow')
    async follow(@Request() req, @Param('id', ParseIntPipe) id: number) {
        // req.user.userId comes from JwtStrategy
        return await this.followsService.follow(req.user.userId, id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id/unfollow')
    async unfollow(@Request() req, @Param('id', ParseIntPipe) id: number) {
        return await this.followsService.unfollow(req.user.userId, id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/followers')
    async getFollowers(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Query('page') page?: string,
        @Query('limit') limit?: string
    ) {
        if (req.user.userId !== id) {
            throw new ForbiddenException('No puedes ver los seguidores de otros usuarios');
        }

        const options: FollowsPaginationOptions = {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            viewerId: req.user.userId
        };
        return await this.followsService.getFollowers(id, options);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/following')
    async getFollowing(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Query('page') page?: string,
        @Query('limit') limit?: string
    ) {
        if (req.user.userId !== id) {
            throw new ForbiddenException('No puedes ver a quién siguen otros usuarios');
        }

        const options: FollowsPaginationOptions = {
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            viewerId: req.user.userId
        };
        return await this.followsService.getFollowing(id, options);
    }
}
