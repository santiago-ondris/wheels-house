import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { FeedModule } from './feed/feed.module';
import { FollowsModule } from './follows/follows.module';

@Module({
    imports: [EventsModule, FeedModule, FollowsModule],
    controllers: [],
    providers: [],
    exports: [EventsModule, FeedModule, FollowsModule],
})
export class SocialModule { }


