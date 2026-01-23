import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { FeedModule } from './feed/feed.module';

@Module({
    imports: [EventsModule, FeedModule],
    controllers: [],
    providers: [],
    exports: [EventsModule, FeedModule],
})
export class SocialModule { }


