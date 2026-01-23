import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENTS } from './event-types';
import type {
    CarAddedPayload,
    WishlistItemAchievedPayload,
    GroupCreatedPayload,
    MilestoneReachedPayload,
    UserFollowedPayload,
    CarLikedPayload,
} from './event-types';
import { FeedService } from '../feed/feed.service';

/**
 * EventsSubscriber - Escucha eventos y crea entradas en el feed
 * 
 * Este subscriber recibe todos los eventos emitidos por EventsService
 * y crea las correspondientes entradas en la tabla feed_events.
 */
@Injectable()
export class EventsSubscriber {
    private readonly logger = new Logger(EventsSubscriber.name);

    constructor(private readonly feedService: FeedService) { }

    // ==================== Car Events ====================

    @OnEvent(EVENTS.CAR_ADDED)
    async handleCarAdded(payload: CarAddedPayload): Promise<void> {
        this.logger.log(`🚗 Car added: User ${payload.userId} added car ${payload.carId} (${payload.carName})`);

        await this.feedService.createEvent({
            type: 'car_added',
            userId: payload.userId,
            carId: payload.carId,
            metadata: {
                carName: payload.carName,
                carImage: payload.carImage,
                isFromWishlist: payload.isFromWishlist
            }
        });
    }

    // ==================== Wishlist Events ====================

    @OnEvent(EVENTS.WISHLIST_ITEM_ACHIEVED)
    async handleWishlistItemAchieved(payload: WishlistItemAchievedPayload): Promise<void> {
        this.logger.log(`🎯 Wishlist achieved: User ${payload.userId} got ${payload.carName} from wishlist!`);

        await this.feedService.createEvent({
            type: 'wishlist_achieved',
            userId: payload.userId,
            carId: payload.carId,
            metadata: {
                carName: payload.carName,
                carImage: payload.carImage
            }
        });
    }

    // ==================== Group Events ====================

    @OnEvent(EVENTS.GROUP_CREATED)
    async handleGroupCreated(payload: GroupCreatedPayload): Promise<void> {
        // Solo crear evento si el grupo tiene 5+ autos (según spec)
        if (payload.carCount >= 5) {
            this.logger.log(`📁 Group created: User ${payload.userId} created "${payload.groupName}" with ${payload.carCount} cars`);

            await this.feedService.createEvent({
                type: 'group_created',
                userId: payload.userId,
                groupId: payload.groupId,
                metadata: {
                    groupName: payload.groupName,
                    groupImage: payload.groupImage,
                    carCount: payload.carCount
                }
            });
        }
    }

    // ==================== Milestone Events ====================

    @OnEvent(EVENTS.MILESTONE_REACHED)
    async handleMilestoneReached(payload: MilestoneReachedPayload): Promise<void> {
        this.logger.log(`🎉 Milestone reached: User ${payload.userId} reached ${payload.milestone} cars! (Total: ${payload.totalCars})`);

        await this.feedService.createEvent({
            type: 'milestone_reached',
            userId: payload.userId,
            metadata: { milestone: payload.milestone }
        });
    }

    // ==================== Social Events ====================

    @OnEvent(EVENTS.USER_FOLLOWED)
    async handleUserFollowed(payload: UserFollowedPayload): Promise<void> {
        this.logger.log(`👥 User followed: User ${payload.followerId} followed user ${payload.followedId}`);

        // TODO: Implementar cuando tengamos NotificationsService
    }

    @OnEvent(EVENTS.CAR_LIKED)
    async handleCarLiked(payload: CarLikedPayload): Promise<void> {
        this.logger.log(`❤️ Car liked: User ${payload.userId} liked car ${payload.carId} (owner: ${payload.ownerId})`);

        // TODO: Implementar cuando tengamos NotificationsService
    }
}
