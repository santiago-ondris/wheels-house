import { Module } from '@nestjs/common';
// Future imports for social submodules
// import { EventsModule } from './events/events.module';
// import { FeedModule } from './feed/feed.module';
// import { FollowsModule } from './follows/follows.module';
// import { LikesModule } from './likes/likes.module';
// import { NotificationsModule } from './notifications/notifications.module';

/**
 * SocialModule - Container for all social features
 * 
 * This module orchestrates the social functionality of Wheels House:
 * - Events: Event-driven architecture for feed generation
 * - Feed: Activity feed with events from the community
 * - Follows: User-to-user follow system
 * - Likes: Like system for cars and posts
 * - Notifications: User notification system
 * 
 * The module will be expanded as each feature is implemented in the sprint roadmap.
 */
@Module({
    imports: [
        // Submodules will be imported here as they are created
        // EventsModule,
        // FeedModule,
        // FollowsModule,
        // LikesModule,
        // NotificationsModule,
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class SocialModule { }
