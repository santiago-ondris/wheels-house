import { Injectable, Logger } from '@nestjs/common';
import * as FeedRepository from './feed.repository';
import type { FeedQueryOptions, CreateFeedEventInput, FeedEventWithUser } from './feed.repository';

@Injectable()
export class FeedService {
    private readonly logger = new Logger(FeedService.name);

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
    async getFeedGlobal(page: number, limit: number): Promise<{ items: FeedEventWithUser[]; hasMore: boolean }> {
        const items = await FeedRepository.getFeedGlobal({ page, limit });
        const total = await FeedRepository.countFeedEvents({});

        return {
            items,
            hasMore: (page + 1) * limit < total
        };
    }

    /**
     * Obtiene el feed personalizado (siguiendo)
     * Por ahora, si no tenemos el sistema de follows, devolverá vacío o global
     */
    async getFeedFollowing(userId: number, page: number, limit: number): Promise<{ items: FeedEventWithUser[]; hasMore: boolean }> {
        // TODO: Obtener followedIds de FollowsService cuando esté implementado
        const followedIds: number[] = [];

        if (followedIds.length === 0) {
            return { items: [], hasMore: false };
        }

        const items = await FeedRepository.getFeedFollowing(followedIds, { page, limit });
        const total = await FeedRepository.countFeedEvents({ userIds: followedIds });

        return {
            items,
            hasMore: (page + 1) * limit < total
        };
    }
}
