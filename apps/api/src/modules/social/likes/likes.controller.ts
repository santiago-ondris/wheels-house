import { Controller, Get, Post, Delete, Param, Query, Request, ParseIntPipe, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../../../validators/auth.validator';

@Controller('social/likes')
export class LikesController {
    constructor(private readonly likesService: LikesService) { }

    @UseGuards(JwtAuthGuard)
    @Post('car/:id')
    async likeCar(
        @Param('id', ParseIntPipe) carId: number,
        @Request() req
    ) {
        return await this.likesService.likeCar(req.user.userId, carId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('car/:id')
    async unlikeCar(
        @Param('id', ParseIntPipe) carId: number,
        @Request() req
    ) {
        return await this.likesService.unlikeCar(req.user.userId, carId);
    }

    @Get('car/:id/likers')
    async getCarLikers(
        @Param('id', ParseIntPipe) carId: number,
        @Query('page') page?: string,
        @Query('limit') limit?: string
    ) {
        return await this.likesService.getCarLikers(
            carId,
            page ? parseInt(page, 10) : 0,
            limit ? parseInt(limit, 10) : 20
        );
    }

    @UseGuards(JwtAuthGuard)
    @Post('group/:id')
    async likeGroup(
        @Param('id', ParseIntPipe) groupId: number,
        @Request() req
    ) {
        return await this.likesService.likeGroup(req.user.userId, groupId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('group/:id')
    async unlikeGroup(
        @Param('id', ParseIntPipe) groupId: number,
        @Request() req
    ) {
        return await this.likesService.unlikeGroup(req.user.userId, groupId);
    }

    @Get('group/:id/likers')
    async getGroupLikers(
        @Param('id', ParseIntPipe) groupId: number,
        @Query('page') page?: string,
        @Query('limit') limit?: string
    ) {
        return await this.likesService.getGroupLikers(
            groupId,
            page ? parseInt(page, 10) : 0,
            limit ? parseInt(limit, 10) : 20
        );
    }
}
