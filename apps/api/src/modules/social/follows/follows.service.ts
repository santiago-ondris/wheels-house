import { Injectable, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { EventsService } from '../events/events.service';
import { FeedService } from '../feed/feed.service';
import * as FollowsRepository from './follows.repository';
import { db } from '../../../database';
import { user } from '../../../database/schema';
import { eq, sql } from 'drizzle-orm';
import type { FollowUserInfo, FollowsPaginationOptions } from './follows.repository';

@Injectable()
export class FollowsService {
    constructor(
        private readonly eventsService: EventsService,
        @Inject(forwardRef(() => FeedService))
        private readonly feedService: FeedService,
    ) { }

    /**
     * Seguir a un usuario
     */
    async follow(followerId: number, followedId: number): Promise<void> {
        if (followerId === followedId) {
            throw new BadRequestException('No puedes seguirte a vos mismo');
        }

        const isFollowing = await FollowsRepository.isFollowing(followerId, followedId);
        if (isFollowing) {
            return; // Ya seguis a este usuario, idempotente
        }

        const followingCount = await FollowsRepository.countFollowing(followerId);
        if (followingCount >= 1000) {
            throw new BadRequestException('Solo podes seguir a 1000 usuarios');
        }

        // Throttling: max 10 follows per minuto
        const recentFollows = await FollowsRepository.countRecentFollows(followerId, 1);
        if (recentFollows >= 10) {
            throw new BadRequestException('Estás siguiendo gente demasiado rápido. Esperá un momento.');
        }

        // Crear follow
        await FollowsRepository.createFollow(followerId, followedId);

        // Actualizar conteos
        await Promise.all([
            db.update(user)
                .set({ followingCount: sql`${user.followingCount} + 1` })
                .where(eq(user.userId, followerId)),

            db.update(user)
                .set({ followersCount: sql`${user.followersCount} + 1` })
                .where(eq(user.userId, followedId))
        ]);

        this.feedService.invalidateCache(followerId);
        this.eventsService.emitUserFollowed({ followerId, followedId });
    }

    /**
     * Dejar de seguir a un usuario
     */
    async unfollow(followerId: number, followedId: number): Promise<void> {
        const isFollowing = await FollowsRepository.isFollowing(followerId, followedId);
        if (!isFollowing) {
            return; // No seguis a este usuario, idempotente
        }

        // Remover follow
        await FollowsRepository.removeFollow(followerId, followedId);

        // Actualizar conteos
        await Promise.all([
            db.update(user)
                .set({ followingCount: sql`${user.followingCount} - 1` })
                .where(eq(user.userId, followerId)),

            db.update(user)
                .set({ followersCount: sql`${user.followersCount} - 1` })
                .where(eq(user.userId, followedId))
        ]);

        this.feedService.invalidateCache(followerId);
        this.eventsService.emitUserUnfollowed({ followerId, followedId });
    }

    /**
     * Obtiene la lista de seguidores de un usuario
     */
    async getFollowers(userId: number, options: FollowsPaginationOptions): Promise<FollowUserInfo[]> {
        return FollowsRepository.getFollowers(userId, options);
    }

    /**
     * Obtiene la lista de usuarios que sigue un usuario
     */
    async getFollowing(userId: number, options: FollowsPaginationOptions): Promise<FollowUserInfo[]> {
        return FollowsRepository.getFollowing(userId, options);
    }

    /**
     * Verifica si un usuario sigue a otro
     */
    async isFollowing(followerId: number, followedId: number): Promise<boolean> {
        return FollowsRepository.isFollowing(followerId, followedId);
    }
}
