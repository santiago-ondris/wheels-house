import { Module, forwardRef } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { FollowsController } from './follows.controller';
import { EventsModule } from '../events/events.module';
import { FeedModule } from '../feed/feed.module';

@Module({
    imports: [EventsModule, forwardRef(() => FeedModule)],
    controllers: [FollowsController],
    providers: [FollowsService],
    exports: [FollowsService],
})
export class FollowsModule { }
