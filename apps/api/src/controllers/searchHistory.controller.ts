
import { Controller, Post, Body, Get, Delete, Req, UseGuards, Param } from '@nestjs/common';
import { SearchHistoryService } from '../services/searchHistory.service';
import { JwtAuthGuard } from '../validators/auth.validator';
import { db } from '../database';
import { user } from '../database/schema';
import { eq } from 'drizzle-orm';

@Controller('search-history')
export class SearchHistoryController {
    constructor(private readonly searchHistoryService: SearchHistoryService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async addToHistory(@Req() req: any, @Body() body: { searchedUsername: string }) {
        const [currentUser] = await db.select().from(user).where(eq(user.username, req.user.username)).limit(1);

        if (!currentUser) {
            throw new Error("Current user not found");
        }

        const [searchedUser] = await db.select().from(user).where(eq(user.username, body.searchedUsername)).limit(1);

        if (searchedUser) {
            await this.searchHistoryService.addToHistory(currentUser.userId, searchedUser.userId);
        }
        return { success: true };
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getHistory(@Req() req: any) {
        const [currentUser] = await db.select().from(user).where(eq(user.username, req.user.username)).limit(1);

        if (!currentUser) {
            return [];
        }

        return await this.searchHistoryService.getHistory(currentUser.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':username')
    async removeFromHistory(@Req() req: any, @Param('username') searchedUsername: string) {
        const [currentUser] = await db.select().from(user).where(eq(user.username, req.user.username)).limit(1);

        if (!currentUser) {
            throw new Error("Current user not found");
        }

        const [searchedUser] = await db.select().from(user).where(eq(user.username, searchedUsername)).limit(1);

        if (searchedUser) {
            await this.searchHistoryService.removeFromHistory(currentUser.userId, searchedUser.userId);
        }

        return { success: true };
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    async clearHistory(@Req() req: any) {
        const [currentUser] = await db.select().from(user).where(eq(user.username, req.user.username)).limit(1);

        if (!currentUser) {
            throw new Error("Current user not found");
        }

        await this.searchHistoryService.clearHistory(currentUser.userId);

        return { success: true };
    }
}

