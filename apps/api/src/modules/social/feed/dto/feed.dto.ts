export class FeedQueryDto {
    tab?: 'explore' | 'following';
    page?: string; // Viene como string de query params
    limit?: string; // Viene como string de query params
    filter?: 'all' | 'cars' | 'milestones' | 'wishlist';
}

export interface FeedItemDto {
    id: number;
    type: string;
    userId: number;
    username: string;
    userFirstName: string;
    userLastName: string;
    userPicture: string | null;
    carId?: number | null;
    groupId?: number | null;
    metadata?: any;
    createdAt: string;
}

export interface FeedResponseDto {
    items: FeedItemDto[];
    hasMore: boolean;
}
