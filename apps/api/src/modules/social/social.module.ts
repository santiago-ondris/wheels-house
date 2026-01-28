import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { FeedModule } from './feed/feed.module';
import { FollowsModule } from './follows/follows.module';

import { LikesModule } from './likes/likes.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
    imports: [EventsModule, FeedModule, FollowsModule, LikesModule, NotificationsModule],
    controllers: [],
    providers: [],
    exports: [EventsModule, FeedModule, FollowsModule, LikesModule, NotificationsModule],
})
export class SocialModule { }


