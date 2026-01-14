
import { Injectable } from '@nestjs/common';
import { db } from '../database';
import { searchHistory, user } from '../database/schema';
import { desc, eq, and } from 'drizzle-orm';

@Injectable()
export class SearchHistoryService {

    async addToHistory(currentUserId: number, searchedUserId: number) {
        try {
            if (!currentUserId) {
                console.error("addToHistory: currentUserId is null or undefined");
                throw new Error("currentUserId cannot be null or undefined.");
            }
            if (currentUserId === searchedUserId) return; // Don't log self-searches

            await db.insert(searchHistory)
                .values({
                    userId: currentUserId,
                    searchedUserId: searchedUserId,
                    searchedAt: new Date()
                })
                .onConflictDoUpdate({
                    target: [searchHistory.userId, searchHistory.searchedUserId],
                    set: { searchedAt: new Date() }
                });
        } catch (error) {
            console.error("Error adding to search history:", error);
            throw error;
        }
    }

    async getHistory(currentUserId: number) {
        try {
            const history = await db.select({
                userId: user.userId,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                picture: user.picture,
                searchedAt: searchHistory.searchedAt
            })
                .from(searchHistory)
                .innerJoin(user, eq(searchHistory.searchedUserId, user.userId))
                .where(eq(searchHistory.userId, currentUserId))
                .orderBy(desc(searchHistory.searchedAt))
                .limit(5);

            return history;
        } catch (error) {
            console.error("Error fetching search history:", error);
            throw error;
        }
    }
}
