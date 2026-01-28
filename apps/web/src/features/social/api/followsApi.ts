import { apiRequest } from "../../../services/api";

export interface FollowUserInfo {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    picture: string | null;
    followersCount: number;
    followingCount: number;
    isFollowing?: boolean;
}

export interface FollowsResponse {
    items: FollowUserInfo[];
    hasMore: boolean;
}

export const followUser = async (userId: number): Promise<void> => {
    // Uses POST /users/:id/follow
    await apiRequest<void>(`/users/${userId}/follow`, { method: 'POST' });
};

export const unfollowUser = async (userId: number): Promise<void> => {
    // Uses DELETE /users/:id/unfollow
    await apiRequest<void>(`/users/${userId}/unfollow`, { method: 'DELETE' });
};

export const getFollowers = async (userId: number, page: number = 0, limit: number = 20): Promise<FollowUserInfo[]> => {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });
    return await apiRequest<FollowUserInfo[]>(`/users/${userId}/followers?${queryParams.toString()}`);
};

export const getFollowing = async (userId: number, page: number = 0, limit: number = 20): Promise<FollowUserInfo[]> => {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });
    return await apiRequest<FollowUserInfo[]>(`/users/${userId}/following?${queryParams.toString()}`);
};
