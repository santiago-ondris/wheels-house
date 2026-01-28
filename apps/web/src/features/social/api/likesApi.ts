import { apiRequest } from "../../../services/api";

export interface LikerUserInfo {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    picture: string | null;
}

/**
 * Like a car
 */
export const likeCar = async (carId: number): Promise<{ success: boolean }> => {
    return await apiRequest<{ success: boolean }>(`/social/likes/car/${carId}`, { method: 'POST' });
};

/**
 * Unlike a car
 */
export const unlikeCar = async (carId: number): Promise<{ success: boolean }> => {
    return await apiRequest<{ success: boolean }>(`/social/likes/car/${carId}`, { method: 'DELETE' });
};

/**
 * Get users who liked a car
 */
export const getCarLikers = async (carId: number, page: number = 0, limit: number = 20): Promise<LikerUserInfo[]> => {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });
    return await apiRequest<LikerUserInfo[]>(`/social/likes/car/${carId}/likers?${queryParams.toString()}`);
};

/**
 * Like a group
 */
export const likeGroup = async (groupId: number): Promise<{ success: boolean }> => {
    return await apiRequest<{ success: boolean }>(`/social/likes/group/${groupId}`, { method: 'POST' });
};

/**
 * Unlike a group
 */
export const unlikeGroup = async (groupId: number): Promise<{ success: boolean }> => {
    return await apiRequest<{ success: boolean }>(`/social/likes/group/${groupId}`, { method: 'DELETE' });
};

/**
 * Get users who liked a group
 */
export const getGroupLikers = async (groupId: number, page: number = 0, limit: number = 20): Promise<LikerUserInfo[]> => {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });
    return await apiRequest<LikerUserInfo[]>(`/social/likes/group/${groupId}/likers?${queryParams.toString()}`);
};
