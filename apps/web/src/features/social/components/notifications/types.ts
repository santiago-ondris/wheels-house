export type NotificationType =
    | 'new_follower'
    | 'car_liked'
    | 'group_liked'
    | 'milestone_reached'
    | 'wishlist_match';

export interface NotificationMetadata {
    milestone?: number;
    carName?: string;
    carImage?: string;
    groupName?: string;
    groupImage?: string;
}

export interface Notification {
    notificationId: number;
    userId: number;
    type: NotificationType;
    actorId?: number;
    carId?: number;
    groupId?: number;
    metadata?: NotificationMetadata;
    read: boolean;
    createdAt: string;
    actor?: {
        userId: number;
        username: string;
        picture: string | null;
    };
}
