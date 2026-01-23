import { apiRequest } from "./api";

export type FeedEventType = 'car_added' | 'milestone_reached' | 'wishlist_achieved' | 'group_created';

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

export interface FeedResponse {
    items: FeedItemDto[];
    hasMore: boolean;
}

export interface FeedQueryParams {
    tab?: 'explore' | 'following';
    page?: number;
    limit?: number;
}

/**
 * Social Service - API client for social features (feed, follow, etc.)
 */

/**
 * Fetches the social feed
 * @param params query parameters (tab, page, limit)
 */
export const getFeed = async (params: FeedQueryParams = {}): Promise<FeedResponse> => {
    const { tab = 'explore', page = 0, limit = 20 } = params;

    const queryParams = new URLSearchParams({
        tab,
        page: page.toString(),
        limit: limit.toString(),
    });

    return await apiRequest<FeedResponse>(`/feed?${queryParams.toString()}`);
};
