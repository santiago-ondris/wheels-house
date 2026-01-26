import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { FeedModule } from './feed/feed.module';
import { FollowsModule } from './follows/follows.module';
import { LikesModule } from './likes/likes.module';

@Module({
    imports: [EventsModule, FeedModule, FollowsModule, LikesModule],
    controllers: [],
    providers: [],
    exports: [EventsModule, FeedModule, FollowsModule, LikesModule],
})
export class SocialModule { }


