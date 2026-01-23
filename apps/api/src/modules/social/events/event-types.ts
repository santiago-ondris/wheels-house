/**
 * Social Events - Event Type Definitions
 * 
 * These are the events that drive the social system.
 * When actions happen (car added, user followed, etc.), events are emitted
 * which are then consumed by subscribers to create feed entries, notifications, etc.
 */

export const EVENTS = {
    // ==================== Car Events ====================
    /** Emitted when a user adds a new car to their collection */
    CAR_ADDED: 'car.added',
    /** Emitted when a user updates a car's information */
    CAR_UPDATED: 'car.updated',
    /** Emitted when a user deletes a car from their collection */
    CAR_DELETED: 'car.deleted',

    // ==================== Wishlist Events ====================
    /** Emitted when a user adds an item to their wishlist */
    WISHLIST_ITEM_ADDED: 'wishlist.item_added',
    /** Emitted when a user marks a wishlist item as achieved (moved to collection) */
    WISHLIST_ITEM_ACHIEVED: 'wishlist.item_achieved',

    // ==================== Group Events ====================
    /** Emitted when a user creates a new group */
    GROUP_CREATED: 'group.created',

    // ==================== Social Events ====================
    /** Emitted when a user follows another user */
    USER_FOLLOWED: 'user.followed',
    /** Emitted when a user unfollows another user */
    USER_UNFOLLOWED: 'user.unfollowed',
    /** Emitted when a user likes a car */
    CAR_LIKED: 'car.liked',
    /** Emitted when a user unlikes a car */
    CAR_UNLIKED: 'car.unliked',

    // ==================== Post Events ====================
    /** Emitted when a user creates a search or offer post */
    POST_CREATED: 'post.created',
    /** Emitted when a user marks a post as resolved */
    POST_RESOLVED: 'post.resolved',
    /** Emitted when a post expires automatically */
    POST_EXPIRED: 'post.expired',

    // ==================== Milestone Events ====================
    /** Emitted when a user reaches a collection milestone (50, 100, 250, etc.) */
    MILESTONE_REACHED: 'milestone.reached',

    // ==================== Moderation Events ====================
    /** Emitted when content is reported by a user */
    CONTENT_REPORTED: 'content.reported',
    /** Emitted when a report threshold is reached for content */
    REPORT_THRESHOLD_REACHED: 'report.threshold_reached',
} as const;

/** Type-safe event names */
export type EventName = typeof EVENTS[keyof typeof EVENTS];

// ==================== Event Payload Interfaces ====================

export interface CarAddedPayload {
    userId: number;
    carId: number;
    carName: string;
    isFromWishlist?: boolean;
}

export interface CarUpdatedPayload {
    userId: number;
    carId: number;
}

export interface CarDeletedPayload {
    userId: number;
    carId: number;
}

export interface WishlistItemAchievedPayload {
    userId: number;
    carId: number;
    carName: string;
}

export interface GroupCreatedPayload {
    userId: number;
    groupId: number;
    groupName: string;
    carCount: number;
}

export interface UserFollowedPayload {
    followerId: number;
    followedId: number;
}

export interface UserUnfollowedPayload {
    followerId: number;
    followedId: number;
}

export interface CarLikedPayload {
    userId: number;
    carId: number;
    ownerId: number;
}

export interface MilestoneReachedPayload {
    userId: number;
    milestone: 50 | 100 | 250 | 500 | 1000;
    totalCars: number;
}

export interface PostCreatedPayload {
    userId: number;
    postId: number;
    postType: 'search' | 'offer';
}

export interface ContentReportedPayload {
    reporterId: number;
    contentType: 'car' | 'post' | 'user';
    contentId: number;
    reason: string;
}
