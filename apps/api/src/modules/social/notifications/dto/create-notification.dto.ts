import { FeedEventMetadata } from '../../../../database/schema/social.schema';

export class CreateNotificationDto {
    userId: number;
    type: 'new_follower' | 'car_liked' | 'group_liked' | 'milestone_reached' | 'wishlist_match';
    actorId?: number;
    carId?: number;
    groupId?: number;
    metadata?: FeedEventMetadata;
    read?: boolean;
}
