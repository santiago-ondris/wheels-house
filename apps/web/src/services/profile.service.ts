import { apiRequest } from "./api";
import { CarData } from "./car.service";

export interface PublicProfile {
    username: string;
    firstName: string;
    lastName: string;
    biography?: string;
    picture?: string;
    createdDate?: string;
    totalCars: number;
    totalGroups: number;
    cars: CarData[];
}

export interface DistributionItem {
    name: string;
    count: number;
}

export interface UserStats {
    totalCars: number;
    distinctBrands: number;
    favoriteNationality: string | null;
    totalPhotos: number;
    brandDistribution: DistributionItem[];
    manufacturerDistribution: DistributionItem[];
    scaleDistribution: DistributionItem[];
    colorDistribution: DistributionItem[];
    conditionDistribution: DistributionItem[];
}

export interface BasicUser {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    picture?: string;
}

export async function getPublicProfile(username: string): Promise<PublicProfile> {
    return apiRequest<PublicProfile>(`/profile/${username}`);
}

export async function searchUsers(query: string): Promise<BasicUser[]> {
    return apiRequest<BasicUser[]>(`/search?q=${encodeURIComponent(query)}`);
}

export async function getUserStats(username: string): Promise<UserStats> {
    return apiRequest<UserStats>(`/stats/${username}`);
}

export async function updateProfile(data: Partial<PublicProfile>): Promise<PublicProfile> {
    const token = localStorage.getItem("auth_token");
    return apiRequest<PublicProfile>('/user/update-info', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });
}

export async function updatePassword(oldPassword: string, newPassword: string): Promise<void> {
    const token = localStorage.getItem("auth_token");
    return apiRequest<void>('/user/update-password', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword }),
    });
}

export async function deleteUser(): Promise<void> {
    const token = localStorage.getItem("auth_token");
    return apiRequest<void>('/user', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });
}

export async function requestPasswordRecovery(usernameOrEmail: string): Promise<void> {
    return apiRequest<void>('/user/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ usernameOrEmail }),
    });
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
    return apiRequest<void>(`/user/reset-password/${token}`, {
        method: 'POST',
        body: JSON.stringify({ newPassword }),
    });
}
