import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import * as FeedRepository from './feed.repository';
import type { FeedQueryOptions, CreateFeedEventInput, FeedEventWithUser } from './feed.repository';
import * as FollowsRepository from '../follows/follows.repository';

@Injectable()
export class FeedService {
    constructor(private readonly logger: Logger) { }

    // Cache simple en memoria para IDs de seguidos
    private followsCache = new Map<number, { ids: number[], timestamp: number }>();
    private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos

    /**
     * Crea un nuevo evento en el feed
     */
    async createEvent(input: CreateFeedEventInput): Promise<number> {
        try {
            this.logger.log(`Creating feed event of type ${input.type} for user ${input.userId}`);
            return await FeedRepository.createFeedEvent(input);
        } catch (error) {
            this.logger.error(`Error creating feed event: ${error.message}`);
            throw error;
        }
    }

    /**
     * Obtiene el feed global
     */
    async getFeedGlobal(page: number, limit: number, options: Partial<FeedQueryOptions> = {}): Promise<{ items: FeedEventWithUser[]; hasMore: boolean }> {
        const queryOptions: FeedQueryOptions = { page, limit, ...options };
        const items = await FeedRepository.getFeedGlobal(queryOptions);
        const total = await FeedRepository.countFeedEvents(queryOptions);

        return {
            items,
            hasMore: (page + 1) * limit < total
        };
    }

    /**
     * Obtiene el feed personalizado (siguiendo)
     */
    async getFeedFollowing(userId: number, page: number, limit: number, options: Partial<FeedQueryOptions> = {}): Promise<{ items: FeedEventWithUser[]; hasMore: boolean }> {
        const followedIds = await this.getCachedFollowedIds(userId);

        const allRelevantIds = [...followedIds, userId];

        const queryOptions: FeedQueryOptions = { page, limit, ...options };
        const items = await FeedRepository.getFeedFollowing(allRelevantIds, queryOptions);
        const total = await FeedRepository.countFeedEvents({ ...queryOptions, userIds: allRelevantIds });

        return {
            items,
            hasMore: (page + 1) * limit < total
        };
    }


    /**
     * Verifica si ya existe un evento para evitar duplicados
     */
    async existsEvent(type: FeedRepository.FeedEventType, userId: number, targetId: { carId?: number, groupId?: number }): Promise<boolean> {
        return await FeedRepository.existsFeedEvent(type, userId, targetId);
    }

    /**
     * Invalida la caché de seguidos para un usuario
     */
    invalidateCache(userId: number): void {
        this.followsCache.delete(userId);
    }

    /**
     * Helper para obtener IDs de seguidos con cache 
     */
    private async getCachedFollowedIds(userId: number): Promise<number[]> {
        const now = Date.now();
        const cached = this.followsCache.get(userId);

        if (cached && (now - cached.timestamp < this.CACHE_TTL)) {
            return cached.ids;
        }

        // Cache miss o expirado
        const ids = await FollowsRepository.getFollowingIds(userId);

        // Actualizar cache
        this.followsCache.set(userId, { ids, timestamp: now });

        return ids;
    }
}
