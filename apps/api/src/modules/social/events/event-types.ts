export const EVENTS = {
    // ==================== Car Events ====================
    /** Se emite cuando un usuario agrega un auto a su coleccion */
    CAR_ADDED: 'car.added',
    /** Se emite cuando un usuario actualiza un auto de su coleccion */
    CAR_UPDATED: 'car.updated',
    /** Se emite cuando un usuario elimina un auto de su coleccion */
    CAR_DELETED: 'car.deleted',

    // ==================== Wishlist Events ====================
    /** Se emite cuando un usuario agrega un auto a su lista de deseos */
    WISHLIST_ITEM_ADDED: 'wishlist.item_added',
    /** Se emite cuando un usuario marca un auto de su lista de deseos como logrado (movido a coleccion) */
    WISHLIST_ITEM_ACHIEVED: 'wishlist.item_achieved',

    // ==================== Group Events ====================
    /** Se emite cuando un usuario crea un nuevo grupo */
    GROUP_CREATED: 'group.created',

    // ==================== Social Events ====================
    /** Se emite cuando un usuario sigue a otro usuario */
    USER_FOLLOWED: 'user.followed',
    /** Se emite cuando un usuario deja de seguir a otro usuario */
    USER_UNFOLLOWED: 'user.unfollowed',
    /** Se emite cuando un usuario le da like a un auto */
    CAR_LIKED: 'car.liked',
    /** Se emite cuando un usuario le quita like a un auto */
    CAR_UNLIKED: 'car.unliked',

    // ==================== Post Events ====================
    /** Se emite cuando un usuario crea un post de busqueda o oferta */
    POST_CREATED: 'post.created',
    /** Se emite cuando un usuario marca un post como resuelto */
    POST_RESOLVED: 'post.resolved',
    /** Se emite cuando un post expira automaticamente */
    POST_EXPIRED: 'post.expired',

    // ==================== Milestone Events ====================
    /** Se emite cuando un usuario alcanza un hito en su coleccion (50, 100, 250, etc.) */
    MILESTONE_REACHED: 'milestone.reached',

    // ==================== Moderation Events ====================
    /** Se emite cuando un usuario reporta contenido */
    CONTENT_REPORTED: 'content.reported',
    /** Se emite cuando se alcanza un umbral de reportes para contenido */
    REPORT_THRESHOLD_REACHED: 'report.threshold_reached',
} as const;

export type EventName = typeof EVENTS[keyof typeof EVENTS];

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
