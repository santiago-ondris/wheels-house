import { Controller, Get, Query, Request } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedQueryDto, FeedResponseDto, FeedItemDto } from './dto/feed.dto';
import type { FeedEventWithUser } from './feed.repository';

interface AuthenticatedRequest extends Request {
    user?: {
        userId: number;
        username: string;
    }
}

@Controller('feed')
export class FeedController {
    constructor(private readonly feedService: FeedService) { }

    @Get()
    async getFeed(
        @Query() query: FeedQueryDto,
        @Request() req: AuthenticatedRequest
    ): Promise<FeedResponseDto> {
        const page = parseInt(query.page || '0', 10);
        const limit = parseInt(query.limit || '20', 10);
        const tab = query.tab || 'explore';

        let result: { items: FeedEventWithUser[]; hasMore: boolean };

        if (tab === 'following' && req.user) {
            result = await this.feedService.getFeedFollowing(req.user.userId, page, limit);
        } else {
            // Default to explore (global)
            result = await this.feedService.getFeedGlobal(page, limit);
        }

        // Map to DTO
        const items: FeedItemDto[] = result.items.map(item => ({
            id: item.feedEventId,
            type: item.type,
            userId: item.userId,
            username: item.user.username,
            userFirstName: item.user.firstName,
            userLastName: item.user.lastName,
            userPicture: item.user.picture,
            carId: item.carId,
            groupId: item.groupId,
            metadata: item.metadata,
            createdAt: item.createdAt.toISOString(),
        }));

        return {
            items,
            hasMore: result.hasMore,
        };
    }
}

