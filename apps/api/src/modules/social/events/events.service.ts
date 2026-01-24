import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
    EVENTS,
    CarAddedPayload,
    CarDeletedPayload,
    WishlistItemAchievedPayload,
    GroupCreatedPayload,
    UserFollowedPayload,
    UserUnfollowedPayload,
    CarLikedPayload,
    MilestoneReachedPayload,
    PostCreatedPayload,
} from './event-types';

/**
 * EventsService - Wrapper para emitir eventos del sistema social
 * 
 * Este servicio proporciona una interfaz para emitir eventos.
 * Los eventos son escuchados por EventsSubscriber que crea entradas en el feed.
 */
@Injectable()
export class EventsService {
    constructor(private readonly eventEmitter: EventEmitter2) { }

    // ==================== Car Events ====================

    emitCarAdded(payload: CarAddedPayload): void {
        this.eventEmitter.emit(EVENTS.CAR_ADDED, payload);
    }

    emitCarDeleted(payload: CarDeletedPayload): void {
        this.eventEmitter.emit(EVENTS.CAR_DELETED, payload);
    }

    // ==================== Wishlist Events ====================

    emitWishlistItemAchieved(payload: WishlistItemAchievedPayload): void {
        this.eventEmitter.emit(EVENTS.WISHLIST_ITEM_ACHIEVED, payload);
    }

    // ==================== Group Events ====================

    emitGroupCreated(payload: GroupCreatedPayload): void {
        this.eventEmitter.emit(EVENTS.GROUP_CREATED, payload);
    }

    // ==================== Social Events ====================

    emitUserFollowed(payload: UserFollowedPayload): void {
        this.eventEmitter.emit(EVENTS.USER_FOLLOWED, payload);
    }

    emitUserUnfollowed(payload: UserUnfollowedPayload): void {
        this.eventEmitter.emit(EVENTS.USER_UNFOLLOWED, payload);
    }

    emitCarLiked(payload: CarLikedPayload): void {
        this.eventEmitter.emit(EVENTS.CAR_LIKED, payload);
    }

    // ==================== Milestone Events ====================

    emitMilestoneReached(payload: MilestoneReachedPayload): void {
        this.eventEmitter.emit(EVENTS.MILESTONE_REACHED, payload);
    }

    // ==================== Post Events ====================

    emitPostCreated(payload: PostCreatedPayload): void {
        this.eventEmitter.emit(EVENTS.POST_CREATED, payload);
    }
}
